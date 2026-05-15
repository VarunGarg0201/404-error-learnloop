"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { Widget } from "@/components/shared/widgets";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/badges";
import { useUserStore } from "@/store/user-store";
import { getFullProfile } from "@/features/profile/actions";
import { evolveDNATraits } from "@/features/dna/evolve";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Flame,
  Award,
  Target,
  BookOpen,
  Users,
  Star,
  Brain,
  Loader2,
  ArrowUpRight,
  Calendar,
  Zap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Growth Analytics Page
   ─────────────────────────────────────────────────────────
   Retention through visible growth: streaks, milestones,
   contribution summaries, evolving Learning DNA.
   ═══════════════════════════════════════════════════════════ */

const MILESTONES = [
  { threshold: 1, label: "First Session", emoji: "🌱", description: "Joined your first study room" },
  { threshold: 5, label: "Getting Started", emoji: "🔥", description: "Completed 5 sessions" },
  { threshold: 10, label: "Active Learner", emoji: "📚", description: "10 sessions completed" },
  { threshold: 25, label: "Knowledge Sharer", emoji: "💡", description: "25 sessions — you're teaching others!" },
  { threshold: 50, label: "Community Pillar", emoji: "🏛️", description: "50 sessions — a LearnLoop veteran" },
  { threshold: 100, label: "Legend", emoji: "👑", description: "100 sessions — legendary status" },
];

const KC_MILESTONES = [
  { threshold: 50, label: "First 50 KC", emoji: "⚡" },
  { threshold: 100, label: "100 KC Club", emoji: "💎" },
  { threshold: 500, label: "Knowledge Pro", emoji: "🏆" },
  { threshold: 1000, label: "KC Master", emoji: "🌟" },
  { threshold: 5000, label: "KC Legend", emoji: "👑" },
];

function StatCard({ icon: Icon, label, value, color, sub }: { icon: typeof TrendingUp; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <SurfaceCard className="text-center relative overflow-hidden">
      <div className={cn("absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-30", color)} />
      <Icon className={cn("w-6 h-6 mx-auto mb-1.5", color)} />
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>}
    </SurfaceCard>
  );
}

function MilestoneItem({ milestone, achieved }: { milestone: typeof MILESTONES[0]; achieved: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border transition-all",
      achieved
        ? "bg-success/[0.04] border-success/20"
        : "bg-card border-border/30 opacity-50"
    )}>
      <span className="text-xl">{milestone.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", achieved ? "text-foreground" : "text-muted-foreground")}>
          {milestone.label}
        </p>
        <p className="text-[10px] text-muted-foreground">{milestone.description}</p>
      </div>
      {achieved && (
        <StatusBadge variant="success" size="xs">✓ Achieved</StatusBadge>
      )}
    </div>
  );
}

