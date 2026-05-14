"use client";

import { cn } from "@/lib/utils";
import { Widget } from "@/components/shared/widgets";
import {
  Clock,
  BookOpen,
  HelpCircle,
  Users,
  MessageSquare,
  Star,
  Zap,
  CheckCircle,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Activity Timeline — Chronological activity feed
   ═══════════════════════════════════════════════════════════ */

interface TimelineEntry {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

const DEMO_TIMELINE: TimelineEntry[] = [
  {
    icon: BookOpen,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Taught React hooks session",
    description: "45 min session with Karthik · Earned 15 KC",
    time: "2h ago",
  },
  {
    icon: Star,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
    title: "Received 5⭐ review",
    description: "\"Amazing explanation, very patient!\" — Sneha",
    time: "3h ago",
  },
  {
    icon: HelpCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    title: "Answered help request",
    description: "Helped with BST deletion algorithm",
    time: "5h ago",
  },
  {
    icon: MessageSquare,
    iconColor: "text-info",
    iconBg: "bg-info/10",
    title: "Hosted study room",
    description: "DBMS Revision Sprint · 6 participants",
    time: "1d ago",
  },
  {
    icon: Users,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Joined DSA Warriors squad",
    description: "5 members · Goal: 3 problems daily",
    time: "2d ago",
  },
  {
    icon: CheckCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    title: "Completed onboarding",
    description: "Profile setup complete · Learning DNA initialized",
    time: "5d ago",
  },
  {
    icon: UserPlus,
    iconColor: "text-info",
    iconBg: "bg-info/10",
    title: "Joined LearnLoop",
    description: "Welcome to the learning ecosystem!",
    time: "5d ago",
  },
];

export function ActivityTimeline({ className }: { className?: string }) {
  return (
    <Widget
      title="Activity"
      description="Recent timeline"
      icon={Clock}
      noPadding
      action={{ label: "See all", onClick: () => {} }}
      className={className}
    >
      <div className="relative pl-4 pr-4 pb-4">
        {/* Vertical line */}
        <div className="absolute left-[1.625rem] top-0 bottom-4 w-px bg-border/50" />

        <div className="space-y-0">
          {DEMO_TIMELINE.map((entry, i) => {
            const Icon = entry.icon;
            return (
              <div key={i} className="relative flex items-start gap-3 py-2.5">
                {/* Dot on the timeline */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-6 h-6 rounded-md shrink-0",
                    entry.iconBg
                  )}
                >
                  <Icon className={cn("w-3 h-3", entry.iconColor)} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[12px] font-medium leading-tight">
                    {entry.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {entry.description}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap pt-1 shrink-0">
                  {entry.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Widget>
  );
}
