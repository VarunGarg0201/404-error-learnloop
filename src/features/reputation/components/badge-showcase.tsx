"use client";

import { cn } from "@/lib/utils";
import { SurfaceCard } from "@/components/shared/cards";
import type { BadgeDefinition } from "@/lib/reputation/types";
import { BADGE_DEFINITIONS } from "@/lib/reputation/badges";
import {
  Rocket, BookOpen, GraduationCap, Crown, Heart, Shield, Sparkles, Flame, Target, Lock
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Badge Showcase
   ─────────────────────────────────────────────────────────
   Premium grid showing unlocked and locked badges.
   ═══════════════════════════════════════════════════════════ */

const ICONS: Record<string, React.ElementType> = {
  Rocket, BookOpen, GraduationCap, Crown, Heart, Shield, Sparkles, Flame, Target
};

const TIER_STYLES = {
  bronze: "bg-[#CD7F32]/10 text-[#CD7F32] border-[#CD7F32]/30 shadow-[0_0_15px_rgba(205,127,50,0.1)]",
  silver: "bg-slate-300/10 text-slate-400 border-slate-400/30 shadow-[0_0_15px_rgba(148,163,184,0.15)]",
  gold: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]",
  diamond: "bg-cyan-400/10 text-cyan-400 border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.3)]",
};

interface BadgeShowcaseProps {
  unlockedIds: string[];
}

export function BadgeShowcase({ unlockedIds }: BadgeShowcaseProps) {
  // Sort badges: Unlocked first, then locked, grouped by tier loosely
  const unlocked = BADGE_DEFINITIONS.filter(b => unlockedIds.includes(b.id));
  const locked = BADGE_DEFINITIONS.filter(b => !unlockedIds.includes(b.id));

  return (
    <SurfaceCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold">Achievements</h3>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {unlocked.length} / {BADGE_DEFINITIONS.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Unlocked Badges */}
        {unlocked.map((badge) => {
          const Icon = ICONS[badge.icon] || Sparkles;
          return (
            <div
              key={badge.id}
              className={cn(
                "relative flex flex-col items-center text-center p-4 rounded-2xl border transition-transform hover:scale-105",
                TIER_STYLES[badge.tier]
              )}
            >
              <div className="mb-3 p-3 rounded-full bg-background/50 backdrop-blur-sm">
                <Icon className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold mb-1">{badge.name}</p>
              <p className="text-[10px] opacity-80 px-2">{badge.description}</p>
            </div>
          );
        })}

        {/* Locked Badges */}
        {locked.map((badge) => (
          <div
            key={badge.id}
            className="relative flex flex-col items-center text-center p-4 rounded-2xl border border-border/30 bg-muted/20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <div className="absolute top-2 right-2">
              <Lock className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="mb-3 p-3 rounded-full bg-muted">
              <div className="w-8 h-8 rounded-full bg-border/50" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">{badge.name}</p>
            <p className="text-[10px] text-muted-foreground px-2">{badge.description}</p>
            
            {/* Progress Bar (Visual only for now) */}
            <div className="w-full h-1 bg-border rounded-full mt-3 overflow-hidden">
               <div className="h-full bg-primary/30 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
