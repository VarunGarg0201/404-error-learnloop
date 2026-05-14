import { NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════════════
   KC History API
   ─────────────────────────────────────────────────────────
   Returns paginated Knowledge Credit transaction history.
   ═══════════════════════════════════════════════════════════ */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Demo Data
    const history = [
      { id: "1", amount: 15, reason: "Taught a 1:1 session (React Hooks)", category: "teaching", createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
      { id: "2", amount: 5, reason: "Answered a quick help request", category: "helping", createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
      { id: "3", amount: 7, reason: "Received 5⭐ peer feedback", category: "feedback", createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
      { id: "4", amount: 2, reason: "Daily login streak", category: "consistency", createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
      { id: "5", amount: 10, reason: "Hosted a study room (DBMS)", category: "teaching", createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
      { id: "6", amount: 5, reason: "Received 4⭐ peer feedback", category: "feedback", createdAt: new Date(Date.now() - 72 * 3600000).toISOString() },
      { id: "7", amount: -10, reason: "Consistently low feedback penalty", category: "penalty", createdAt: new Date(Date.now() - 96 * 3600000).toISOString() },
    ];

    return NextResponse.json({
      data: history.slice(0, limit),
      meta: { total: history.length, limit },
      success: true,
    });
  } catch (error) {
    console.error("KC API error:", error);
    return NextResponse.json(
      { data: null, error: "Failed to fetch KC history", success: false },
      { status: 500 }
    );
  }
}
