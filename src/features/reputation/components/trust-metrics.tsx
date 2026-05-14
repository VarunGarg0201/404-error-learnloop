"use client";

import { cn } from "@/lib/utils";
import { SurfaceCard } from "@/components/shared/cards";
import { ShieldCheck, MessageSquare, Brain, Target, Heart, Sparkles } from "lucide-react";
import type { TrustMetrics } from "@/lib/reputation/types";

/* ═══════════════════════════════════════════════════════════
   Trust Metrics Breakdown
   ─────────────────────────────────────────────────────────
   Visualizes the user's detailed feedback scores.
   ═══════════════════════════════════════════════════════════ */

interface TrustMetricsProps {
  metrics: TrustMetrics;
}

const CATEGORIES = [
  { key: "clarity", label: "Clarity", icon: Sparkles, color: "bg-primary" },
  { key: "patience", label: "Patience", icon: Heart, color: "bg-success" },
  { key: "accuracy", label: "Accuracy", icon: Target, color: "bg-info" },
  { key: "beginnerFriendliness", label: "Beginner Friendly", icon: Brain, color: "bg-warning" },
  { key: "communication", label: "Communication", icon: MessageSquare, color: "bg-primary" },
] as const;

export function TrustMetricsDisplay({ metrics }: TrustMetricsProps) {
  const { overallTrust, totalRatings, feedbackBreakdown } = metrics;

  return (
    <SurfaceCard>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-success/10 border border-success/20">
          <ShieldCheck className="w-7 h-7 text-success" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Trust Score</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tight">{overallTrust.toFixed(1)}</span>
            <span className="text-sm font-medium text-muted-foreground mb-1">/ 5.0</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Based on {totalRatings} peer reviews
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map(({ key, label, icon: Icon, color }) => {
          const value = feedbackBreakdown[key as keyof typeof feedbackBreakdown] || 0;
          const percent = (value / 5) * 100;
          
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  {label}
                </div>
                <span className="font-semibold">{value.toFixed(1)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