function WeekGrid({ sessions }: { sessions: number }) {
  // Simulated activity heatmap for last 7 weeks
  const weeks = 7;
  const days = 7;
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Activity (last 7 weeks)</p>
      <div className="flex gap-1">
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }, (_, d) => {
              // Simulate activity based on session count
              const active = Math.random() < Math.min(sessions / 50, 0.8);
              const intensity = active ? (Math.random() > 0.5 ? "bg-primary" : "bg-primary/50") : "bg-muted/40";
              return (
                <div
                  key={d}
                  className={cn("w-3 h-3 rounded-sm", intensity)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GrowthPage() {
  const { user } = useUserStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFullProfile().then((res) => {
      if (res.data) setProfile(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalSessions = profile?.totalSessions ?? 0;
  const totalKC = profile?.totalKC ?? 0;
  const totalGroups = profile?.totalGroups ?? 0;
  const totalFeedback = profile?.totalFeedback ?? 0;
  const avgRating = profile?.avgRating ?? 0;
  const dnaTraits = profile?.dnaTraits || [];
  const activities = profile?.activities || [];
  const totalPosts = profile?.totalPosts ?? 0;

  // Streak calculation (simplified — count recent activities)
  const streak = Math.min(activities.length, 14);

  // Teaching impact metrics
  const teachingImpact = {
    postsCreated: totalPosts,
    studentsHelped: Math.floor(totalSessions * 0.6),
    kcFromTeaching: Math.floor(totalKC * 0.4),
  };

  const [evolving, setEvolving] = useState(false);
  const [evolved, setEvolved] = useState(false);
  async function handleEvolveDNA() {
    setEvolving(true);
    const res = await evolveDNATraits();
    setEvolving(false);
    if (res.success) {
      setEvolved(true);
      const refreshed = await getFullProfile();
      if (refreshed.data) setProfile(refreshed.data);
    }
  }

  // Achievements
  const achievedSessionMilestones = MILESTONES.filter((m) => totalSessions >= m.threshold);
  const achievedKCMilestones = KC_MILESTONES.filter((m) => totalKC >= m.threshold);
  const nextSessionMilestone = MILESTONES.find((m) => totalSessions < m.threshold);
  const nextKCMilestone = KC_MILESTONES.find((m) => totalKC < m.threshold);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Growth Analytics"
        description="Track your learning journey — streaks, milestones, and growth."
      />

      {/* ─── Top stats ─── */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard icon={Flame} label="Day Streak" value={streak} color="text-destructive" sub={streak > 7 ? "🔥 On fire!" : "Keep going!"} />
        <StatCard icon={Target} label="Sessions" value={totalSessions} color="text-primary" />
        <StatCard icon={Zap} label="KC Earned" value={totalKC} color="text-warning" />
        <StatCard icon={Star} label="Avg Rating" value={avgRating > 0 ? `${avgRating}/10` : "—"} color="text-success" />
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Activity heatmap */}
          <Widget title="Contribution Activity" icon={BarChart3}>
            <WeekGrid sessions={totalSessions} />
            <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-muted/40" /> None</span>
              <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-primary/50" /> Light</span>
              <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-primary" /> Active</span>
            </div>
          </Widget>

          {/* Session milestones */}
          <Widget title="Session Milestones" icon={Award}>
            <div className="space-y-2">
              {MILESTONES.map((m) => (
                <MilestoneItem key={m.threshold} milestone={m} achieved={totalSessions >= m.threshold} />
              ))}
            </div>
            {nextSessionMilestone && (
              <div className="mt-3 p-2.5 rounded-lg bg-primary/[0.04] border border-primary/10">
                <p className="text-[11px] text-muted-foreground">
                  <strong className="text-foreground">Next:</strong> {nextSessionMilestone.emoji} {nextSessionMilestone.label} — {nextSessionMilestone.threshold - totalSessions} sessions to go
                </p>
              </div>
            )}
          </Widget>

          {/* Teaching Impact — Advanced Analytics */}
          <Widget title="Teaching Impact" icon={BookOpen}>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-primary/[0.04] border border-primary/10">
                <p className="text-xl font-bold text-primary">{teachingImpact.postsCreated}</p>
                <p className="text-[10px] text-muted-foreground">Posts Created</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-success/[0.04] border border-success/10">
                <p className="text-xl font-bold text-success">{teachingImpact.studentsHelped}</p>
                <p className="text-[10px] text-muted-foreground">Students Helped</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/[0.04] border border-warning/10">
                <p className="text-xl font-bold text-warning">{teachingImpact.kcFromTeaching}</p>
                <p className="text-[10px] text-muted-foreground">KC from Teaching</p>
              </div>
            </div>
          </Widget>

          {/* Contribution Breakdown — Advanced Analytics */}
          <Widget title="Contribution Breakdown" icon={BarChart3}>
            <div className="space-y-3">
              {[
                { label: "Teaching", value: totalPosts * 15, color: "bg-primary" },
                { label: "Sessions", value: totalSessions * 10, color: "bg-success" },
                { label: "Feedback", value: totalFeedback * 5, color: "bg-info" },
                { label: "Squads", value: totalGroups * 20, color: "bg-warning" },
              ].map((item) => {
                const maxVal = Math.max(totalPosts * 15, totalSessions * 10, totalFeedback * 5, totalGroups * 20, 1);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-muted-foreground tabular-nums">{item.value} pts</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", item.color)}
                        style={{ width: `${Math.round((item.value / maxVal) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Widget>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-5">
          {/* KC milestones */}
          <Widget title="KC Milestones" icon={Zap}>
            <div className="space-y-2">
              {KC_MILESTONES.map((m) => (
                <div key={m.threshold} className={cn(
                  "flex items-center gap-3 p-2 rounded-lg",
                  totalKC >= m.threshold ? "bg-warning/[0.06]" : "opacity-40"
                )}>
                  <span className="text-lg">{m.emoji}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground">{m.threshold} KC</p>
                  </div>
                  {totalKC >= m.threshold && (
                    <StatusBadge variant="warning" size="xs">✓</StatusBadge>
                  )}
                </div>
              ))}
            </div>
          </Widget>

          {/* Learning DNA summary */}
          <Widget title="Learning DNA Growth" icon={Brain}>
            {dnaTraits.length > 0 ? (
              <div className="space-y-2.5">
                {dnaTraits.slice(0, 5).map((t: any) => (
                  <div key={t.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium">{t.trait}</span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">{Math.round(t.confidence * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          t.category === "teaching" ? "bg-primary" : t.category === "learning" ? "bg-success" : "bg-info"
                        )}
                        style={{ width: `${Math.round(t.confidence * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground mt-2">
                  DNA traits evolve as you complete more sessions and receive feedback.
                </p>
              </div>
            ) : (
              <EmptyState
                icon={Brain}
                title="No DNA traits yet"
                description="Complete sessions and get feedback to build your Learning DNA."
              />
            )}
          </Widget>

          {/* AI DNA Evolution */}
          <SurfaceCard className="bg-primary/[0.03] border-primary/10">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[13px] font-semibold mb-1">AI DNA Evolution</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                  Let AI analyze your activity patterns and automatically evolve your Learning DNA traits.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-1.5 text-xs"
                  onClick={handleEvolveDNA}
                  disabled={evolving || evolved}
                >
                  {evolving ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowUpRight className="w-3 h-3" />}
                  {evolved ? "✓ DNA Updated" : "Evolve DNA"}
                </Button>
              </div>
            </div>
          </SurfaceCard>

          {/* Quick summary card */}
          <SurfaceCard className="bg-primary/[0.03] border-primary/10">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold mb-1">Growth Summary</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  You've completed <strong>{totalSessions}</strong> sessions,
                  earned <strong>{totalKC} KC</strong>,
                  joined <strong>{totalGroups}</strong> groups,
                  and received <strong>{totalFeedback}</strong> feedback reviews.
                  {totalSessions > 10 ? " You're making great progress!" : " Keep going — every session counts!"}
                </p>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
