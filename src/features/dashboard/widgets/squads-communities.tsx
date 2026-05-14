import { useState, useEffect } from "react";
import { getUserGroups } from "@/features/groups/actions";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { buttonVariants } from "@/components/ui/button";
import {
  Users,
  Flame,
  BookOpen,
  Hash,
  Loader2,
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Squads Widget
   ═══════════════════════════════════════════════════════════ */

interface SquadItemProps {
  id: string;
  name: string;
  goal: string;
  members: number;
  streak: number;
  isActive: boolean;
}

function SquadItem({ id, name, goal, members, streak, isActive }: SquadItemProps) {
  return (
    <Link href={`/squads/${id}`}>
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
    </Link>
  );
}

export function SquadsWidget({ className }: { className?: string }) {
  const [squads, setSquads] = useState<SquadItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSquads() {
      const { data } = await getUserGroups("squad");
      if (data) {
        setSquads(
          data.slice(0, 3).map((s: any) => ({
            id: s.id,
            name: s.name,
            goal: s.squadGoals?.[0]?.title || s.description || "No active goal",
            members: s.membersCount,
            streak: s.streakDays || 0,
            isActive: true, // Mocking active state for now
          }))
        );
      }
      setIsLoading(false);
    }
    fetchSquads();
  }, []);

  const hasSquads = squads.length > 0;

  return (
    <Widget
      title="Your Squads"
      description="Accountability groups"
      icon={Users}
      noPadding
      action={hasSquads ? { label: "All squads", href: "/squads" } : undefined}
      className={className}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : hasSquads ? (
        <div className="pb-2">
          {squads.map((squad) => (
            <SquadItem key={squad.id} {...squad} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No squads joined"
          description="Join a learning squad to stay accountable."
          action={<Link href="/squads" className={buttonVariants({ size: "sm", variant: "secondary" })}>Explore squads</Link>}
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
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
}

function CommunityItem({ id, name, description, members, category }: CommunityItemProps) {
  return (
    <Link href={`/communities/${id}`}>
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
    </Link>
  );
}

export function CommunitiesWidget({ className }: { className?: string }) {
  const [communities, setCommunities] = useState<CommunityItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunities() {
      // Fetch communities where the user is NOT necessarily a member, but for now we fetch user's communities or fetch all.
      // Modifying to just fetch any communities for display purposes
      const { data } = await getUserGroups("community");
      if (data) {
        setCommunities(
          data.slice(0, 3).map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            members: c.membersCount,
            category: c.tags?.[0] || "General",
          }))
        );
      }
      setIsLoading(false);
    }
    fetchCommunities();
  }, []);

  return (
    <Widget
      title="Recommended"
      description="Communities you might like"
      icon={BookOpen}
      action={{ label: "Browse all", href: "/communities" }}
      className={className}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : communities.length > 0 ? (
        <div className="space-y-2">
          {communities.map((comm) => (
            <CommunityItem key={comm.id} {...comm} />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-muted-foreground">
          No communities joined yet.
        </div>
      )}
    </Widget>
  );
}
