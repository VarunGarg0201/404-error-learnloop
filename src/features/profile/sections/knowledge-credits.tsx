"use client";

import { cn } from "@/lib/utils";
import { Widget } from "@/components/shared/widgets";
import { StatusBadge } from "@/components/shared/badges";
import {
  Zap,
  ArrowUp,
  ArrowDown,
  BookOpen,
  HelpCircle,
  Users,
  MessageSquare,
  Star,
  type LucideIcon,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Knowledge Credits Section — Breakdown + Recent history
   ═══════════════════════════════════════════════════════════ */

interface CreditEntry {
  icon: LucideIcon;
  label: string;
  amount: number;
  category: string;
  time: string;
}

const DEMO_CREDITS: CreditEntry[] = [
  { icon: BookOpen, label: "Taught React hooks to Karthik", amount: 15, category: "Teaching", time: "2h ago" },
  { icon: HelpCircle, label: "Helped with BST deletion", amount: 8, category: "Helping", time: "5h ago" },
  { icon: Star, label: "Received 5⭐ review", amount: 5, category: "Feedback", time: "1d ago" },
  { icon: Users, label: "Squad daily check-in", amount: 3, category: "Consistency", time: "1d ago" },
  { icon: MessageSquare, label: "Hosted DBMS revision room", amount: 10, category: "Teaching", time: "2d ago" },
  { icon: HelpCircle, label: "Answered Python doubt", amount: 5, category: "Helping", time: "3d ago" },
];

const categoryVariant: Record<string, "primary" | "success" | "info" | "warning"> = {
  Teaching: "primary",
  Helping: "success",
  Feedback: "info",
  Consistency: "warning",
};

interface KnowledgeCreditsSectionProps {
  totalCredits?: number;
  weeklyCredits?: number;
  className?: string;
}

export function KnowledgeCreditsSection({
  totalCredits = 1420,
  weeklyCredits = 142,
  className,
}: KnowledgeCreditsSectionProps) {
  return (
    <Widget
      title="Knowledge Credits"
      description="Your earning history"
      icon={Zap}
      action={{ label: "Details", onClick: () => {} }}
      className={className}
    >
      {/* Summary */}
      <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold tracking-tight">
            {totalCredits.toLocaleString()}{" "}
            <span className="text-sm font-medium text-muted-foreground">KC</span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            +{weeklyCredits} this week
          </p>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="space-y-0.5">
        {DEMO_CREDITS.map((entry, i) => {
          const Icon = entry.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted/40 shrink-0">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium truncate">{entry.label}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <StatusBadge
                    variant={categoryVariant[entry.category] || "default"}
                    size="xs"
                  >
                    {entry.category}
                  </StatusBadge>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-xs font-semibold text-success flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3" />
                  +{entry.amount}
                </span>
                <span className="text-[10px] text-muted-foreground">{entry.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}
