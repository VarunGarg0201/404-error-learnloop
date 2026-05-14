"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import { getTopServerMatches } from "@/features/dashboard/actions/matching";
import { sendMatchRequest } from "@/features/dashboard/actions";
import type { MatchResult } from "@/lib/ai/types";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  UserPlus,
  Check,
  Brain,
  Zap,
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   AI Matches Widget — Dashboard mini-view
   ─────────────────────────────────────────────────────────
   Optimized to run matching engine on the server.
   ═══════════════════════════════════════════════════════════ */

function MatchMiniCard({ match }: { match: MatchResult }) {
  const { user, score, reasons } = match;
  const topReason = reasons[0];
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  async function handleConnect(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConnecting(true);
    const res = await sendMatchRequest(user.id);
    setConnecting(false);
    if (res.success) setConnected(true);
  }

  // Score color
  const scoreColor =
    score.overall >= 80
      ? "text-success"
      : score.overall >= 60
      ? "text-primary"
      : "text-warning";

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg",
        "border border-border/30 bg-card/50",
        "hover:border-border/60 hover:bg-accent/30",
        "transition-all duration-200 group"
      )}
    >
      <UserAvatar name={user.displayName} src={user.avatarUrl || undefined} size="md" showOnline={user.isOnline} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">{user.displayName}</p>
          <span className={cn("text-xs font-bold tabular-nums", scoreColor)}>
            {score.overall}%
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground truncate">
          {user.stream}{user.year ? ` · ${user.year}` : ""}
        </p>
        {topReason && (
          <p className="text-[10px] text-muted-foreground mt-1 truncate">
            {topReason.emoji} {topReason.detail}
          </p>
        )}

        {/* Score breakdown mini-bar */}
        <div className="flex gap-1 mt-2">
          {[
            { label: "Skills", val: score.skills },
            { label: "Goals", val: score.goals },
            { label: "DNA", val: score.dna },
            { label: "Style", val: score.style },
          ].map(({ label, val }) => (
            <div key={label} className="flex-1">
              <div className="h-1 rounded-full bg-border/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/60 transition-all duration-500"
                  style={{ width: `${Math.round(val * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect button */}
      <Button
        size="xs"
        variant={connected ? "secondary" : "default"}
        className="shrink-0 gap-1 mt-0.5"
        disabled={connecting || connected}
        onClick={handleConnect}
      >
        {connecting ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : connected ? (
          <>
            <Check className="w-3 h-3" />
            Sent
          </>
        ) : (
          <>
            <UserPlus className="w-3 h-3" />
            Connect
          </>
        )}
      </Button>
    </div>
  );
}

export function AIMatchesWidget({ className }: { className?: string }) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMatches() {
    try {
      const res = await getTopServerMatches(3);
      if (res.data) {
        setMatches(res.data);
      }
    } catch (e) {
      console.error("Match error", e);
    }
  }

  useEffect(() => {
    loadMatches().finally(() => setLoading(false));
  }, []);



  return (
    <Widget
      title="AI Matches"
      description="Peers matched to your Learning DNA"
      icon={Sparkles}
      action={
        matches.length > 0
          ? { label: "Find more", href: "/discover" }
          : undefined
      }
      className={className}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-[11px]">Analyzing your Learning DNA...</p>
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-2">
          {/* AI insight mini-bar */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/[0.04] border border-primary/10 mb-1">
            <Brain className="w-3.5 h-3.5 text-primary shrink-0" />
            <p className="text-[10px] text-muted-foreground">
              Matched using <strong>skills</strong>, <strong>goals</strong>, <strong>DNA</strong>, and <strong>reputation</strong> signals
            </p>
          </div>

          {matches.map((match) => (
            <MatchMiniCard key={match.user.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No matches yet"
          description="Complete your profile to get AI-powered peer recommendations."
          action={
            <Link href="/profile">
              <Button size="sm" variant="secondary" className="gap-1">
                <Zap className="w-3 h-3" />
                Complete profile
              </Button>
            </Link>
          }
        />
      )}
    </Widget>
  );
}
