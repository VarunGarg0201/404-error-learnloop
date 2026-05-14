"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge, KCBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import { getFullProfile } from "@/features/profile/actions";
import {
  Coins,
  TrendingUp,
  BookOpen,
  Users,
  MessageSquare,
  Star,
  Flame,
  Award,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Knowledge Credit Dashboard
   ─────────────────────────────────────────────────────────
   Shows KC balance, earning history, ways to earn more,
   and spending categories.
   ═══════════════════════════════════════════════════════════ */

const EARN_METHODS = [
  { icon: BookOpen, label: "Teach a concept", kc: "+15 KC", href: "/teach", color: "text-primary" },
  { icon: Star, label: "Give session feedback", kc: "+5 KC", href: "/dashboard", color: "text-warning" },
  { icon: Star, label: "Receive session feedback", kc: "+10 KC", href: "/rooms", color: "text-success" },
  { icon: MessageSquare, label: "Help in study rooms", kc: "+20 KC", href: "/rooms", color: "text-info" },
  { icon: Users, label: "Squad consistency bonus", kc: "+10 KC", href: "/squads", color: "text-primary" },
  { icon: Flame, label: "7-day streak", kc: "+25 KC", href: "/dashboard", color: "text-destructive" },
];

const CATEGORY_META: Record<string, { icon: typeof Coins; label: string; color: string }> = {
  teaching: { icon: BookOpen, label: "Teaching", color: "bg-primary/10 text-primary" },
  helping: { icon: MessageSquare, label: "Helping", color: "bg-info/10 text-info" },
  collaboration: { icon: Users, label: "Collaboration", color: "bg-success/10 text-success" },
  feedback: { icon: Star, label: "Feedback", color: "bg-warning/10 text-warning" },
  consistency: { icon: Flame, label: "Consistency", color: "bg-destructive/10 text-destructive" },
};

function getTimeAgo(d: string | Date) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function KCDashboardPage() {
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

  const totalKC = profile?.totalKC ?? user?.knowledgeCredits ?? 0;
  const entries = profile?.creditEntries || [];
  const trustScore = profile?.trustScore ?? user?.trustScore ?? 0;

  // Group entries by category
  const categoryTotals: Record<string, number> = {};
  entries.forEach((e: any) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const maxCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Credits"
        description="Your learning economy — earn KC by teaching, helping, and staying consistent."
      />

      {/* ─── Overview cards ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SurfaceCard className="text-center relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/8 rounded-full blur-2xl" />
          <Coins className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-3xl font-bold tabular-nums">{totalKC.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Total KC Earned</p>
        </SurfaceCard>

        <SurfaceCard className="text-center relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-success/8 rounded-full blur-2xl" />
          <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="text-3xl font-bold tabular-nums">{trustScore}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Trust Score</p>
        </SurfaceCard>

        <SurfaceCard className="text-center relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-warning/8 rounded-full blur-2xl" />
          <Award className="w-8 h-8 text-warning mx-auto mb-2" />
          <p className="text-3xl font-bold tabular-nums">{entries.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Transactions</p>
        </SurfaceCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left — History + Categories */}
        <div className="lg:col-span-7 space-y-5">
          {/* Category breakdown */}
          {Object.keys(categoryTotals).length > 0 && (
            <Widget title="Earnings by Category" icon={Coins}>
              <div className="space-y-3">
                {Object.entries(categoryTotals)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, total]) => {
                    const meta = CATEGORY_META[cat] || { icon: Coins, label: cat, color: "bg-muted text-muted-foreground" };
                    const Icon = meta.icon;
                    const pct = totalKC > 0 ? Math.round((total / totalKC) * 100) : 0;
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", meta.color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{meta.label}</span>
                            <span className="text-xs font-bold tabular-nums">{total} KC</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                            <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Widget>
          )}

          {/* Transaction history */}
          <Widget title="Recent Transactions" icon={TrendingUp} noPadding>
            {entries.length > 0 ? (
              <div className="divide-y divide-border/30">
                {entries.map((entry: any) => {
                  const meta = CATEGORY_META[entry.category] || { icon: Coins, label: entry.category, color: "bg-muted text-muted-foreground" };
                  const Icon = meta.icon;
                  return (
                    <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", meta.color)}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">{entry.reason}</p>
                        <p className="text-[10px] text-muted-foreground">{getTimeAgo(entry.createdAt)}</p>
                      </div>
                      <span className="text-xs font-bold text-success tabular-nums shrink-0">
                        +{entry.amount} KC
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Coins}
                title="No transactions yet"
                description="Start earning KC by teaching, helping, or giving feedback."
                className="py-8"
              />
            )}
          </Widget>
        </div>

        {/* Right — Ways to earn */}
        <div className="lg:col-span-5 space-y-5">
          <Widget title="Ways to Earn KC" icon={Coins}>
            <div className="space-y-2">
              {EARN_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <Link href={method.href} key={method.label}>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/40 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10">
                        <Icon className={cn("w-4 h-4", method.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{method.label}</p>
                        <p className="text-[10px] text-muted-foreground">{method.kc}</p>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Widget>

          {/* Insight card */}
          {maxCategory && (
            <SurfaceCard className="bg-primary/[0.03] border-primary/10">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold mb-1">Your Strength</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Most of your KC ({maxCategory[1]} KC) comes from <strong>{CATEGORY_META[maxCategory[0]]?.label || maxCategory[0]}</strong>.
                    {maxCategory[0] === "teaching" && " You're a natural teacher — keep sharing knowledge!"}
                    {maxCategory[0] === "feedback" && " Your reviews help peers grow. Great work!"}
                    {maxCategory[0] === "collaboration" && " You thrive in team environments."}
                    {maxCategory[0] === "helping" && " You're always there when peers need help."}
                    {maxCategory[0] === "consistency" && " Your consistency is inspiring!"}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          )}
        </div>
      </div>
    </div>
  );
}
