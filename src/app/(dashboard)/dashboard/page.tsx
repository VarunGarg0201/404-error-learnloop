"use client";

import { useState, useEffect } from "react";
import { QuickAction } from "@/components/shared/widgets";
import { SurfaceCard } from "@/components/shared/cards";
import { UserAvatar } from "@/components/shared/user-avatar";
import { KCBadge } from "@/components/shared/badges";
import { LoadingSpinner } from "@/components/shared/loading-states";
import { useUserStore } from "@/store/user-store";
import {
  Sparkles,
  MessageSquare,
  Users,
  HelpCircle,
} from "lucide-react";

import { StatsRow, ContributionStatsWidget, GrowthWidget } from "@/features/dashboard/widgets/stats";
import { AIMatchesWidget } from "@/features/dashboard/widgets/ai-matches";
import { HelpRequestsWidget } from "@/features/dashboard/widgets/help-requests";
import { StudyRoomsWidget } from "@/features/dashboard/widgets/study-rooms";
import { NotificationsWidget, RecentActivityWidget } from "@/features/dashboard/widgets/notifications";
import { SquadsWidget, CommunitiesWidget } from "@/features/dashboard/widgets/squads-communities";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Dashboard — Personalized Home
   ═══════════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const { user, isLoading } = useUserStore();
  const displayName = user?.displayName || "there";
  const [greeting, setGreeting] = useState("Welcome");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — greeting depends on client time
  useEffect(() => {
    setGreeting(getGreeting());
    setMounted(true);
  }, []);

  if (isLoading && !user) {
    return <LoadingSpinner className="py-32" />;
  }

  return (
    <div className="space-y-8 stagger-children">

      {/* ─── Welcome Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 sm:p-8">
        {/* Ambient gradient blob */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-info/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={displayName}
              src={user?.avatarUrl}
              size="lg"
              showOnline
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {greeting},{" "}
                <span className="text-gradient">{displayName.split(" ")[0]}</span>! 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Here&apos;s what&apos;s happening in your learning ecosystem.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <KCBadge amount={user?.knowledgeCredits ?? 142} />
          </div>
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <SurfaceCard padding="sm" className="overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/30">
          <QuickAction
            icon={HelpCircle}
            label="Ask for help"
            description="Get help from peers"
            href="/rooms"
          />
          <QuickAction
            icon={MessageSquare}
            label="Create room"
            description="Start a study session"
            href="/rooms/new"
          />
          <QuickAction
            icon={Sparkles}
            label="Find matches"
            description="AI-powered matching"
            href="/dashboard"
          />
          <QuickAction
            icon={Users}
            label="Join squad"
            description="Find accountability"
            href="/squads/new"
          />
        </div>
      </SurfaceCard>

      {/* ─── Stats Row ─── */}
      <StatsRow />

      {/* ─── Main Content Grid ─── */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
        {/* Left Column — Primary content (8 cols) */}
        <div className="md:col-span-1 lg:col-span-8 space-y-5">
          <AIMatchesWidget />
          <div className="grid gap-5 sm:grid-cols-2">
            <HelpRequestsWidget />
            <StudyRoomsWidget />
          </div>
          <CommunitiesWidget />
        </div>

        {/* Right Column — Secondary content (4 cols) */}
        <div className="md:col-span-1 lg:col-span-4 space-y-5">
          <GrowthWidget />
          <ContributionStatsWidget />
          <NotificationsWidget />
          <SquadsWidget />
          <RecentActivityWidget />
        </div>
      </div>
    </div>
  );
}

/* ─── Helper (client-only) ─── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Late night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Late night";
}

