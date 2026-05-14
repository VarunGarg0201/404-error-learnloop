"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import { getPotentialMatches } from "@/features/dashboard/actions";
import { findMatches } from "@/lib/ai/matching";
import type { MatchResult, MatchableProfile } from "@/lib/ai/types";
import {
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   AI Matches Widget — Dashboard mini-view
   ═══════════════════════════════════════════════════════════ */

function MatchMiniCard({ match }: { match: MatchResult }) {
  const { user, score, reasons } = match;
  const topReason = reasons[0];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg",
        "border border-border/30 bg-card/50",
        "hover:border-border/60 hover:bg-accent/30",
        "transition-all duration-150 cursor-pointer group"
      )}
    >
      <UserAvatar name={user.displayName} src={user.avatarUrl || undefined} size="md" showOnline={user.isOnline} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">{user.displayName}</p>
          <StatusBadge variant="primary" size="xs">
            {score.overall}%
          </StatusBadge>
        </div>
        <p className="text-[11px] text-muted-foreground truncate">
          {user.stream}{user.year ? ` · ${user.year}` : ""}
        </p>
        {topReason && (
          <p className="text-[10px] text-muted-foreground mt-1 truncate">
            {topReason.emoji} {topReason.detail}
          </p>
        )}
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  );
}

function mapToProfile(dbUser: any): MatchableProfile {
  return {
    id: dbUser.id,
    displayName: dbUser.displayName,
    username: dbUser.username,
    avatarUrl: dbUser.avatarUrl,
    campus: dbUser.campus,
    stream: dbUser.stream,
    year: dbUser.year,
    bio: dbUser.bio,
    skillsToTeach: ["React", "JavaScript"], // Default for now
    skillsToLearn: ["Next.js", "TypeScript"],
    goals: ["Get a job", "Learn fast"],
    learningStyle: "visual",
    availability: ["evenings"],
    preferredLanguage: "English",
    dnaTraits: [],
    knowledgeCredits: dbUser.knowledgeCredits || 0,
    trustScore: dbUser.trustScore || 100,
    totalSessions: 5,
    avgRating: 4.5,
    streak: 3,
    energyMode: "focused",
    isOnline: true,
    lastActiveAt: new Date().toISOString(),
  };
}

export function AIMatchesWidget({ className }: { className?: string }) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPotentialMatches();
        if (res.data) {
          const { currentUser, candidates } = res.data;
          
          if (candidates.length > 0) {
            // Use the same matching logic but with real users
            const profile = mapToProfile(currentUser);
            const candidateProfiles = candidates.map(mapToProfile);

            const results = await findMatches(profile, candidateProfiles, {
              userId: profile.id,
              limit: 3,
              minScore: 10,
            });
            setMatches(results);
          }
        }
      } catch (e) {
        console.error("Match error", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <Widget
      title="AI Matches"
      description="Peers matched to your Learning DNA"
      icon={Sparkles}
      action={
        matches.length > 0
          ? { label: "View all", onClick: () => {} }
          : undefined
      }
      className={className}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-2">
          {matches.map((match) => (
            <MatchMiniCard key={match.user.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No matches yet"
          description="Complete your profile to get AI-powered peer recommendations."
          action={<Button size="sm" variant="secondary">Complete profile</Button>}
        />
      )}
    </Widget>
  );
}
