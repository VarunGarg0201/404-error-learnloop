"use client";

import { QuickAction } from "@/components/shared/widgets";
import { SurfaceCard } from "@/components/shared/cards";
import { UserAvatar } from "@/components/shared/user-avatar";
import { KCBadge } from "@/components/shared/badges";
import { useUserStore } from "@/store/user-store";
import {
  Sparkles,
  MessageSquare,
  Users,
  HelpCircle,
  BookOpen,
  Zap,
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
  const { user } = useUserStore();
  const displayName = user?.displayName || "there";
  const greeting = getGreeting();

  return (
    <div className="space-y-6 stagger-children">
      {/* ─── Welcome Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={displayName}
            src={user?.avatarUrl}
            size="lg"
            showOnline
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {greeting}, {displayName.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening in your learning ecosystem.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <KCBadge amount={user?.knowledgeCredits ?? 142} />
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <SurfaceCard padding="sm" className="overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0.5">
          <QuickAction
            icon={HelpCircle}
            label="Ask for help"
            description="Get help from peers"
          />
          <QuickAction
            icon={MessageSquare}
            label="Create room"
            description="Start a study session"
          />
          <QuickAction
            icon={Sparkles}
            label="Find matches"
            description="AI-powered matching"
          />
          <QuickAction
            icon={Users}
            label="Join squad"
            description="Find accountability"
          />
        </div>
      </SurfaceCard>

      {/* ─── Stats Row ─── */}
      <StatsRow />

      {/* ─── Main Content Grid ─── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left Column — Primary content (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <AIMatchesWidget />
          <div className="grid gap-4 sm:grid-cols-2">
            <HelpRequestsWidget />
            <StudyRoomsWidget />
          </div>
          <CommunitiesWidget />
        </div>

        {/* Right Column — Secondary content (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
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

/* ─── Helper ─── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
