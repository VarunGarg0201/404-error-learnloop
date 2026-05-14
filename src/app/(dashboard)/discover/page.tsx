"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { getPotentialMatches, sendMatchRequest } from "@/features/dashboard/actions";
import { findMatches } from "@/lib/ai/matching";
import type { MatchResult, MatchableProfile, DNATraitScore } from "@/lib/ai/types";
import {
  Sparkles,
  Filter,
  Wifi,
  MapPin,
  RefreshCw,
  Brain,
  UserPlus,
  Check,
  Loader2,
  ArrowRight,
  Zap,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Discover Page — AI-Powered Matching (Real Data)
   ═══════════════════════════════════════════════════════════ */

type FilterState = {
  onlineOnly: boolean;
  campusOnly: boolean;
};

/** Maps DB user → MatchableProfile (same logic as ai-matches widget) */
function mapToProfile(dbUser: any): MatchableProfile {
  const dnaTraits: DNATraitScore[] = (dbUser.dnaTraits || []).map((t: any) => ({
    trait: t.trait,
    score: t.confidence,
    category: t.category as "teaching" | "learning" | "social",
  }));

  const feedback = dbUser.receivedFeedback || [];
  const avgRating =
    feedback.length > 0
      ? feedback.reduce((s: number, f: any) => s + f.overallSatisfaction, 0) / feedback.length / 2
      : 3.5;

  const totalSessions = (dbUser.roomParticipants || []).length;
  const stream = (dbUser.stream || "").toLowerCase();
  const bio = (dbUser.bio || "").toLowerCase();
  const combined = `${stream} ${bio}`;

  const skillBank: Record<string, string[]> = {
    react: ["React"], next: ["Next.js"], typescript: ["TypeScript"], javascript: ["JavaScript"],
    python: ["Python"], "machine learning": ["Machine Learning"], ml: ["Machine Learning"],
    dsa: ["Data Structures"], docker: ["Docker"], rust: ["Rust"], node: ["Node.js"],
    java: ["Java"], "c++": ["C++"], sql: ["SQL"], frontend: ["Frontend"], backend: ["Backend"],
    "system design": ["System Design"], competitive: ["Competitive Programming"],
  };

  const foundSkills: string[] = [];
  for (const [kw, skills] of Object.entries(skillBank)) {
    if (combined.includes(kw)) foundSkills.push(...skills);
  }
  const unique = [...new Set(foundSkills)];
  const mid = Math.ceil(unique.length / 2);

  return {
    id: dbUser.id,
    displayName: dbUser.displayName,
    username: dbUser.username,
    avatarUrl: dbUser.avatarUrl,
    campus: dbUser.campus,
    stream: dbUser.stream,
    year: dbUser.year,
    bio: dbUser.bio,
    skillsToTeach: unique.length > 0 ? unique.slice(0, mid) : ["Programming"],
    skillsToLearn: unique.length > 0 ? unique.slice(mid) : ["New Skills"],
    goals: ["Learn new skills", "Grow my network"],
    learningStyle: "Hands-on",
    availability: ["Evening", "Night"],
    preferredLanguage: "English",
    dnaTraits,
    knowledgeCredits: dbUser.knowledgeCredits || 0,
    trustScore: Math.min(dbUser.trustScore / 20, 5),
    totalSessions,
    avgRating,
    streak: Math.min(totalSessions, 30),
    energyMode: "focused",
    isOnline: true,
    lastActiveAt: dbUser.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

function DiscoverMatchCard({ match, rank }: { match: MatchResult; rank: number }) {
  const { user, score, reasons, explanation } = match;
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  async function handleConnect() {
    setConnecting(true);
    const res = await sendMatchRequest(user.id);
    setConnecting(false);
    if (res.success) setConnected(true);
  }

  const scoreColor =
    score.overall >= 80 ? "text-success" : score.overall >= 60 ? "text-primary" : "text-warning";

  return (
    <SurfaceCard className="hover:border-border/60 transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-lg font-bold text-muted-foreground/40">#{rank}</span>
          <div className={cn(
            "text-xl font-bold tabular-nums", scoreColor
          )}>
            {score.overall}%
          </div>
        </div>

        {/* Avatar + Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <UserAvatar
              name={user.displayName}
              src={user.avatarUrl || undefined}
              size="lg"
              showOnline={user.isOnline}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold">{user.displayName}</h3>
              <p className="text-[11px] text-muted-foreground">
                {user.stream}{user.year ? ` · ${user.year}` : ""}{user.campus ? ` · ${user.campus}` : ""}
              </p>
              {user.bio && (
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Match reasons */}
          {reasons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {reasons.slice(0, 4).map((reason) => (
                <StatusBadge
                  key={reason.factor}
                  variant={reason.strength === "strong" ? "primary" : reason.strength === "good" ? "default" : "secondary"}
                  size="xs"
                >
                  {reason.emoji} {reason.label}
                </StatusBadge>
              ))}
            </div>
          )}

          {/* Explanation summary */}
          {explanation.summary && (
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              {explanation.summary}
            </p>
          )}

          {/* Score breakdown */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[
              { label: "Skills", val: score.skills },
              { label: "Goals", val: score.goals },
              { label: "DNA", val: score.dna },
              { label: "Reputation", val: score.reputation },
            ].map(({ label, val }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">{label}</span>
                  <span className="text-[9px] font-semibold tabular-nums">{Math.round(val * 100)}%</span>
                </div>
                <div className="h-1 rounded-full bg-border/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/60"
                    style={{ width: `${Math.round(val * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connect button */}
        <Button
          size="sm"
          variant={connected ? "secondary" : "default"}
          className="shrink-0 gap-1.5"
          disabled={connecting || connected}
          onClick={handleConnect}
        >
          {connecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : connected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Sent
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              Connect
            </>
          )}
        </Button>
      </div>
    </SurfaceCard>
  );
}

function MatchCardSkeleton() {
  return (
    <SurfaceCard>
      <div className="flex items-start gap-4 animate-pulse">
        <div className="w-10 space-y-2 shrink-0">
          <div className="h-4 w-6 bg-muted rounded" />
          <div className="h-6 w-10 bg-muted rounded" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted rounded" />
            </div>
          </div>
          <div className="h-3 w-full bg-muted rounded" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

export default function DiscoverPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    onlineOnly: false,
    campusOnly: false,
  });

  async function loadMatches() {
    setLoading(true);
    try {
      const res = await getPotentialMatches();
      if (res.data) {
        const { currentUser, candidates } = res.data;
        const userProfile = mapToProfile(currentUser);
        const candidateProfiles = candidates.map(mapToProfile);

        const results = await findMatches(userProfile, candidateProfiles, {
          userId: userProfile.id,
          limit: 10,
          minScore: 10,
          filters: {
            onlineOnly: filters.onlineOnly,
            campus: filters.campusOnly ? userProfile.campus || undefined : undefined,
          },
        });
        setMatches(results);
      }
    } catch (err) {
      console.error("Match error:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMatches();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const topMatch = matches[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover"
        description="AI-powered peer matching based on your Learning DNA"
      >
        <Button
          size="sm"
          variant="secondary"
          onClick={loadMatches}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
          Refresh
        </Button>
      </PageHeader>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-muted-foreground font-medium mr-1">
          <Filter className="w-3 h-3 inline mr-1" />
          Filters:
        </span>
        <button
          onClick={() =>
            setFilters((f) => ({ ...f, onlineOnly: !f.onlineOnly }))
          }
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            filters.onlineOnly
              ? "bg-success/10 border-success/30 text-success"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <Wifi className="w-3 h-3" />
          Online now
        </button>
        <button
          onClick={() =>
            setFilters((f) => ({ ...f, campusOnly: !f.campusOnly }))
          }
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            filters.campusOnly
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <MapPin className="w-3 h-3" />
          Same campus
        </button>
      </div>

      {/* Match count */}
      {!loading && matches.length > 0 && (
        <div className="flex items-center gap-2">
          <StatusBadge variant="primary" size="sm" dot>
            {matches.length} matches found
          </StatusBadge>
          {topMatch && (
            <span className="text-[11px] text-muted-foreground">
              Top match: {topMatch.score.overall}% with {topMatch.user.displayName}
            </span>
          )}
        </div>
      )}

      {/* AI insight card */}
      {!loading && matches.length > 0 && topMatch && (
        <SurfaceCard className="flex items-start gap-3 bg-primary/[0.03] border-primary/10">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[13px] font-semibold mb-0.5">AI Insight</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {topMatch.explanation.summary}{" "}
              {topMatch.explanation.tips?.[0] && topMatch.explanation.tips[0]}
            </p>
          </div>
        </SurfaceCard>
      )}

      {/* Match list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <MatchCardSkeleton />
              <MatchCardSkeleton />
              <MatchCardSkeleton />
            </motion.div>
          ) : matches.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {matches.map((match, i) => (
                <DiscoverMatchCard key={match.user.id} match={match} rank={i + 1} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <EmptyState
                icon={Sparkles}
                title="No matches found"
                description="Try adjusting your filters, updating your profile, or invite more peers to LearnLoop!"
                action={
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setFilters({ onlineOnly: false, campusOnly: false })
                    }
                  >
                    Clear filters
                  </Button>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
