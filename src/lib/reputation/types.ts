/* ═══════════════════════════════════════════════════════════
   Knowledge Credit & Reputation Types
   ─────────────────────────────────────────────────────────
   Core types for the gamified LearnLoop economy.
   ═══════════════════════════════════════════════════════════ */

import type { SessionFeedback } from "@/types";

/* ─── Knowledge Credit Actions ─── */
export type KCActionType =
  | "HOST_ROOM"
  | "TEACH_SESSION"
  | "ANSWER_HELP"
  | "RECEIVE_FEEDBACK"
  | "DAILY_STREAK"
  | "REPORTED_SPAM" // Negative action
  | "LOW_QUALITY";  // Negative action

export interface KCActionDefinition {
  type: KCActionType;
  baseAmount: number;
  category: "teaching" | "helping" | "collaboration" | "feedback" | "consistency" | "penalty";
  description: string;
}

export const KC_ACTIONS: Record<KCActionType, KCActionDefinition> = {
  HOST_ROOM: { type: "HOST_ROOM", baseAmount: 10, category: "teaching", description: "Hosted a study room" },
  TEACH_SESSION: { type: "TEACH_SESSION", baseAmount: 15, category: "teaching", description: "Taught a 1:1 session" },
  ANSWER_HELP: { type: "ANSWER_HELP", baseAmount: 5, category: "helping", description: "Answered a quick help request" },
  RECEIVE_FEEDBACK: { type: "RECEIVE_FEEDBACK", baseAmount: 0, category: "feedback", description: "Received peer feedback" }, // Variable based on rating
  DAILY_STREAK: { type: "DAILY_STREAK", baseAmount: 2, category: "consistency", description: "Daily login streak" },
  REPORTED_SPAM: { type: "REPORTED_SPAM", baseAmount: -50, category: "penalty", description: "Flagged for spam/abuse" },
  LOW_QUALITY: { type: "LOW_QUALITY", baseAmount: -10, category: "penalty", description: "Consistently low feedback" },
};

/* ─── Badges ─── */
export type BadgeTier = "bronze" | "silver" | "gold" | "diamond";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  tier: BadgeTier;
  icon: string; // Emoji or Lucide icon name
  category: "teaching" | "learning" | "community" | "milestone";
  requirement: {
    metric: "sessions_taught" | "kc_earned" | "help_answered" | "streak_days" | "trust_score";
    threshold: number;
  };
}

export interface UserBadge {
  badgeId: string;
  unlockedAt: string;
  isPinned?: boolean;
}

/* ─── Trust Metrics ─── */
export interface TrustMetrics {
  overallTrust: number; // 0.0 - 5.0
  helpfulness: number;  // 0.0 - 5.0
  totalRatings: number;
  feedbackBreakdown: {
    clarity: number;
    patience: number;
    accuracy: number;
    beginnerFriendliness: number;
    communication: number;
  };
}

/* ─── Anti-Spam Constraints ─── */
export interface KCSpamLimits {
  MAX_DAILY_TOTAL: number;
  MAX_DAILY_FROM_SINGLE_USER: number;
}

export const SPAM_LIMITS: KCSpamLimits = {
  MAX_DAILY_TOTAL: 300,
  MAX_DAILY_FROM_SINGLE_USER: 50,
};
