import type {
  MatchableProfile,
  MatchScore,
  MatchReason,
  MatchExplanation,
} from "./types";

/* ═══════════════════════════════════════════════════════════
   Explanation Generator
   ─────────────────────────────────────────────────────────
   Generates human-readable match explanations from scores.
   Phase 1: Rule-based. Phase 2: LLM-enhanced.
   ═══════════════════════════════════════════════════════════ */

const FACTOR_META: Record<
  keyof Omit<MatchScore, "overall">,
  { emoji: string; label: string }
> = {
  skills: { emoji: "⚡", label: "Skills" },
  goals: { emoji: "🎯", label: "Goals" },
  dna: { emoji: "🧬", label: "Learning DNA" },
  availability: { emoji: "🕐", label: "Availability" },
  style: { emoji: "📚", label: "Learning Style" },
  language: { emoji: "🌐", label: "Language" },
  reputation: { emoji: "⭐", label: "Reputation" },
  energy: { emoji: "🔋", label: "Energy" },
  behavior: { emoji: "📊", label: "Activity" },
};

function getStrength(score: number): "strong" | "good" | "fair" {
  if (score >= 0.75) return "strong";
  if (score >= 0.5) return "good";
  return "fair";
}

/* ─── Generate per-factor reasons ─── */
export function generateReasons(
  user: MatchableProfile,
  candidate: MatchableProfile,
  scores: Omit<MatchScore, "overall">
): MatchReason[] {
  const reasons: MatchReason[] = [];

  // Skills
  if (scores.skills > 0) {
    const teachOverlap = user.skillsToTeach.filter((s) =>
      candidate.skillsToLearn.map((x) => x.toLowerCase()).includes(s.toLowerCase())
    );
    const learnOverlap = user.skillsToLearn.filter((s) =>
      candidate.skillsToTeach.map((x) => x.toLowerCase()).includes(s.toLowerCase())
    );

    let detail = "";
    if (teachOverlap.length > 0) {
      detail += `You can teach them ${teachOverlap.slice(0, 2).join(", ")}`;
    }
    if (learnOverlap.length > 0) {
      if (detail) detail += ". ";
      detail += `They can teach you ${learnOverlap.slice(0, 2).join(", ")}`;
    }
    if (!detail) {
      detail = "You share similar technical interests";
    }

    reasons.push({
      factor: "skills",
      ...FACTOR_META.skills,
      detail,
      strength: getStrength(scores.skills),
    });
  }

  // Goals
  if (scores.goals > 0.3) {
    const sharedGoals = user.goals.filter((g) =>
      candidate.goals.map((x) => x.toLowerCase()).includes(g.toLowerCase())
    );
    reasons.push({
      factor: "goals",
      ...FACTOR_META.goals,
      detail:
        sharedGoals.length > 0
          ? `Both want to: ${sharedGoals.slice(0, 2).join(", ")}`
          : "Similar learning objectives",
      strength: getStrength(scores.goals),
    });
  }

  // DNA
  if (scores.dna > 0.5) {
    reasons.push({
      factor: "dna",
      ...FACTOR_META.dna,
      detail: "Compatible learning and collaboration traits",
      strength: getStrength(scores.dna),
    });
  }

  // Availability
  if (scores.availability > 0.3) {
    const sharedSlots = user.availability.filter((a) =>
      candidate.availability.includes(a)
    );
    reasons.push({
      factor: "availability",
      ...FACTOR_META.availability,
      detail:
        sharedSlots.length > 0
          ? `Both free: ${sharedSlots.slice(0, 2).join(", ")}`
          : "Overlapping schedules",
      strength: getStrength(scores.availability),
    });
  }

  // Style
  if (scores.style > 0.5) {
    reasons.push({
      factor: "style",
      ...FACTOR_META.style,
      detail:
        user.learningStyle === candidate.learningStyle
          ? `Both prefer ${user.learningStyle} learning`
          : `${candidate.learningStyle} style complements your ${user.learningStyle} style`,
      strength: getStrength(scores.style),
    });
  }

  // Language
  if (scores.language > 0.5) {
    reasons.push({
      factor: "language",
      ...FACTOR_META.language,
      detail:
        user.preferredLanguage === candidate.preferredLanguage
          ? `Both prefer ${user.preferredLanguage}`
          : "Can communicate effectively",
      strength: getStrength(scores.language),
    });
  }

  // Reputation
  if (scores.reputation > 0.6) {
    reasons.push({
      factor: "reputation",
      ...FACTOR_META.reputation,
      detail: `${candidate.avgRating.toFixed(1)}⭐ rating · ${candidate.totalSessions} sessions`,
      strength: getStrength(scores.reputation),
    });
  }

  // Energy
  if (scores.energy > 0.5) {
    reasons.push({
      factor: "energy",
      ...FACTOR_META.energy,
      detail: `Currently in ${candidate.energyMode} mode`,
      strength: getStrength(scores.energy),
    });
  }

  // Sort by strength
  const strengthOrder = { strong: 0, good: 1, fair: 2 };
  reasons.sort((a, b) => strengthOrder[a.strength] - strengthOrder[b.strength]);

  return reasons;
}

