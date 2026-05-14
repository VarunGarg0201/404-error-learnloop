import type {
  MatchableProfile,
  MatchResult,
  MatchScore,
  MatchQuery,
  MatchWeights,
  MatchExplanation,
  MatchReason,
} from "./types";
import { DEFAULT_WEIGHTS } from "./types";
import { computeScores } from "./scoring";
import { generateReasons, generateExplanation, generateAIExplanation } from "./explanations";

/* ═══════════════════════════════════════════════════════════
   AI Matching Engine
   ─────────────────────────────────────────────────────────
   Orchestrates scoring, filtering, ranking, and explanation
   generation for peer-to-peer learning matches.

   Architecture:
   1. Filter candidates (campus, availability, online status)
   2. Score each candidate across 9 factors
   3. Compute weighted overall score
   4. Generate human-readable explanations
   5. Rank and return top matches

   Phase 1: Deterministic scoring (current)
   Phase 2: LLM re-ranking for personality nuance
   Phase 3: Realtime matching with Supabase subscriptions
   ═══════════════════════════════════════════════════════════ */

/* ─── Weighted overall score ─── */
function computeOverall(
  scores: Omit<MatchScore, "overall">,
  weights: MatchWeights
): number {
  let total = 0;
  let weightSum = 0;

  for (const [key, weight] of Object.entries(weights) as [
    keyof MatchWeights,
    number
  ][]) {
    total += (scores[key] || 0) * weight;
    weightSum += weight;
  }

  // Normalize to 0–100
  return Math.round((total / weightSum) * 100);
}

/* ─── Filter candidates ─── */
function filterCandidates(
  candidates: MatchableProfile[],
  query: MatchQuery
): MatchableProfile[] {
  return candidates.filter((c) => {
    // Exclude self
    if (c.id === query.userId) return false;

    const f = query.filters;
    if (!f) return true;

    // Campus filter
    if (f.campus && c.campus !== f.campus) return false;

    // Stream filter
    if (f.stream && c.stream !== f.stream) return false;

    // Online only
    if (f.onlineOnly && !c.isOnline) return false;

    // Energy mode filter
    if (f.energyMode && c.energyMode !== f.energyMode) return false;

    // Skills filter (candidate must have at least one matching skill)
    if (f.skills && f.skills.length > 0) {
      const candidateSkills = [
        ...c.skillsToTeach,
        ...c.skillsToLearn,
      ].map((s) => s.toLowerCase());
      const hasMatch = f.skills.some((s) =>
        candidateSkills.includes(s.toLowerCase())
      );
      if (!hasMatch) return false;
    }

    // Availability filter
    if (f.availability && f.availability.length > 0) {
      const hasOverlap = f.availability.some((a) =>
        c.availability.includes(a)
      );
      if (!hasOverlap) return false;
    }

    return true;
  });
}

/* ─── Main matching function ─── */
export async function findMatches(
  user: MatchableProfile,
  candidates: MatchableProfile[],
  query: MatchQuery
): Promise<MatchResult[]> {
  const weights = { ...DEFAULT_WEIGHTS, ...(query.weights || {}) };
  const limit = query.limit || 10;
  const minScore = query.minScore || 30;

  // Step 1: Filter
  const filtered = filterCandidates(candidates, query);

  // Step 2: Score + Explain
  const results: MatchResult[] = filtered.map((candidate) => {
    const scores = computeScores(user, candidate);
    const overall = computeOverall(scores, weights);
    const fullScore: MatchScore = { overall, ...scores };
    const reasons = generateReasons(user, candidate, scores);
    const explanation = generateExplanation(user, candidate, scores, reasons);

    return {
      user: candidate,
      score: fullScore,
      explanation,
      reasons,
    };
  });

  // Step 3: Filter by minimum score
  const qualifying = results.filter((r) => r.score.overall >= minScore);

  // Step 4: Sort by overall score descending
  qualifying.sort((a, b) => b.score.overall - a.score.overall);

  // Step 5: Return top N
  return qualifying.slice(0, limit);
}

/* ─── Single match explanation ─── */
export async function explainMatch(
  user: MatchableProfile,
  candidate: MatchableProfile
): Promise<{
  score: MatchScore;
  explanation: MatchExplanation;
  reasons: MatchReason[];
}> {
  const scores = computeScores(user, candidate);
  const overall = computeOverall(scores, DEFAULT_WEIGHTS);
  const fullScore: MatchScore = { overall, ...scores };
  const reasons = generateReasons(user, candidate, scores);
  const explanation = await generateAIExplanation(user, candidate, reasons);

  return { score: fullScore, explanation, reasons };
}

// Re-export types for convenience
export type {
  MatchResult,
  MatchScore,
  MatchQuery,
  MatchableProfile,
  MatchExplanation,
  MatchReason,
} from "./types";
