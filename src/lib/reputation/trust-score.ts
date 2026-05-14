import type { SessionFeedback } from "@/types";
import type { TrustMetrics } from "./types";

/* ═══════════════════════════════════════════════════════════
   Trust & Helpfulness Engine
   ─────────────────────────────────────────────────────────
   Algorithms to compute a user's Trust Score (0-5) based on
   rolling averages, feedback quality, and penalty weightings.
   ═══════════════════════════════════════════════════════════ */

const MIN_SESSIONS_FOR_TRUST = 3;

/**
 * Computes the aggregate trust metrics from a history of session feedback.
 * Uses a weighted average where more recent feedback matters slightly more.
 */
export function computeTrustMetrics(
  feedbacks: SessionFeedback[],
  spamReportsCount: number = 0
): TrustMetrics {
  const totalRatings = feedbacks.length;

  // Default empty state
  if (totalRatings === 0) {
    return {
      overallTrust: 0,
      helpfulness: 0,
      totalRatings: 0,
      feedbackBreakdown: {
        clarity: 0,
        patience: 0,
        accuracy: 0,
        beginnerFriendliness: 0,
        communication: 0,
      },
    };
  }

  let weightedTrustSum = 0;
  let weightedHelpfulnessSum = 0;
  let weightTotal = 0;

  const breakdownSums = {
    clarity: 0,
    patience: 0,
    accuracy: 0,
    beginnerFriendliness: 0,
    communication: 0,
  };

  // Iterate oldest to newest so newest gets higher weight
  // Simple linear weight: i + 1
  feedbacks.forEach((fb, idx) => {
    const weight = idx + 1;
    weightTotal += weight;

    weightedTrustSum += fb.overallSatisfaction * weight;
    weightedHelpfulnessSum += fb.helpfulness * weight;

    breakdownSums.clarity += fb.clarity;
    breakdownSums.patience += fb.patience;
    breakdownSums.accuracy += fb.accuracy;
    breakdownSums.beginnerFriendliness += fb.beginnerFriendliness;
    breakdownSums.communication += fb.communicationQuality;
  });

  let rawTrust = weightedTrustSum / weightTotal;
  const rawHelpfulness = weightedHelpfulnessSum / weightTotal;

  // Apply penalties
  // 1 spam report = -0.5 trust
  if (spamReportsCount > 0) {
    rawTrust = Math.max(0, rawTrust - (spamReportsCount * 0.5));
  }

  // Not enough data for a "reliable" score, cap it or flag it
  // In UI, if trustScore is 0 but sessions > 0, we can show "Evaluating"
  const finalTrust = totalRatings >= MIN_SESSIONS_FOR_TRUST ? rawTrust : rawTrust * 0.8;

  return {
    overallTrust: Number(finalTrust.toFixed(1)),
    helpfulness: Number(rawHelpfulness.toFixed(1)),
    totalRatings,
    feedbackBreakdown: {
      clarity: Number((breakdownSums.clarity / totalRatings).toFixed(1)),
      patience: Number((breakdownSums.patience / totalRatings).toFixed(1)),
      accuracy: Number((breakdownSums.accuracy / totalRatings).toFixed(1)),
      beginnerFriendliness: Number((breakdownSums.beginnerFriendliness / totalRatings).toFixed(1)),
      communication: Number((breakdownSums.communication / totalRatings).toFixed(1)),
    },
  };
}
