import type { SessionFeedback, LearningDNATrait } from "@/types";

/* ═══════════════════════════════════════════════════════════
   AI DNA Inference Engine
   ─────────────────────────────────────────────────────────
   Maps raw session feedback arrays into continuous DNA traits.
   ═══════════════════════════════════════════════════════════ */

// Base dictionary of possible inferred traits
const TRAIT_DICTIONARY = {
  clarity: { name: "Clear Communicator", category: "teaching" },
  patience: { name: "Patient Mentor", category: "teaching" },
  beginnerFriendliness: { name: "Beginner-Friendly", category: "teaching" },
  communicationQuality: { name: "Active Listener", category: "social" },
  conceptUnderstanding: { name: "Concept Validator", category: "learning" },
  helpfulness: { name: "Problem Solver", category: "learning" },
} as const;

type FeedbackKey = keyof typeof TRAIT_DICTIONARY;

/**
 * Processes an array of historical session feedback to infer
 * a baseline set of DNA traits.
 */
export function inferDNATraits(
  feedbacks: SessionFeedback[],
  existingTraits: LearningDNATrait[] = []
): LearningDNATrait[] {
  if (!feedbacks || feedbacks.length === 0) return existingTraits;

  const totalSessions = feedbacks.length;
  const inferredMap = new Map<string, LearningDNATrait>();

  // Initialize map with existing traits (so we don't lose self-assessed ones or visibility settings)
  existingTraits.forEach((trait) => {
    inferredMap.set(trait.id, trait);
  });

  // Calculate averages across feedback axes
  const sums = {
    clarity: 0,
    patience: 0,
    beginnerFriendliness: 0,
    communicationQuality: 0,
    conceptUnderstanding: 0,
    helpfulness: 0,
  };

  feedbacks.forEach((fb) => {
    sums.clarity += fb.clarity;
    sums.patience += fb.patience;
    sums.beginnerFriendliness += fb.beginnerFriendliness;
    sums.communicationQuality += fb.communicationQuality;
    sums.conceptUnderstanding += fb.conceptUnderstanding;
    sums.helpfulness += fb.helpfulness;
  });

  // Convert averages to traits
  (Object.keys(sums) as FeedbackKey[]).forEach((key) => {
    const avgScore = sums[key] / totalSessions;
    const baseConfidence = avgScore / 5; // Normalize 0-5 to 0-1

    // Confidence grows with the number of sessions (logarithmic scaling)
    // Formula: baseline * min(1, 0.5 + log10(totalSessions + 1)/2)
    const sessionMultiplier = Math.min(1, 0.5 + Math.log10(totalSessions + 1) / 2);
    let finalConfidence = baseConfidence * sessionMultiplier;

    // Only add traits if confidence is decent (> 40%)
    if (finalConfidence > 0.4) {
      const traitDef = TRAIT_DICTIONARY[key];
      const traitId = `inferred_${key}`;

      const existing = inferredMap.get(traitId);

      // If it exists and is peer-validated, update confidence. 
      // If it's self-assessed, keep it marked as self-assessed but boost confidence slightly.
      if (existing) {
        inferredMap.set(traitId, {
          ...existing,
          confidence: Number(finalConfidence.toFixed(2)),
          // If confidence passes 0.7, it graduates from self-assessed to fully validated
          isSelfAssessed: existing.isSelfAssessed && finalConfidence < 0.7,
        });
      } else {
        inferredMap.set(traitId, {
          id: traitId,
          trait: traitDef.name,
          category: traitDef.category as "teaching" | "learning" | "social",
          confidence: Number(finalConfidence.toFixed(2)),
          isVisible: true,
          isSelfAssessed: false,
        });
      }
    }
  });

  // Convert map back to array and sort by confidence
  return Array.from(inferredMap.values()).sort((a, b) => b.confidence - a.confidence);
}

/**
 * Creates a new self-assessed trait. Starts with a flat 0.5 confidence.
 */
export function createSelfAssessedTrait(
  name: string,
  category: "teaching" | "learning" | "social"
): LearningDNATrait {
  return {
    id: `self_${crypto.randomUUID()}`,
    trait: name,
    category,
    confidence: 0.5,
    isVisible: true,
    isSelfAssessed: true,
  };
}
