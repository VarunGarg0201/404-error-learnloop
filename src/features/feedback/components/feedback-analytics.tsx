"use client";

import { SurfaceCard } from "@/components/shared/cards";
import { TrustMetricsDisplay } from "@/features/reputation/components/trust-metrics";
import type { TrustMetrics } from "@/lib/reputation/types";

/* ═══════════════════════════════════════════════════════════
   Feedback Analytics Widget
   ─────────────────────────────────────────────────────────
   Composes the TrustMetrics display and adds a section for
   recent written comments.
   ═══════════════════════════════════════════════════════════ */

interface FeedbackAnalyticsProps {
  metrics: TrustMetrics;
  recentComments: { id: string; text: string; date: string }[];
}

export function FeedbackAnalytics({ metrics, recentComments }: FeedbackAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar / Metrics Breakdown (Reusing the reputation component) */}
      <TrustMetricsDisplay metrics={metrics} />

      {/* Recent Comments */}
      <SurfaceCard className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold">Recent Endorsements</h3>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
            Anonymous
          </span>
        </div>

        {recentComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground text-center">
            <p className="text-sm">No comments yet.</p>
            <p className="text-[10px] mt-1">Host more sessions to collect endorsements!</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin">
            {recentComments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                <p className="text-sm italic mb-2 text-foreground/90">
                  &quot;{comment.text}&quot;
                </p>
                <p className="text-[10px] text-muted-foreground text-right">
                  {new Date(comment.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </SurfaceCard>
    </div>
  );
}