/* ─── Generate summary explanation ─── */
export function generateExplanation(
  user: MatchableProfile,
  candidate: MatchableProfile,
  scores: Omit<MatchScore, "overall">,
  reasons: MatchReason[]
): MatchExplanation {
  const strongReasons = reasons.filter((r) => r.strength === "strong");
  const goodReasons = reasons.filter((r) => r.strength === "good");

  // Summary
  let summary = "";
  if (strongReasons.length >= 3) {
    summary = `Excellent match! You and ${candidate.displayName} are highly compatible across multiple dimensions.`;
  } else if (strongReasons.length >= 1) {
    summary = `Great match! You and ${candidate.displayName} share strong ${strongReasons[0].label.toLowerCase()} compatibility.`;
  } else if (goodReasons.length >= 2) {
    summary = `Good match. You and ${candidate.displayName} have several areas of alignment.`;
  } else {
    summary = `Potential match. You and ${candidate.displayName} could benefit from connecting.`;
  }

  // Highlights (top 3 strong reasons)
  const highlights = strongReasons
    .slice(0, 3)
    .map((r) => `${r.emoji} ${r.detail}`);

  // Complementary aspects
  const complementary: string[] = [];
  const teachOverlap = user.skillsToTeach.filter((s) =>
    candidate.skillsToLearn.map((x) => x.toLowerCase()).includes(s.toLowerCase())
  );
  const learnOverlap = user.skillsToLearn.filter((s) =>
    candidate.skillsToTeach.map((x) => x.toLowerCase()).includes(s.toLowerCase())
  );
  if (teachOverlap.length > 0) {
    complementary.push(`You can help with ${teachOverlap[0]}`);
  }
  if (learnOverlap.length > 0) {
    complementary.push(`They can help you with ${learnOverlap[0]}`);
  }

  // Tips
  const tips: string[] = [];
  if (scores.availability > 0.5) {
    const shared = user.availability.filter((a) =>
      candidate.availability.includes(a)
    );
    if (shared.length > 0) {
      tips.push(`Try scheduling during ${shared[0]}`);
    }
  }
  if (candidate.energyMode === "teaching") {
    tips.push(`${candidate.displayName} is in teaching mode right now!`);
  }
  if (candidate.isOnline) {
    tips.push("They're online — great time to connect!");
  }

  return { summary, highlights, complementary, tips };
}

/* ─── Generate AI Summary Explanation ─── */
import { openai, AI_MODELS, parseAIJson } from "./openai-client";

export async function generateAIExplanation(
  user: MatchableProfile,
  candidate: MatchableProfile,
  reasons: MatchReason[]
): Promise<MatchExplanation> {
  try {
    const strongReasons = reasons.filter((r) => r.strength === "strong").map(r => r.detail);
    const goodReasons = reasons.filter((r) => r.strength === "good").map(r => r.detail);

    const response = await openai.chat.completions.create({
      model: AI_MODELS.FAST,
      messages: [
        { 
          role: "system", 
          content: "You are the LearnLoop Matchmaker AI. Your job is to explain why two students are a good match for studying together. Keep it very concise, encouraging, and output valid JSON only." 
        },
        { 
          role: "user", 
          content: `Generate a match explanation for the user and ${candidate.displayName}.
          Strong compatibility reasons: ${strongReasons.join(", ")}
          Good compatibility reasons: ${goodReasons.join(", ")}
          
          Output format:
          {
            "summary": "A friendly 1-2 sentence summary of why they match.",
            "highlights": ["Highlight 1 with emoji", "Highlight 2 with emoji"],
            "complementary": ["How they complement each other (max 2)"],
            "tips": ["One actionable tip for their first session"]
          }`
        }
      ],
      response_format: { type: "json_object" },
    });

    const parsed = parseAIJson<MatchExplanation>(response.choices[0].message.content);
    
    // Fallback to rule-based if AI fails
    if (!parsed) throw new Error("Parse failed");
    return parsed;
  } catch (error) {
    console.error("AI Explanation generation failed:", error);
    // Fallback to existing rule-based logic
    return generateExplanation(user, candidate, {} as Omit<MatchScore, "overall">, reasons);
  }
}

