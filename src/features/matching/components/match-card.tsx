"use client";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge, SkillTag, OnlineBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import type { MatchResult, MatchReason } from "@/lib/ai/types";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useState } from "react";

/* ═══════════════════════════════════════════════════════════
   Match Card — Premium recommendation card
   ─────────────────────────────────────────────────────────
   Shows match score, reasons, explanation, and actions.
   ═══════════════════════════════════════════════════════════ */

/* ─── Score Ring ─── */
function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color =
    score >= 80
      ? "text-success stroke-success"
      : score >= 60
      ? "text-primary stroke-primary"
      : "text-warning stroke-warning";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          className={cn("transition-all duration-1000 ease-out", color)}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-xs font-bold", color.split(" ")[0])}>
          {score}%
        </span>
      </div>
    </div>
  );
}

/* ─── Reason pill ─── */
function ReasonPill({ reason }: { reason: MatchReason }) {
  const strengthColors = {
    strong: "bg-success/10 text-success border-success/20",
    good: "bg-primary/10 text-primary border-primary/20",
    fair: "bg-muted text-muted-foreground border-border/50",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px]",
        strengthColors[reason.strength]
      )}
    >
      <span>{reason.emoji}</span>
      <span className="font-medium">{reason.detail}</span>
    </div>
  );
}

/* ─── Factor bar (for expanded view) ─── */
function FactorBar({
  label,
  emoji,
  value,
}: {
  label: string;
  emoji: string;
  value: number;
}) {
  const percent = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-4 text-center">{emoji}</span>
      <span className="text-[11px] text-muted-foreground w-20 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            percent >= 75 ? "bg-success" : percent >= 50 ? "bg-primary" : "bg-warning"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground w-7 text-right">
        {percent}
      </span>
    </div>
  );
}

/* ─── Main Match Card ─── */
interface MatchCardProps {
  match: MatchResult;
  className?: string;
  rank?: number;
}

export function MatchCard({ match, className, rank }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { user, score, explanation, reasons } = match;

  return (
    <SurfaceCard
      hover
      padding="none"
      className={cn(
        "overflow-hidden transition-all duration-200",
        expanded && "ring-1 ring-primary/20",
        className
      )}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 p-4">
        {/* Score ring */}
        <div className="shrink-0 flex flex-col items-center gap-1">
          {rank && (
            <span className="text-[9px] font-bold text-muted-foreground">
              #{rank}
            </span>
          )}
          <ScoreRing score={score.overall} />
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <UserAvatar
              name={user.displayName}
              src={user.avatarUrl}
              size="sm"
              showOnline={user.isOnline}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold truncate">
                  {user.displayName}
                </p>
                {user.isOnline && <OnlineBadge />}
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                @{user.username}
              </p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] text-muted-foreground">
            {user.campus && (
              <span className="flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> {user.campus}
              </span>
            )}
            {user.stream && (
              <span className="flex items-center gap-0.5">
                <GraduationCap className="w-2.5 h-2.5" /> {user.stream}
                {user.year && ` · ${user.year}`}
              </span>
            )}
          </div>

          {/* Top reasons (collapsed) */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {reasons.slice(0, 3).map((reason) => (
              <ReasonPill key={reason.factor} reason={reason} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Button size="sm" className="gap-1.5 text-xs">
            <MessageSquare className="w-3 h-3" />
            Connect
          </Button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? "Less" : "Why this match?"}
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border/30 bg-muted/10 px-4 py-3 space-y-3 animate-slide-up">
          {/* Explanation summary */}
          <div className="flex items-start gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <p className="text-[12px] text-foreground/80 leading-relaxed">
              {explanation.summary}
            </p>
          </div>

          {/* Factor breakdown */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Compatibility Breakdown
            </p>
            <FactorBar label="Skills" emoji="⚡" value={score.skills} />
            <FactorBar label="Goals" emoji="🎯" value={score.goals} />
            <FactorBar label="DNA" emoji="🧬" value={score.dna} />
            <FactorBar label="Schedule" emoji="🕐" value={score.availability} />
            <FactorBar label="Style" emoji="📚" value={score.style} />
            <FactorBar label="Language" emoji="🌐" value={score.language} />
            <FactorBar label="Reputation" emoji="⭐" value={score.reputation} />
            <FactorBar label="Energy" emoji="🔋" value={score.energy} />
            <FactorBar label="Activity" emoji="📊" value={score.behavior} />
          </div>

          {/* Skills overlap */}
          {(explanation.complementary.length > 0 || explanation.tips.length > 0) && (
            <div className="space-y-2">
              {explanation.complementary.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Complementary
                  </p>
                  <div className="space-y-0.5">
                    {explanation.complementary.map((c, i) => (
                      <p key={i} className="text-[11px] text-foreground/70 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-primary" /> {c}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {explanation.tips.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Tips
                  </p>
                  <div className="space-y-0.5">
                    {explanation.tips.map((t, i) => (
                      <p key={i} className="text-[11px] text-foreground/70">
                        💡 {t}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </SurfaceCard>
  );
}

/* ─── Match Card Skeleton ─── */
export function MatchCardSkeleton() {
  return (
    <SurfaceCard padding="md" className="animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-muted/50" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-muted/50 rounded" />
          <div className="h-3 w-48 bg-muted/30 rounded" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-24 bg-muted/30 rounded-lg" />
            <div className="h-6 w-20 bg-muted/30 rounded-lg" />
          </div>
        </div>
        <div className="h-8 w-20 bg-muted/30 rounded-lg" />
      </div>
    </SurfaceCard>
  );
}
