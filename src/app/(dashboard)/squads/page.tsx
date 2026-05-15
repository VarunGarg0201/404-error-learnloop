"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/badges";
import { UserAvatar } from "@/components/shared/user-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgressWidget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import { CreateGroupModal } from "@/features/groups";
import { getAllGroups } from "@/features/groups/actions";
import {
  Users,
  Flame,
  Target,
  Trophy,
  Plus,
  CheckCircle2,
  Clock,
  Loader2,
  Copy,
  Check,
  Link as LinkIcon,
  Lock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Squads Page — Accountability-based learning groups
   ═══════════════════════════════════════════════════════════ */

interface SquadData {
  id: string;
  name: string;
  description: string;
  goal: string;
  members: { name: string; avatarUrl?: string }[];
  membersCount: number;
  streak: number;
  isPrivate: boolean;
  isJoined: boolean;
  tags: string[];
}

function SquadCard({ squad }: { squad: SquadData }) {
  const [copied, setCopied] = useState(false);
  const shareLink = typeof window !== "undefined"
    ? `${window.location.origin}/squads/${squad.id}`
    : `/squads/${squad.id}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={`/squads/${squad.id}`}>
      <SurfaceCard hover className="group cursor-pointer h-full">
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
              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {squad.description}
              </p>
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/30 mb-3">
          <Target className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-[11px] font-medium truncate">{squad.goal}</span>
        </div>

        {/* Tags */}
        {squad.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {squad.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent/60 text-accent-foreground border border-border/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Streak & Members */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-warning">
              <Flame className="w-3.5 h-3.5" />
              {squad.streak}d streak
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              {squad.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {squad.isPrivate ? "Private" : "Public"}
            </span>
          </div>
          <StatusBadge variant={squad.isJoined ? "success" : "default"} size="xs" dot>
            {squad.isJoined ? "Joined" : `${squad.membersCount} members`}
          </StatusBadge>
        </div>

        {/* Member Avatars & Share */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center -space-x-2">
            {squad.members.slice(0, 5).map((member, i) => (
              <div key={i} className="relative">
                <UserAvatar name={member.name} src={member.avatarUrl} size="xs" />
              </div>
            ))}
            {squad.membersCount > 5 && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted border-2 border-card text-[9px] font-bold text-muted-foreground">
                +{squad.membersCount - 5}
              </div>
            )}
          </div>
          <Button
            size="xs"
            variant="secondary"
            className="gap-1"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Share"}
          </Button>
        </div>
      </SurfaceCard>
    </Link>
  );
}

export default function SquadsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [squads, setSquads] = useState<SquadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "joined">("all");

  async function fetchSquads() {
    const { data } = await getAllGroups("squad");
    if (data) {
      setSquads(
        data.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          goal: s.squadGoals?.[0]?.title || "No active goal set",
          members: s.members.map((m: any) => ({
            name: m.user.displayName,
            avatarUrl: m.user.avatarUrl,
          })),
          membersCount: s.membersCount,
          streak: s.streakDays || 0,
          isPrivate: s.isPrivate,
          isJoined: s.isJoined,
          tags: s.tags || [],
        }))
      );
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchSquads();
  }, []);

  const filtered = filter === "joined" ? squads.filter((s) => s.isJoined) : squads;
  const joinedCount = squads.filter((s) => s.isJoined).length;
  const bestStreak = squads.length > 0 ? Math.max(...squads.map((s) => s.streak)) : 0;

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

      {/* Stats & Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            filter === "all"
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <Users className="w-3 h-3" />
          All squads ({squads.length})
        </button>
        <button
          onClick={() => setFilter("joined")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            filter === "joined"
              ? "bg-success/10 border-success/30 text-success"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <CheckCircle2 className="w-3 h-3" />
          My squads ({joinedCount})
        </button>
        {bestStreak > 0 && (
          <span className="flex items-center gap-1 text-[12px] text-muted-foreground ml-auto">
            <Flame className="w-3.5 h-3.5 text-warning" />
            Best streak:{" "}
            <strong className="text-foreground">{bestStreak} days</strong>
          </span>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((squad) => (
            <SquadCard key={squad.id} squad={squad} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={filter === "joined" ? "You haven't joined any squads yet" : "No squads yet"}
          description={filter === "joined"
            ? "Create a squad or join one to start building accountability."
            : "Be the first to create a learning squad!"}
          action={
            <Button size="sm" className="gap-1.5" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Create squad
            </Button>
          }
        />
      )}

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        defaultType="squad"
        onCreated={fetchSquads}
      />
    </div>
  );
}
