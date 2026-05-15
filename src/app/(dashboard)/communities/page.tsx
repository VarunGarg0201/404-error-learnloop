"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/badges";
import { UserAvatar } from "@/components/shared/user-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { CreateGroupModal } from "@/features/groups";
import { getAllGroups, joinGroup } from "@/features/groups/actions";
import {
  BookOpen,
  Users,
  Hash,
  MapPin,
  TrendingUp,
  Plus,
  MessageSquare,
  Loader2,
  Lock,
  Globe,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Communities Page — Campus hubs, study groups, skill-based communities
   ═══════════════════════════════════════════════════════════ */

interface CommunityData {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  tags: string[];
  campus?: string;
  isPrivate: boolean;
  isJoined: boolean;
  members: { name: string; avatarUrl?: string }[];
}

function CommunityCard({ community, onJoined }: { community: CommunityData; onJoined: () => void }) {
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareLink = typeof window !== "undefined"
    ? `${window.location.origin}/communities/${community.id}`
    : `/communities/${community.id}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleJoin(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (community.isJoined) {
      router.push(`/communities/${community.id}`);
      return;
    }
    setJoining(true);
    const res = await joinGroup(community.id);
    setJoining(false);
    if (res.success) {
      onJoined();
    }
  }

  return (
    <SurfaceCard hover className="group cursor-pointer flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/8 text-lg shrink-0">
            <Hash className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {community.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {community.tags[0] && (
                <StatusBadge variant="secondary" size="xs">
                  {community.tags[0]}
                </StatusBadge>
              )}
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                {community.isPrivate ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                {community.isPrivate ? "Private" : "Public"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed flex-1">
        {community.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {community.membersCount} members
        </span>
        {community.campus && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {community.campus}
          </span>
        )}
      </div>

      {/* Member Avatars */}
      {community.members.length > 0 && (
        <div className="flex items-center -space-x-2 mb-3">
          {community.members.slice(0, 5).map((member, i) => (
            <UserAvatar key={i} name={member.name} src={member.avatarUrl} size="xs" />
          ))}
          {community.membersCount > 5 && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted border-2 border-card text-[9px] font-bold text-muted-foreground">
              +{community.membersCount - 5}
            </div>
          )}
        </div>
      )}

      {/* Action */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/30">
        <Button
          size="xs"
          variant={community.isJoined ? "secondary" : "default"}
          className="flex-1"
          disabled={joining}
          onClick={handleJoin}
        >
          {joining ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : community.isJoined ? (
            "Open"
          ) : (
            "Join community"
          )}
        </Button>
        <Button size="xs" variant="ghost" className="gap-1 shrink-0" onClick={handleCopy}>
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </Button>
      </div>
    </SurfaceCard>
  );
}

export default function CommunitiesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [communities, setCommunities] = useState<CommunityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "joined" | "discover">("all");

  async function fetchCommunities() {
    const { data } = await getAllGroups("community");
    if (data) {
      setCommunities(
        data.map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          membersCount: c.membersCount,
          tags: c.tags || [],
          campus: c.campus,
          isPrivate: c.isPrivate,
          isJoined: c.isJoined,
          members: c.members.map((m: any) => ({
            name: m.user.displayName,
            avatarUrl: m.user.avatarUrl,
          })),
        }))
      );
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchCommunities();
  }, []);

  const filtered =
    filter === "joined"
      ? communities.filter((c) => c.isJoined)
      : filter === "discover"
      ? communities.filter((c) => !c.isJoined)
      : communities;

  const joinedCount = communities.filter((c) => c.isJoined).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communities"
        description="Campus hubs, study groups, and skill-based communities."
      >
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          Create community
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            filter === "all"
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <Hash className="w-3 h-3" />
          All ({communities.length})
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
          <BookOpen className="w-3 h-3" />
          Joined ({joinedCount})
        </button>
        <button
          onClick={() => setFilter("discover")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            filter === "discover"
              ? "bg-info/10 border-info/30 text-info"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <TrendingUp className="w-3 h-3" />
          Discover
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoined={fetchCommunities}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={
            filter === "joined"
              ? "You haven't joined any communities"
              : filter === "discover"
              ? "No new communities to discover"
              : "No communities yet"
          }
          description="Create a community to get started!"
          action={
            <Button size="sm" className="gap-1.5" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Create community
            </Button>
          }
        />
      )}

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        defaultType="community"
        onCreated={fetchCommunities}
      />
    </div>
  );
}
