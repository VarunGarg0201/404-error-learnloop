import type {
  MatchableProfile,
  MatchScore,
  MatchReason,
  MatchExplanation,
  DNATraitScore,
  EnergyMode,
} from "./types";

/* ═══════════════════════════════════════════════════════════
   Scoring Functions — Individual factor calculators
   ─────────────────────────────────────────────────────────
   Each returns 0–1. Pure functions. No side effects.
   ═══════════════════════════════════════════════════════════ */

/* ─── Jaccard similarity (set overlap) ─── */
function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  const setA = new Set(a.map((s) => s.toLowerCase()));
  const setB = new Set(b.map((s) => s.toLowerCase()));
  const intersection = [...setA].filter((x) => setB.has(x));
  const union = new Set([...setA, ...setB]);
  return intersection.length / union.size;
}

/* ─── Skill complementarity ───
   High score when A teaches what B wants to learn and vice versa.
   Also rewards direct overlap for study-buddy matching. */
export function scoreSkills(a: MatchableProfile, b: MatchableProfile): number {
  // A can teach what B wants to learn
  const aTeachesBLearns = jaccard(a.skillsToTeach, b.skillsToLearn);
  // B can teach what A wants to learn
  const bTeachesALearns = jaccard(b.skillsToTeach, a.skillsToLearn);
  // Direct skill overlap (for study buddies)
  const studyOverlap = jaccard(
    [...a.skillsToTeach, ...a.skillsToLearn],
    [...b.skillsToTeach, ...b.skillsToLearn]
  );

  // Complementarity weighted higher than study overlap
  return aTeachesBLearns * 0.4 + bTeachesALearns * 0.4 + studyOverlap * 0.2;
}

/* ─── Goals alignment ─── */
export function scoreGoals(a: MatchableProfile, b: MatchableProfile): number {
  return jaccard(a.goals, b.goals);
}

/* ─── Learning DNA compatibility ───
   Similar traits = good for collaboration.
   Complementary traits = good for teaching. */
export function scoreDNA(a: MatchableProfile, b: MatchableProfile): number {
  if (a.dnaTraits.length === 0 || b.dnaTraits.length === 0) return 0.5; // neutral

  let totalSim = 0;
  let count = 0;

  for (const traitA of a.dnaTraits) {
    const traitB = b.dnaTraits.find((t) => t.trait === traitA.trait);
    if (traitB) {
      // Similarity: closer scores = higher similarity
      const similarity = 1 - Math.abs(traitA.score - traitB.score);
      totalSim += similarity;
      count++;
    }
  }

  return count > 0 ? totalSim / count : 0.5;
}

/* ─── Availability overlap ─── */
export function scoreAvailability(
  a: MatchableProfile,
  b: MatchableProfile
): number {
  return jaccard(a.availability, b.availability);
}

/* ─── Learning style compatibility ─── */
export function scoreStyle(a: MatchableProfile, b: MatchableProfile): number {
  if (!a.learningStyle || !b.learningStyle) return 0.5;
  // Same style = 1.0 (great for study buddies)
  // Different but compatible = 0.6
  if (a.learningStyle === b.learningStyle) return 1.0;

  const compatPairs: Record<string, string[]> = {
    Visual: ["Hands-on", "Reading/Writing"],
    Auditory: ["Hands-on", "Visual"],
    "Reading/Writing": ["Visual", "Auditory"],
    "Hands-on": ["Visual", "Auditory"],
  };

  const compat = compatPairs[a.learningStyle];
  if (compat && compat.includes(b.learningStyle)) return 0.6;

  return 0.3;
}

/* ─── Language match ─── */
export function scoreLanguage(
  a: MatchableProfile,
  b: MatchableProfile
): number {
  if (!a.preferredLanguage || !b.preferredLanguage) return 0.5;
  if (a.preferredLanguage === b.preferredLanguage) return 1.0;
  // Both speak English (common lingua franca)
  return 0.3;
}

/* ─── Reputation / trustworthiness ─── */
export function scoreReputation(
  a: MatchableProfile,
  b: MatchableProfile
): number {
  // Normalize trust score to 0-1 (assume 5.0 max)
  const bTrust = Math.min(b.trustScore / 5.0, 1.0);
  // Normalize rating
  const bRating = Math.min(b.avgRating / 5.0, 1.0);
  // Sessions as experience signal (diminishing returns)
  const bExp = Math.min(b.totalSessions / 50, 1.0);

  return bTrust * 0.4 + bRating * 0.4 + bExp * 0.2;
}

/* ─── Energy mode compatibility ─── */
const ENERGY_COMPAT: Record<EnergyMode, EnergyMode[]> = {
  focused: ["focused", "learning"],
  social: ["social", "chill", "teaching"],
  chill: ["chill", "social"],
  teaching: ["learning", "social"],
  learning: ["teaching", "focused"],
  offline: [],
};

export function scoreEnergy(
  a: MatchableProfile,
  b: MatchableProfile
): number {
  if (b.energyMode === "offline") return 0;
  const compat = ENERGY_COMPAT[a.energyMode] || [];
  if (compat.includes(b.energyMode)) return 1.0;
  if (b.energyMode === a.energyMode) return 0.8;
  return 0.3;
}

/* ─── Collaboration behavior ───
   Based on KC, streak, and session count patterns. */
export function scoreBehavior(
  a: MatchableProfile,
  b: MatchableProfile
): number {
  // Active user signal
  const activeScore = Math.min(b.knowledgeCredits / 500, 1.0) * 0.3;
  // Consistency signal
  const streakScore = Math.min(b.streak / 14, 1.0) * 0.3;
  // Recency signal
  const now = Date.now();
  const lastActive = new Date(b.lastActiveAt).getTime();
  const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60);
  const recencyScore = Math.max(1 - hoursSinceActive / 168, 0) * 0.4; // 1 week decay

  return activeScore + streakScore + recencyScore;
}

/* ─── Compute all factor scores ─── */
export function computeScores(
  user: MatchableProfile,
  candidate: MatchableProfile
): Omit<MatchScore, "overall"> {
  return {
    skills: scoreSkills(user, candidate),
    goals: scoreGoals(user, candidate),
    dna: scoreDNA(user, candidate),
    availability: scoreAvailability(user, candidate),
    style: scoreStyle(user, candidate),
    language: scoreLanguage(user, candidate),
    reputation: scoreReputation(user, candidate),
    energy: scoreEnergy(user, candidate),
    behavior: scoreBehavior(user, candidate),
  };
}
