import type { BadgeDefinition, UserBadge } from "./types";

/* ═══════════════════════════════════════════════════════════
   Badge System
   ─────────────────────────────────────────────────────────
   Definitions and evaluation logic for user achievements.
   ═══════════════════════════════════════════════════════════ */

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ─── Milestones ───
  {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Joined LearnLoop during beta",
    tier: "diamond",
    icon: "Rocket",
    category: "milestone",
    requirement: { metric: "trust_score", threshold: 0 }, // Manual grant
  },
  
  // ─── Teaching Badges ───
  {
    id: "first_session",
    name: "First Session",
    description: "Taught your first 1:1 session",
    tier: "bronze",
    icon: "BookOpen",
    category: "teaching",
    requirement: { metric: "sessions_taught", threshold: 1 },
  },
  {
    id: "mentor_10",
    name: "Mentor (10+)",
    description: "Taught 10 sessions",
    tier: "silver",
    icon: "GraduationCap",
    category: "teaching",
    requirement: { metric: "sessions_taught", threshold: 10 },
  },
  {
    id: "master_teacher",
    name: "Master Teacher",
    description: "Taught 50 sessions with a 4.5+ average rating",
    tier: "gold",
    icon: "Crown",
    category: "teaching",
    requirement: { metric: "sessions_taught", threshold: 50 },
  },

  // ─── Community / KC Badges ───
  {
    id: "kc_100",
    name: "Helpful Hand",
    description: "Earned 100 Knowledge Credits",
    tier: "bronze",
    icon: "Heart",
    category: "community",
    requirement: { metric: "kc_earned", threshold: 100 },
  },
  {
    id: "kc_1000",
    name: "Community Pillar",
    description: "Earned 1,000 Knowledge Credits",
    tier: "silver",
    icon: "Shield",
    category: "community",
    requirement: { metric: "kc_earned", threshold: 1000 },
  },
  {
    id: "kc_10000",
    name: "Loop Legend",
    description: "Earned 10,000 Knowledge Credits",
    tier: "diamond",
    icon: "Sparkles",
    category: "community",
    requirement: { metric: "kc_earned", threshold: 10000 },
  },

  // ─── Streak Badges ───
  {
    id: "streak_7",
    name: "Consistency",
    description: "Maintained a 7-day learning streak",
    tier: "bronze",
    icon: "Flame",
    category: "learning",
    requirement: { metric: "streak_days", threshold: 7 },
  },
  {
    id: "streak_30",
    name: "Unstoppable",
    description: "Maintained a 30-day learning streak",
    tier: "gold",
    icon: "Target",
    category: "learning",
    requirement: { metric: "streak_days", threshold: 30 },
  },
];

/**
 * Evaluates current user stats against badge requirements to find newly unlocked badges.
 */
export function evaluateBadges(
  currentBadges: UserBadge[],
  stats: {
    sessionsTaught: number;
    kcEarned: number;
    helpAnswered: number;
    streakDays: number;
    trustScore: number;
  }
): BadgeDefinition[] {
  const unlockedBadgeIds = new Set(currentBadges.map((b) => b.badgeId));
  const newUnlocks: BadgeDefinition[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (unlockedBadgeIds.has(badge.id)) continue;

    const { metric, threshold } = badge.requirement;
    
    // Skip manual grants
    if (threshold === 0 && metric === "trust_score") continue;

    let qualifies = false;
    switch (metric) {
      case "sessions_taught":
        qualifies = stats.sessionsTaught >= threshold;
        break;
      case "kc_earned":
        qualifies = stats.kcEarned >= threshold;
        break;
      case "help_answered":
        qualifies = stats.helpAnswered >= threshold;
        break;
      case "streak_days":
        qualifies = stats.streakDays >= threshold;
        break;
      case "trust_score":
        qualifies = stats.trustScore >= threshold;
        break;
    }

    if (qualifies) {
      newUnlocks.push(badge);
    }
  }

  return newUnlocks;
}
