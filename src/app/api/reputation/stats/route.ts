import { NextResponse } from "next/server";
import { computeTrustMetrics } from "@/lib/reputation/trust-score";
import { evaluateBadges } from "@/lib/reputation/badges";
import { calculateStreak } from "@/lib/reputation/streaks";

/* ═══════════════════════════════════════════════════════════
   Reputation Stats API
   ─────────────────────────────────────────────────────────
   Returns aggregated user reputation metrics, computed via
   the reputation engine algorithms.
   ═══════════════════════════════════════════════════════════ */

export async function GET(request: Request) {
  try {
    // Demo feedback data to drive the trust score algorithm
    const mockFeedbacks = [
      { overallSatisfaction: 5, helpfulness: 5, clarity: 5, patience: 5, accuracy: 5, beginnerFriendliness: 5, communicationQuality: 5, conceptUnderstanding: 5, comment: "Great!" },
      { overallSatisfaction: 4, helpfulness: 4, clarity: 4, patience: 5, accuracy: 4, beginnerFriendliness: 4, communicationQuality: 4, conceptUnderstanding: 4, comment: "Good job." },
      { overallSatisfaction: 5, helpfulness: 5, clarity: 4, patience: 5, accuracy: 5, beginnerFriendliness: 5, communicationQuality: 4, conceptUnderstanding: 5, comment: "Very patient." },
    ];

    const mockActivityDates = [
      new Date().toISOString(),
      new Date(Date.now() - 86400000).toISOString(),
      new Date(Date.now() - 86400000 * 2).toISOString(),
    ];

    const trustMetrics = computeTrustMetrics(mockFeedbacks, 0);
    const streakInfo = calculateStreak(mockActivityDates);

    const stats = {
      sessionsTaught: 12,
      kcEarned: 450,
      helpAnswered: 20,
      streakDays: streakInfo.currentStreak,
      trustScore: trustMetrics.overallTrust,
    };

    // Calculate newly unlocked badges based on stats
    const unlockedBadges = evaluateBadges([], stats);

    return NextResponse.json({
      data: {
        trustMetrics,
        streakInfo,
        stats,
        badges: unlockedBadges,
      },
      success: true,
    });
  } catch (error) {
    console.error("Reputation API error:", error);
    return NextResponse.json(
      { data: null, error: "Failed to fetch reputation stats", success: false },
      { status: 500 }
    );
  }
}
