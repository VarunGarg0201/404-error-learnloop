"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/badges";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { CreateGroupModal } from "@/features/groups";
import {
  BookOpen,
  Users,
  Hash,
  MapPin,
  TrendingUp,
  Plus,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Communities Page — Campus hubs, study groups, skill-based communities
   ═══════════════════════════════════════════════════════════ */

interface DemoCommunity {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  campus?: string;
  postsToday: number;
  isJoined: boolean;
  trending: boolean;
  icon: string;
}

const DEMO_COMMUNITIES: DemoCommunity[] = [
  {
    id: "c1",
    name: "React Devs India",
    description:
      "For React enthusiasts across India. Share projects, ask questions, and learn together.",
    members: 1240,
    category: "Tech",
    postsToday: 12,
    isJoined: true,
    trending: true,
    icon: "⚛️",
  },
  {
    id: "c2",
    name: "Placement Prep 2026",
    description:
      "DSA, system design, and interview practice. Daily challenges and mock interviews.",
    members: 3400,
    category: "Career",
    postsToday: 28,
    isJoined: true,
    trending: true,
    icon: "🎯",
  },
  {
    id: "c3",
    name: "IIT Delhi CS Hub",
    description:
      "Campus community for CS students. Course discussions, events, and resources.",
    members: 890,
    category: "Campus",
    campus: "IIT Delhi",
    postsToday: 8,
    isJoined: true,
    trending: false,
    icon: "🏛️",
  },
  {
    id: "c4",
    name: "ML & AI Enthusiasts",
    description:
      "Machine learning, deep learning, and AI research discussions. Paper reading club every Sunday.",
    members: 2100,
    category: "Tech",
    postsToday: 15,
    isJoined: false,
    trending: true,
    icon: "🧠",
  },
  {
    id: "c5",
    name: "Open Source Contributors",
    description:
      "Find projects, share contributions, get reviews. Monthly contributor spotlight.",
    members: 780,
    category: "Tech",
    postsToday: 5,
    isJoined: false,
    trending: false,
    icon: "🌐",
  },
  {
    id: "c6",
    name: "Design × Code",
    description:
      "Where design meets development. UI/UX discussions, Figma tips, and CSS tricks.",
    members: 650,
    category: "Creative",
    postsToday: 7,
    isJoined: false,
    trending: false,
    icon: "🎨",
  },
];

function CommunityCard({ community }: { community: DemoCommunity }) {
  return (
    <SurfaceCard hover className="group cursor-pointer flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/8 text-lg shrink-0">
            {community.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {community.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge variant="secondary" size="xs">
                {community.category}
              </StatusBadge>
              {community.trending && (
                <span className="flex items-center gap-0.5 text-[10px] font-medium text-warning">
                  <TrendingUp className="w-2.5 h-2.5" />
                  Trending
                </span>
              )}
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
          {community.members.toLocaleString()} members
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {community.postsToday} today
        </span>
        {community.campus && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {community.campus}
          </span>
        )}
      </div>

      {/* Action */}
      <div className="pt-3 border-t border-border/30">
        <Button
          size="xs"
          variant={community.isJoined ? "secondary" : "default"}
          className="w-full"
        >
          {community.isJoined ? "Open" : "Join community"}
        </Button>
      </div>
    </SurfaceCard>
  );
}

export default function CommunitiesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "joined" | "discover">("all");

  const filtered =
    filter === "joined"
      ? DEMO_COMMUNITIES.filter((c) => c.isJoined)
      : filter === "discover"
      ? DEMO_COMMUNITIES.filter((c) => !c.isJoined)
      : DEMO_COMMUNITIES;

  const joinedCount = DEMO_COMMUNITIES.filter((c) => c.isJoined).length;

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
          All ({DEMO_COMMUNITIES.length})
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        defaultType="community"
      />
    </div>
  );
}
