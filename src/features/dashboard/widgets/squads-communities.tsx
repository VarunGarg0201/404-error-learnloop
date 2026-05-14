"use client";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import {
  Users,
  Flame,
  BookOpen,
  ArrowRight,
  Hash,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Squads Widget
   ═══════════════════════════════════════════════════════════ */

interface SquadItemProps {
  name: string;
  goal: string;
  members: number;
  streak: number;
  isActive: boolean;
}

function SquadItem({ name, goal, members, streak, isActive }: SquadItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
        "hover:bg-accent/40 transition-colors cursor-pointer group"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
          isActive ? "bg-success/10" : "bg-muted/50"
        )}
      >
        <Users className={cn("w-4 h-4", isActive ? "text-success" : "text-muted-foreground")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{goal}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Flame className="w-3 h-3 text-warning" />
          {streak}d
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Users className="w-3 h-3" />
          {members}
        </div>
      </div>
    </div>
  );
}

const DEMO_SQUADS: SquadItemProps[] = [
  {
    name: "DSA Warriors",
    goal: "Solve 3 problems daily",
    members: 5,
    streak: 12,
    isActive: true,
  },
  {
    name: "Web Dev Gang",
    goal: "Build 1 project/week",
    members: 4,
    streak: 7,
    isActive: true,
  },
];

export function SquadsWidget({ className }: { className?: string }) {
  const hasSquads = DEMO_SQUADS.length > 0;

  return (
    <Widget
      title="Your Squads"
      description="Accountability groups"
      icon={Users}
      noPadding
      action={hasSquads ? { label: "All squads", onClick: () => {} } : undefined}
      className={className}
    >
      {hasSquads ? (
        <div className="pb-2">
          {DEMO_SQUADS.map((squad, i) => (
            <SquadItem key={i} {...squad} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No squads joined"
          description="Join a learning squad to stay accountable."
          action={<Button size="sm" variant="secondary">Explore squads</Button>}
          className="pb-4"
        />
      )}
    </Widget>
  );
}

/* ═══════════════════════════════════════════════════════════
   Recommended Communities Widget
   ═══════════════════════════════════════════════════════════ */

interface CommunityItemProps {
  name: string;
  description: string;
  members: number;
  category: string;
}

function CommunityItem({ name, description, members, category }: CommunityItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg",
        "border border-border/30 bg-card/50",
        "hover:border-border/60 hover:bg-accent/30",
        "transition-all duration-150 cursor-pointer group"
      )}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/8 shrink-0">
        <Hash className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{description}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <StatusBadge variant="secondary" size="xs">{category}</StatusBadge>
        <span className="text-[10px] text-muted-foreground">{members} members</span>
      </div>
    </div>
  );
}

const DEMO_COMMUNITIES: CommunityItemProps[] = [
  {
    name: "React Devs India",
    description: "For React enthusiasts across India",
    members: 1240,
    category: "Tech",
  },
  {
    name: "Placement Prep 2025",
    description: "DSA, system design, and interview practice",
    members: 3400,
    category: "Career",
  },
  {
    name: "IIT Delhi CS Hub",
    description: "Campus community for CS students",
    members: 890,
    category: "Campus",
  },
];

export function CommunitiesWidget({ className }: { className?: string }) {
  return (
    <Widget
      title="Recommended"
      description="Communities you might like"
      icon={BookOpen}
      action={{ label: "Browse all", onClick: () => {} }}
      className={className}
    >
      <div className="space-y-2">
        {DEMO_COMMUNITIES.map((comm, i) => (
          <CommunityItem key={i} {...comm} />
        ))}
      </div>
    </Widget>
  );
}
