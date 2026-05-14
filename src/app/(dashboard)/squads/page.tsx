"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/badges";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ProgressWidget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import { CreateGroupModal } from "@/features/groups";
import {
  Users,
  Flame,
  Target,
  Trophy,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Squads Page — Accountability-based learning groups
   ═══════════════════════════════════════════════════════════ */

interface SquadMember {
  name: string;
  avatar?: string;
  checkedInToday: boolean;
}

interface DemoSquad {
  id: string;
  name: string;
  description: string;
  goal: string;
  members: SquadMember[];
  streak: number;
  maxStreak: number;
  progress: number;
  isActive: boolean;
  checkInsToday: number;
  totalMembers: number;
  createdAgo: string;
}

const DEMO_SQUADS: DemoSquad[] = [
  {
    id: "s1",
    name: "DSA Warriors",
    description: "Daily DSA problem-solving accountability group",
    goal: "Solve 3 problems daily",
    members: [
      { name: "You", checkedInToday: true },
      { name: "Ananya S.", checkedInToday: true },
      { name: "Rahul V.", checkedInToday: true },
      { name: "Arjun M.", checkedInToday: false },
      { name: "Priya N.", checkedInToday: true },
    ],
    streak: 12,
    maxStreak: 18,
    progress: 80,
    isActive: true,
    checkInsToday: 4,
    totalMembers: 5,
    createdAgo: "3 weeks ago",
  },
  {
    id: "s2",
    name: "Web Dev Gang",
    description: "Building projects and learning web technologies together",
    goal: "Build 1 project/week",
    members: [
      { name: "You", checkedInToday: true },
      { name: "Sneha P.", checkedInToday: false },
      { name: "Vikram S.", checkedInToday: true },
      { name: "Karthik R.", checkedInToday: true },
    ],
    streak: 7,
    maxStreak: 14,
    progress: 60,
    isActive: true,
    checkInsToday: 3,
    totalMembers: 4,
    createdAgo: "2 weeks ago",
  },
  {
    id: "s3",
    name: "Placement Crushers",
    description: "Interview prep with daily mock sessions and peer review",
    goal: "2 mock interviews/week",
    members: [
      { name: "You", checkedInToday: false },
      { name: "Ananya S.", checkedInToday: true },
      { name: "Priya N.", checkedInToday: true },
      { name: "Rahul V.", checkedInToday: false },
      { name: "Sneha P.", checkedInToday: true },
      { name: "Vikram S.", checkedInToday: false },
    ],
    streak: 5,
    maxStreak: 10,
    progress: 40,
    isActive: true,
    checkInsToday: 3,
    totalMembers: 6,
    createdAgo: "1 month ago",
  },
  {
    id: "s4",
    name: "ML Study Circle",
    description: "Weekly paper reading and ML project discussions",
    goal: "Read 1 paper/week",
    members: [
      { name: "Ananya S.", checkedInToday: true },
      { name: "Sneha P.", checkedInToday: true },
      { name: "Rahul V.", checkedInToday: true },
    ],
    streak: 21,
    maxStreak: 21,
    progress: 95,
    isActive: true,
    checkInsToday: 3,
    totalMembers: 3,
    createdAgo: "1 month ago",
  },
];

function SquadCard({ squad }: { squad: DemoSquad }) {
  const checkedIn = squad.members.filter((m) => m.checkedInToday).length;

  return (
    <SurfaceCard hover className="group cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
              squad.streak >= 14
                ? "bg-warning/15"
                : squad.streak >= 7
                ? "bg-success/10"
                : "bg-primary/10"
            )}
          >
            {squad.streak >= 14 ? (
              <Trophy className="w-5 h-5 text-warning" />
            ) : (
              <Users className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
              {squad.name}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {squad.description}
            </p>
          </div>
        </div>
      </div>

      {/* Goal */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/30 mb-3">
        <Target className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-[11px] font-medium">{squad.goal}</span>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <ProgressWidget
          label="Weekly progress"
          value={squad.progress}
          color={squad.progress >= 80 ? "success" : squad.progress >= 50 ? "primary" : "warning"}
        />
      </div>

      {/* Streak & Members */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 font-semibold text-warning">
            <Flame className="w-3.5 h-3.5" />
            {squad.streak}d streak
          </span>
          <span className="text-muted-foreground">
            Best: {squad.maxStreak}d
          </span>
        </div>
        <StatusBadge
          variant={checkedIn === squad.totalMembers ? "success" : "default"}
          size="xs"
          dot
        >
          {checkedIn}/{squad.totalMembers} checked in
        </StatusBadge>
      </div>

      {/* Member Avatars */}
      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        <div className="flex items-center -space-x-2">
          {squad.members.slice(0, 5).map((member) => (
            <div key={member.name} className="relative">
              <UserAvatar name={member.name} size="xs" />
              {member.checkedInToday && (
                <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-success bg-card rounded-full" />
              )}
            </div>
          ))}
          {squad.totalMembers > 5 && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted border-2 border-card text-[9px] font-bold text-muted-foreground">
              +{squad.totalMembers - 5}
            </div>
          )}
        </div>
        <Button size="xs" variant="secondary" className="gap-1">
          <Clock className="w-3 h-3" />
          Check in
        </Button>
      </div>
    </SurfaceCard>
  );
}

export default function SquadsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Squads"
        description="Accountability-based groups to keep you on track."
      >
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          Create squad
        </Button>
      </PageHeader>

      {/* Stats summary */}
      <div className="flex items-center gap-4 text-[12px]">
        <StatusBadge variant="primary" size="sm" dot>
          {DEMO_SQUADS.length} active squads
        </StatusBadge>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Flame className="w-3.5 h-3.5 text-warning" />
          Best streak:{" "}
          <strong className="text-foreground">
            {Math.max(...DEMO_SQUADS.map((s) => s.streak))} days
          </strong>
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {DEMO_SQUADS.map((squad) => (
          <SquadCard key={squad.id} squad={squad} />
        ))}
      </div>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        defaultType="squad"
      />
    </div>
  );
}
