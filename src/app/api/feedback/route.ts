import { NextResponse } from "next/server";
import { calculateAward } from "@/lib/reputation/kc-engine";
import type { SessionFeedback } from "@/types";

/* ═══════════════════════════════════════════════════════════
   Feedback Submission API
   ─────────────────────────────────────────────────────────
   Handles incoming post-session feedback, checks for spam
   flags, and routes data to the Knowledge Credit engine.
   ═══════════════════════════════════════════════════════════ */

interface FeedbackPayload {
  targetUserId: string;
  sessionId: string;
  feedback: SessionFeedback;
}

export async function POST(request: Request) {
  try {
    const payload: FeedbackPayload = await request.json();

    // 1. Basic validation
    if (!payload.targetUserId || !payload.feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Moderation Check
    // If the feedback has a 1 in multiple categories or explicit flag, we might tag it for review
    const isPotentiallySpam = payload.feedback.isFlagged || (
      payload.feedback.clarity === 1 && 
      payload.feedback.patience === 1
    );

    // 3. Process KC Award via Reputation Engine
    // (In a real app, todayTotalKC would be fetched from Redis/DB)
    const kcResult = calculateAward("RECEIVE_FEEDBACK", {
      feedback: payload.feedback,
      targetUserId: payload.targetUserId,
      todayTotalKC: 150, // Mock DB read
      todayTotalFromTarget: 10, // Mock DB read
    });

    // 4. Persistence (Mocked for Phase 1)
    // await db.sessionFeedback.create({ ... })
    // await db.user.update({ where: { id: targetUserId }, data: { kc: { increment: kcResult.amount } } })

    return NextResponse.json({
      success: true,
      data: {
        kcAwarded: kcResult.amount,
        kcReason: kcResult.reason,
        flaggedForReview: isPotentiallySpam,
      }
    });

  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
