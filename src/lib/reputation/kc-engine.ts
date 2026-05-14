import { KC_ACTIONS, SPAM_LIMITS } from "./types";
import type { KCActionType, KCActionDefinition } from "./types";
import type { SessionFeedback } from "@/types";

/* ═══════════════════════════════════════════════════════════
   Knowledge Credit Engine
   ─────────────────────────────────────────────────────────
   Handles KC calculations, multipliers, and anti-spam logic.
   ═══════════════════════════════════════════════════════════ */

export interface KCAwardResult {
  granted: boolean;
  amount: number;
  reason: string;
  error?: string;
}

/**
 * Validates if an award exceeds daily spam limits.
 * Note: In Phase 3, this state should be managed in Redis.
 */
export function checkSpamLimits(
  userId: string,
  targetUserId: string | null,
  amount: number,
  todayTotalKC: number,
  todayTotalFromTarget: number
): { valid: boolean; adjustedAmount: number; reason?: string } {
  // Check global daily cap
  if (todayTotalKC + amount > SPAM_LIMITS.MAX_DAILY_TOTAL) {
    const allowed = Math.max(0, SPAM_LIMITS.MAX_DAILY_TOTAL - todayTotalKC);
    return {
      valid: allowed > 0,
      adjustedAmount: allowed,
      reason: allowed > 0 ? "Daily KC cap reached partially" : "Daily KC cap reached",
    };
  }

  // Check peer-to-peer daily cap (prevent farming with friends)
  if (targetUserId && todayTotalFromTarget + amount > SPAM_LIMITS.MAX_DAILY_FROM_SINGLE_USER) {
    const allowed = Math.max(0, SPAM_LIMITS.MAX_DAILY_FROM_SINGLE_USER - todayTotalFromTarget);
    return {
      valid: allowed > 0,
      adjustedAmount: allowed,
      reason: "Daily limit from this user reached to prevent spam",
    };
  }

  return { valid: true, adjustedAmount: amount };
}

/**
 * Calculates a multiplier based on the session feedback rating.
 * 5 stars = 1.5x
 * 4 stars = 1.2x
 * 3 stars = 1.0x
 * 2 stars = 0.5x
 * 1 star = 0x (or penalty depending on config)
 */
export function getFeedbackMultiplier(feedback: SessionFeedback): number {
  const rating = feedback.overallSatisfaction;
  if (rating >= 4.8) return 1.5;
  if (rating >= 4.0) return 1.2;
  if (rating >= 3.0) return 1.0;
  if (rating >= 2.0) return 0.5;
  return 0.0;
}

/**
 * Core function to calculate and validate an award.
 */
export function calculateAward(
  actionType: KCActionType,
  context: {
    feedback?: SessionFeedback;
    durationMins?: number; // E.g., longer sessions give slight bonus
    todayTotalKC: number;
    todayTotalFromTarget: number;
    targetUserId?: string;
  }
): KCAwardResult {
  const action = KC_ACTIONS[actionType];
  let calculatedAmount = action.baseAmount;

  // Apply multipliers
  if (actionType === "RECEIVE_FEEDBACK" && context.feedback) {
    // Base amount for feedback is usually 5, multiplied by rating quality
    const baseFeedback = 5;
    calculatedAmount = Math.round(baseFeedback * getFeedbackMultiplier(context.feedback));
  } else if (actionType === "TEACH_SESSION" && context.durationMins) {
    // Bonus for longer sessions (+1 KC per 15 mins over 30mins, max +5)
    if (context.durationMins > 30) {
      const bonus = Math.min(5, Math.floor((context.durationMins - 30) / 15));
      calculatedAmount += bonus;
    }
  }

  // Check anti-spam
  const spamCheck = checkSpamLimits(
    "current_user", // Abstracted for pure logic
    context.targetUserId || null,
    calculatedAmount,
    context.todayTotalKC,
    context.todayTotalFromTarget
  );

  if (!spamCheck.valid || spamCheck.adjustedAmount <= 0) {
    return {
      granted: false,
      amount: 0,
      reason: spamCheck.reason || "Anti-spam limits exceeded",
      error: "SPAM_LIMIT_REACHED",
    };
  }

  return {
    granted: true,
    amount: spamCheck.adjustedAmount,
    reason: spamCheck.reason ? `${action.description} (${spamCheck.reason})` : action.description,
  };
}
