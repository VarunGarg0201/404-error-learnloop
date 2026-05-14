"use client";

import { useEffect, useState } from "react";
import { SurfaceCard } from "@/components/shared/cards";
import { Dna, Sparkles } from "lucide-react";
import type { LearningDNATrait } from "@/types";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   DNA Insights Dashboard Widget
   ─────────────────────────────────────────────────────────
   Minimalist dashboard widget summarizing top DNA traits.
   ═══════════════════════════════════════════════════════════ */

export function DNAInsightsWidget() {
  const [topTraits, setTopTraits] = useState<LearningDNATrait[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dna");
        const json = await res.json();
        if (json.success) {
          // Get the top 3 most confident, visible traits
          const sorted = (json.data as LearningDNATrait[])
            .filter((t) => t.isVisible)
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3);
          setTopTraits(sorted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <SurfaceCard className="h-full flex flex-col animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <Dna className="w-4 h-4 text-primary" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
        <div className="flex-1 space-y-3">
           <div className="h-12 w-full bg-muted/50 rounded-lg" />
           <div className="h-12 w-full bg-muted/50 rounded-lg" />
        </div>
      </SurfaceCard>
    );
  }

  if (topTraits.length === 0) {
    return (
      <SurfaceCard className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Dna className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">DNA Insights</h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p className="text-sm text-muted-foreground">Not enough data to generate insights.</p>
          <p className="text-[10px] mt-1 text-muted-foreground">Complete more sessions to discover your defining traits.</p>
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">DNA Insights</h3>
        </div>
        <div className="p-1 rounded-full bg-primary/10">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Your top defining traits based on recent session feedback.
      </p>

      <div className="flex-1 space-y-3">
        {topTraits.map((trait, index) => {
          const isTop = index === 0;
          return (
            <div 
              key={trait.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border",
                isTop ? "bg-primary/5 border-primary/20" : "bg-muted/20 border-border/40"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold",
                  isTop ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{trait.trait}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {trait.category} {trait.isSelfAssessed && "• Self-Assessed"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold">
                {Math.round(trait.confidence * 100)}%
              </span>
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
