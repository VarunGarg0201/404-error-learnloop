"use client";

import { Widget, ProgressWidget, StreakWidget } from "@/components/shared/widgets";
import { StatCard } from "@/components/shared/cards";
import { StatusBadge, KCBadge } from "@/components/shared/badges";
import {
  Zap,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  HelpCircle,
  Users,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Stats & Growth Widgets
   ═══════════════════════════════════════════════════════════ */

/* ─── Stats Row (top of dashboard) ─── */
export function StatsRow({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3 grid-cols-2 lg:grid-cols-4", className)}>
      <StatCard
        label="Knowledge Credits"
        value={142}
        icon={<Zap className="w-4 h-4 text-primary" />}
        description="Earned this week"
        trend={{ value: 12, positive: true }}
        accent="primary"
      />
      <StatCard
        label="Trust Score"
        value="4.8"
        icon={<TrendingUp className="w-4 h-4 text-success" />}
        description="Based on 23 reviews"
        accent="success"
      />
      <StatCard
        label="Sessions"
        value={18}
        icon={<MessageSquare className="w-4 h-4 text-info" />}
        description="This month"
        trend={{ value: 8, positive: true }}
        accent="info"
      />
      <StatCard
        label="Streak"
        value="5 days"
        icon={<Target className="w-4 h-4 text-warning" />}
        description="Keep it going!"
        accent="warning"
      />
    </div>
  );
}

/* ─── Contribution Stats Widget ─── */
interface ContributionStat {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const CONTRIBUTION_STATS: ContributionStat[] = [
  { label: "Sessions taught", value: 12, icon: <BookOpen className="w-3.5 h-3.5 text-primary" /> },
  { label: "Help given", value: 31, icon: <HelpCircle className="w-3.5 h-3.5 text-success" /> },
  { label: "Rooms hosted", value: 5, icon: <MessageSquare className="w-3.5 h-3.5 text-info" /> },
  { label: "Squads active", value: 2, icon: <Users className="w-3.5 h-3.5 text-warning" /> },
];

export function ContributionStatsWidget({ className }: { className?: string }) {
  return (
    <Widget
      title="Contributions"
      description="Your impact this month"
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
}

/* ─── Growth Progress Widget ─── */
export function GrowthWidget({ className }: { className?: string }) {
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
          value={75}
          description="Add skills to teach to reach 100%"
          color="primary"
        />
        <ProgressWidget
          label="Weekly learning goal"
          value={60}
          description="3 of 5 sessions this week"
          color="success"
        />
        <StreakWidget days={5} />
      </div>
    </Widget>
  );
}
