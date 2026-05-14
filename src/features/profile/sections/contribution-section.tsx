"use client";

import { cn } from "@/lib/utils";
import { Widget, ProgressWidget } from "@/components/shared/widgets";
import {
  BarChart3,
  BookOpen,
  HelpCircle,
  Users,
  MessageSquare,
  Clock,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Contribution History — Visual summary of contributions
   ═══════════════════════════════════════════════════════════ */

// GitHub-style contribution grid
function ContributionGrid() {
  // Generate 12 weeks of demo data
  const weeks = 12;
  const days = 7;
  const data: number[][] = [];

  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      // Pseudo-random intensity based on position
      const seed = (w * 7 + d) * 2654435761;
      const val = Math.abs(seed % 5); // 0-4
      week.push(val);
    }
    data.push(week);
  }

  const intensityClasses = [
    "bg-muted/40",
    "bg-primary/15",
    "bg-primary/30",
    "bg-primary/50",
    "bg-primary/75",
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Contribution Activity
        </p>
        <p className="text-[10px] text-muted-foreground">Last 12 weeks</p>
      </div>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((intensity, di) => (
              <div
                key={di}
                className={cn(
                  "w-[10px] h-[10px] rounded-[2px] transition-colors",
                  intensityClasses[intensity]
                )}
                title={`${intensity} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1 justify-end">
        <span className="text-[9px] text-muted-foreground mr-1">Less</span>
        {intensityClasses.map((cls, i) => (
          <div key={i} className={cn("w-[10px] h-[10px] rounded-[2px]", cls)} />
        ))}
        <span className="text-[9px] text-muted-foreground ml-1">More</span>
      </div>
    </div>
  );
}

/* ─── Category breakdown ─── */
function CategoryBreakdown() {
  const categories = [
    { label: "Teaching sessions", value: 42, total: 60, color: "primary" as const, icon: BookOpen },
    { label: "Help responses", value: 85, total: 100, color: "success" as const, icon: HelpCircle },
    { label: "Room participation", value: 28, total: 50, color: "info" as const, icon: MessageSquare },
    { label: "Squad check-ins", value: 65, total: 90, color: "warning" as const, icon: Users },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        Category Breakdown
      </p>
      <div className="space-y-2.5">
        {categories.map((cat) => (
          <ProgressWidget
            key={cat.label}
            label={cat.label}
            value={Math.round((cat.value / cat.total) * 100)}
            description={`${cat.value} of ${cat.total}`}
            color={cat.color}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Time stats ─── */
function TimeStats() {
  const stats = [
    { label: "Total time", value: "48h 30m" },
    { label: "Avg. session", value: "42 min" },
    { label: "This week", value: "6h 15m" },
    { label: "Peak day", value: "Wednesday" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        Time Invested
      </p>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center p-2.5 rounded-lg bg-muted/30 border border-border/30"
          >
            <p className="text-sm font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContributionSection({ className }: { className?: string }) {
  return (
    <Widget
      title="Contributions"
      description="Your impact over time"
      icon={BarChart3}
      className={className}
    >
      <div className="space-y-5">
        <ContributionGrid />
        <CategoryBreakdown />
        <TimeStats />
      </div>
    </Widget>
  );
}
