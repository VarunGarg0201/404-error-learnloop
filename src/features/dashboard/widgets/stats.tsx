"use client";

import { memo, useState, useEffect } from "react";

import { Widget, ProgressWidget, StreakWidget } from "@/components/shared/widgets";
import { StatCard } from "@/components/shared/cards";
import { getUserStats } from "@/features/dashboard/actions";
import {
  Zap,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  HelpCircle,
  Users,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Stats & Growth Widgets
   ═══════════════════════════════════════════════════════════ */

export function useUserStatsData() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data } = await getUserStats();
      if (data) {
        setStats(data);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return { stats, loading };
}

/* ─── Stats Row (top of dashboard) ─── */
export const StatsRow = memo(function StatsRow({ className }: { className?: string }) {
  const { stats, loading } = useUserStatsData();

  if (loading) {
    return (
      <div className={cn("grid gap-3 grid-cols-2 lg:grid-cols-4", className)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[104px] rounded-xl bg-card border border-border/40 animate-pulse" />
        ))}
      </div>
    );
  }

  const credits = stats?.knowledgeCredits || 0;
  const trustScore = stats?.trustScore || 100;
  const reviewsCount = stats?.receivedFeedback?.length || 0;
  // Compute sessions dynamically if possible, or fallback to mock if no relation is present
  const sessions = stats?.activities?.filter((a: any) => a.type === "completed_session").length || 0;

  return (
    <div className={cn("grid gap-3 grid-cols-2 lg:grid-cols-4", className)}>
      <StatCard
        label="Knowledge Credits"
        value={credits}
        icon={<Zap className="w-4 h-4 text-primary" />}
        description="Total earned"
        accent="primary"
      />
      <StatCard
        label="Trust Score"
        value={(trustScore / 20).toFixed(1)} // convert 100 scale to 5.0 scale
        icon={<TrendingUp className="w-4 h-4 text-success" />}
        description={`Based on ${reviewsCount} reviews`}
        accent="success"
      />
      <StatCard
        label="Sessions"
        value={sessions}
        icon={<MessageSquare className="w-4 h-4 text-info" />}
        description="Completed"
        accent="info"
      />
      <StatCard
        label="Streak"
        value="0 days"
        icon={<Target className="w-4 h-4 text-warning" />}
        description="Keep it going!"
        accent="warning"
      />
    </div>
  );
});

/* ─── Contribution Stats Widget ─── */
export const ContributionStatsWidget = memo(function ContributionStatsWidget({ className }: { className?: string }) {
  const { stats, loading } = useUserStatsData();

  if (loading) {
    return (
      <Widget title="Contributions" description="Your impact this month" icon={Award} className={className}>
        <div className="flex justify-center items-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      </Widget>
    );
  }

  const taught = stats?.creditEntries?.filter((e: any) => e.category === "teaching").length || 0;
  const helped = stats?.creditEntries?.filter((e: any) => e.category === "helping").length || 0;
  const hosted = stats?.hostedRooms?.length || 0;
  const activeSquads = stats?.groupMemberships?.filter((m: any) => m.group?.type === "squad").length || 0;

  const CONTRIBUTION_STATS = [
    { label: "Sessions taught", value: taught, icon: <BookOpen className="w-3.5 h-3.5 text-primary" /> },
    { label: "Help given", value: helped, icon: <HelpCircle className="w-3.5 h-3.5 text-success" /> },
    { label: "Rooms hosted", value: hosted, icon: <MessageSquare className="w-3.5 h-3.5 text-info" /> },
    { label: "Squads active", value: activeSquads, icon: <Users className="w-3.5 h-3.5 text-warning" /> },
  ];

  return (
    <Widget
      title="Contributions"
      description="Your overall impact"
      icon={Award}
      className={className}
    >
      <div className="grid grid-cols-2 gap-3">
        {CONTRIBUTION_STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/30"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-card shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
});

/* ─── Growth Progress Widget ─── */
export const GrowthWidget = memo(function GrowthWidget({ className }: { className?: string }) {
  const { stats, loading } = useUserStatsData();

  if (loading) {
    return (
      <Widget title="Growth" description="Your learning progress" icon={TrendingUp} className={className}>
        <div className="flex justify-center items-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      </Widget>
    );
  }

  // Calculate simple profile completion based on user fields
  let completion = 20; // base for signing up
  if (stats?.campus) completion += 20;
  if (stats?.stream) completion += 20;
  if (stats?.bio) completion += 20;
  if (stats?.avatarUrl) completion += 20;

  return (
    <Widget
      title="Growth"
      description="Your learning progress"
      icon={TrendingUp}
      className={className}
    >
      <div className="space-y-4">
        <ProgressWidget
          label="Profile completion"
          value={completion}
          description={completion < 100 ? "Add more details to reach 100%" : "Profile is complete!"}
          color="primary"
        />
        <ProgressWidget
          label="Weekly learning goal"
          value={0}
          description="0 of 5 sessions this week"
          color="success"
        />
        <StreakWidget days={0} />
      </div>
    </Widget>
  );
});
