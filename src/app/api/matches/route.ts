import { NextResponse } from "next/server";
import { findMatches } from "@/lib/ai/matching";
import { DEMO_USER, DEMO_CANDIDATES } from "@/lib/ai/demo-data";
import type { MatchQuery } from "@/lib/ai/types";

/* ═══════════════════════════════════════════════════════════
   Match API — GET /api/matches
   ─────────────────────────────────────────────────────────
   Returns ranked peer matches for the current user.

   Query params:
   - limit: number of results (default 10)
   - minScore: minimum overall score (default 30)
   - campus: filter by campus
   - onlineOnly: only online users
   ═══════════════════════════════════════════════════════════ */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query: MatchQuery = {
      userId: DEMO_USER.id, // TODO: from auth session
      limit: parseInt(searchParams.get("limit") || "10"),
      minScore: parseInt(searchParams.get("minScore") || "30"),
      filters: {
        campus: searchParams.get("campus") || undefined,
        onlineOnly: searchParams.get("onlineOnly") === "true",
      },
    };

    // TODO: Phase 2 — Fetch real candidates from Supabase/Prisma
    const matches = await findMatches(DEMO_USER, DEMO_CANDIDATES, query);

    return NextResponse.json({
      data: matches,
      meta: {
        total: matches.length,
        query: {
          limit: query.limit,
          minScore: query.minScore,
          filters: query.filters,
        },
      },
      success: true,
    });
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json(
      { data: null, error: "Failed to compute matches", success: false },
      { status: 500 }
    );
  }
}
