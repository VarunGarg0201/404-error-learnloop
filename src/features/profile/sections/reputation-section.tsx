"use client";

import { cn } from "@/lib/utils";
import { Widget } from "@/components/shared/widgets";
import { StatusBadge } from "@/components/shared/badges";
import {
  Award,
  BookOpen,
  HelpCircle,
  Users,
  MessageSquare,
  Star,
  Flame,
  Target,
  type LucideIcon,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Reputation & Stats — Combined teaching + collab stats
   ═══════════════════════════════════════════════════════════ */

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

const DEMO_STATS: StatItem[] = [
  { icon: BookOpen, label: "Sessions taught", value: 47, color: "text-primary", bgColor: "bg-primary/10" },
  { icon: HelpCircle, label: "Help given", value: 124, color: "text-success", bgColor: "bg-success/10" },
  { icon: Users, label: "Peers helped", value: 38, color: "text-info", bgColor: "bg-info/10" },
  { icon: MessageSquare, label: "Rooms hosted", value: 12, color: "text-warning", bgColor: "bg-warning/10" },
  { icon: Star, label: "Avg. rating", value: "4.8", color: "text-primary", bgColor: "bg-primary/10" },
  { icon: Flame, label: "Best streak", value: "21 days", color: "text-destructive", bgColor: "bg-destructive/10" },
];

export function ReputationSection({ className }: { className?: string }) {
  return (
    <Widget
      title="Reputation & Stats"
      description="Your teaching & collaboration impact"
      icon={Award}
      className={className}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {DEMO_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl text-center",
                "border border-border/30 bg-card/50",
                "hover:border-border/50 transition-colors"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg",
                  stat.bgColor
                )}
              >
                <Icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <p className="text-lg font-bold leading-none">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground leading-snug">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}
