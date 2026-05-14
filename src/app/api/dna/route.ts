import { NextResponse } from "next/server";
import { inferDNATraits } from "@/lib/ai/dna-engine";
import type { SessionFeedback, LearningDNATrait } from "@/types";

/* ═══════════════════════════════════════════════════════════
   DNA Engine API
   ─────────────────────────────────────────────────────────
   Exposes endpoints to fetch inferred traits and update
   visibility / self-assessed traits.
   ═══════════════════════════════════════════════════════════ */

export async function GET(request: Request) {
  try {
    // 1. Fetch User Feedback History (Mocked for Phase 1)
    const mockFeedbacks: SessionFeedback[] = [
      { overallSatisfaction: 5, helpfulness: 5, clarity: 5, patience: 4, accuracy: 5, beginnerFriendliness: 5, communicationQuality: 5, conceptUnderstanding: 4, comment: "" },
      { overallSatisfaction: 4, helpfulness: 5, clarity: 4, patience: 5, accuracy: 5, beginnerFriendliness: 5, communicationQuality: 4, conceptUnderstanding: 5, comment: "" },
      { overallSatisfaction: 5, helpfulness: 5, clarity: 5, patience: 5, accuracy: 5, beginnerFriendliness: 4, communicationQuality: 5, conceptUnderstanding: 5, comment: "" },
    ];

    // 2. Fetch User's existing custom traits (Mocked)
    const mockExistingTraits: LearningDNATrait[] = [
      { id: "self_123", trait: "Visual Learner", category: "learning", confidence: 0.5, isVisible: true, isSelfAssessed: true },
    ];

    // 3. Infer DNA
    const dnaTraits = inferDNATraits(mockFeedbacks, mockExistingTraits);

    return NextResponse.json(
      {
        success: true,
        data: dnaTraits,
      },
      {
        headers: {
          "Cache-Control": "private, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("DNA API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compute Learning DNA" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const updatedTraits: LearningDNATrait[] = payload.traits;

    if (!Array.isArray(updatedTraits)) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // In a real app, we would validate and save `updatedTraits` to the DB.
    // Ensure users cannot artificially inflate peer-validated confidence scores.

    return NextResponse.json({
      success: true,
      data: updatedTraits,
    });
  } catch (error) {
    console.error("DNA API Update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update Learning DNA" },
      { status: 500 }
    );
  }
}
