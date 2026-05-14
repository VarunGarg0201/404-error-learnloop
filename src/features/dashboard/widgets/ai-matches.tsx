"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import { getPotentialMatches, sendMatchRequest } from "@/features/dashboard/actions";
import { findMatches } from "@/lib/ai/matching";
import type { MatchResult, MatchableProfile, DNATraitScore } from "@/lib/ai/types";
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
   Shows the top 3 AI-powered peer matches based on:
   - Skills complementarity (teach/learn)
   - Goals alignment
   - Learning DNA compatibility
   - Availability overlap
   - Energy mode, reputation, behavior
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

/**
 * Maps a database user (with includes) to a full MatchableProfile.
 * Uses real DNA traits, feedback-derived ratings, and credit data.
 */
function mapToProfile(dbUser: any): MatchableProfile {
  // Extract DNA traits
  const dnaTraits: DNATraitScore[] = (dbUser.dnaTraits || []).map((t: any) => ({
    trait: t.trait,
    score: t.confidence,
    category: t.category as "teaching" | "learning" | "social",
  }));

  // Compute avg rating from feedback
  const feedback = dbUser.receivedFeedback || [];
  const avgRating =
    feedback.length > 0
      ? feedback.reduce(
          (sum: number, f: any) => sum + f.overallSatisfaction,
          0
        ) / feedback.length / 2 // scale 1-10 → 1-5
      : 3.5; // neutral default

  // Derive total sessions from room participations
  const totalSessions = (dbUser.roomParticipants || []).length;

  // Use real data if available, otherwise fall back to heuristics
  const skillsToTeach = dbUser.skillsToTeach?.length > 0 
    ? dbUser.skillsToTeach 
    : inferSkills(dbUser, "teach");
    
  const skillsToLearn = dbUser.skillsToLearn?.length > 0 
    ? dbUser.skillsToLearn 
    : inferSkills(dbUser, "learn");

  const goals = dbUser.goals?.length > 0 
    ? dbUser.goals 
    : inferGoals(dbUser);

  const learningStyle = dbUser.learningStyle || inferLearningStyle(dbUser);
  const availability = dbUser.availability?.length > 0 
    ? dbUser.availability 
    : ["Evening", "Night"];

  return {
    id: dbUser.id,
    displayName: dbUser.displayName,
    username: dbUser.username,
    avatarUrl: dbUser.avatarUrl,
    campus: dbUser.campus,
    stream: dbUser.stream,
    year: dbUser.year,
    bio: dbUser.bio,
    skillsToTeach,
    skillsToLearn,
    goals,
    learningStyle,
    availability,
    preferredLanguage: dbUser.preferredLanguage || "English",
    dnaTraits,
    knowledgeCredits: dbUser.knowledgeCredits || 0,
    trustScore: Math.min(dbUser.trustScore / 20, 5), // scale 0-100 → 0-5
    totalSessions,
    avgRating,
    streak: Math.min(totalSessions, 30), // Approximation
    energyMode: "focused",
    isOnline: true, // In production, check presence
    lastActiveAt: dbUser.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

/** Infer skills from stream + bio as a heuristic */
function inferSkills(user: any, direction: "teach" | "learn"): string[] {
  const stream = (user.stream || "").toLowerCase();
  const bio = (user.bio || "").toLowerCase();
  const combined = `${stream} ${bio}`;

  const skillBank: Record<string, string[]> = {
    "react": ["React"],
    "next": ["Next.js"],
    "typescript": ["TypeScript"],
    "javascript": ["JavaScript"],
    "python": ["Python"],
    "machine learning": ["Machine Learning"],
    "ml": ["Machine Learning"],
    "ai": ["Artificial Intelligence"],
    "data science": ["Data Science"],
    "dsa": ["Data Structures"],
    "algorithm": ["Algorithms"],
    "docker": ["Docker"],
    "rust": ["Rust"],
    "node": ["Node.js"],
    "java": ["Java"],
    "c++": ["C++"],
    "sql": ["SQL"],
    "css": ["CSS"],
    "html": ["HTML"],
    "frontend": ["Frontend Dev"],
    "backend": ["Backend Dev"],
    "fullstack": ["Full-Stack Dev"],
    "full-stack": ["Full-Stack Dev"],
    "cloud": ["Cloud Computing"],
    "aws": ["AWS"],
    "system design": ["System Design"],
    "competitive": ["Competitive Programming"],
  };

  const found: string[] = [];
  for (const [keyword, skills] of Object.entries(skillBank)) {
    if (combined.includes(keyword)) {
      found.push(...skills);
    }
  }

  // If nothing found, provide generic defaults based on stream
  if (found.length === 0) {
    if (stream.includes("computer") || stream.includes("cs")) {
      return direction === "teach"
        ? ["Programming", "Problem Solving"]
        : ["Advanced Topics", "System Design"];
    }
    return direction === "teach" ? ["General Studies"] : ["New Skills"];
  }

  // Split between teach/learn — first half teach, second half learn
  const mid = Math.ceil(found.length / 2);
  const unique = [...new Set(found)];
  return direction === "teach" ? unique.slice(0, mid) : unique.slice(mid);
}

function inferGoals(user: any): string[] {
  const goals = ["Learn new skills"];
  if ((user.bio || "").toLowerCase().includes("placement") || (user.bio || "").toLowerCase().includes("job"))
    goals.push("Prepare for placements");
  if ((user.bio || "").toLowerCase().includes("project") || (user.bio || "").toLowerCase().includes("build"))
    goals.push("Build projects together");
  if ((user.bio || "").toLowerCase().includes("teach") || (user.bio || "").toLowerCase().includes("mentor"))
    goals.push("Help others learn");
  if (goals.length === 1) goals.push("Master a new skill", "Grow my network");
  return goals;
}

function inferLearningStyle(user: any): string {
  const bio = (user.bio || "").toLowerCase();
  if (bio.includes("visual") || bio.includes("diagram")) return "Visual";
  if (bio.includes("hands-on") || bio.includes("build") || bio.includes("code")) return "Hands-on";
  if (bio.includes("read") || bio.includes("write") || bio.includes("note")) return "Reading/Writing";
  return "Hands-on"; // Sensible default for tech students
}

export function AIMatchesWidget({ className }: { className?: string }) {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadMatches() {
    try {
      const res = await getPotentialMatches();
      if (res.data) {
        const { currentUser, candidates } = res.data;
        
        if (candidates.length > 0) {
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
  }

  useEffect(() => {
    loadMatches().finally(() => setLoading(false));
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  }

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
