"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Widget } from "@/components/shared/widgets";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Brain, Info, Settings2 } from "lucide-react";
import type { LearningDNATrait } from "@/types";
import { EditDNAModal } from "../components/edit-dna-modal";

/* ═══════════════════════════════════════════════════════════
   Learning DNA Section
   ─────────────────────────────────────────────────────────
   Visual trait bars inferred from session feedback & AI.
   ═══════════════════════════════════════════════════════════ */

const categoryColors = {
  teaching: "bg-primary",
  learning: "bg-success",
  social: "bg-info",
};

const categoryLabels = {
  teaching: "Teaching",
  learning: "Learning",
  social: "Social",
};

function TraitBar({ trait, confidence, category, isSelfAssessed, isVisible }: LearningDNATrait) {
  if (!isVisible) return null;
  const percent = Math.round(confidence * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium">{trait}</span>
          {isSelfAssessed && (
            <span className="text-[8px] uppercase tracking-wider px-1 py-0.5 rounded-sm bg-warning/20 text-warning font-semibold">
              Self
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">{percent}%</span>
      </div>
      <div className={cn(
        "h-1.5 w-full rounded-full bg-muted/50 overflow-hidden",
        isSelfAssessed && "border border-dashed border-border/50"
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            categoryColors[category]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

interface LearningDNASectionProps {
  className?: string;
  isOwnProfile?: boolean;
}

export function LearningDNASection({
  className,
  isOwnProfile = true,
}: LearningDNASectionProps) {
  const [traits, setTraits] = useState<LearningDNATrait[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDNA() {
      try {
        const res = await fetch("/api/dna");
        const json = await res.json();
        if (json.success) setTraits(json.data);
      } catch (err) {
        console.error("Failed to load DNA", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDNA();
  }, []);

  const handleSaveDNA = async (updatedTraits: LearningDNATrait[]) => {
    try {
      // Optimistic update
      setTraits(updatedTraits);
      await fetch("/api/dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traits: updatedTraits }),
      });
    } catch (err) {
      console.error("Failed to save DNA", err);
    }
  };

  const visibleTraits = traits.filter(t => t.isVisible);
  
  const grouped = {
    teaching: visibleTraits.filter((t) => t.category === "teaching"),
    learning: visibleTraits.filter((t) => t.category === "learning"),
    social: visibleTraits.filter((t) => t.category === "social"),
  };

  const hasTraits = visibleTraits.length > 0;

  return (
    <>
      <Widget
        title="Learning DNA"
        description="AI-inferred traits from sessions & feedback"
        icon={Brain}
        moreMenu={isOwnProfile}
        className={className}
        action={isOwnProfile ? {
          label: "Edit DNA",
          onClick: () => setIsEditModalOpen(true)
        } : undefined}
      >
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
             <div className="h-4 bg-muted rounded w-1/3" />
             <div className="h-10 bg-muted rounded w-full" />
             <div className="h-10 bg-muted rounded w-full" />
          </div>
        ) : hasTraits ? (
          <div className="space-y-5">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3">
              {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((cat) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <div className={cn("w-2 h-2 rounded-full", categoryColors[cat])} />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {categoryLabels[cat]}
                  </span>
                </div>
              ))}
            </div>

            {/* Trait groups */}
            {(["teaching", "learning", "social"] as const).map((cat) => {
              const catTraits = grouped[cat];
              if (catTraits.length === 0) return null;
              return (
                <div key={cat} className="space-y-2.5">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {categoryLabels[cat]}
                  </p>
                  <div className="space-y-2">
                    {catTraits.map((trait) => (
                      <TraitBar key={trait.id} {...trait} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Info note */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/30">
              <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                DNA traits are auto-generated from session feedback. Self-assessed traits gain confidence as peers validate them.
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Brain}
            title="No DNA traits yet"
            description="Complete sessions and receive feedback to build your Learning DNA profile."
            action={
              isOwnProfile ? (
                <Button size="sm" variant="secondary" onClick={() => setIsEditModalOpen(true)}>
                  Add Traits Manually
                </Button>
              ) : undefined
            }
          />
        )}
      </Widget>

      {isOwnProfile && (
        <EditDNAModal 
          isOpen={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen}
          traits={traits}
          onSave={handleSaveDNA}
        />
      )}
    </>
  );
}
