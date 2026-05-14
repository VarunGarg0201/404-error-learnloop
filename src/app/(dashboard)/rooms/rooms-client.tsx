"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge, RoomTypeBadge } from "@/components/shared/badges";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  Radio,
  Clock,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormattedRoom {
  id: string;
  title: string;
  type: string;
  participants: number;
  maxParticipants: number;
  host: string;
  hostAvatar?: string;
  tags: string[];
  isLive: boolean;
  startedAgo?: string;
  description: string;
}

function RoomCard({ room }: { room: FormattedRoom }) {
  return (
    <SurfaceCard hover className="group cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <RoomTypeBadge type={room.type} />
          {room.isLive && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-success">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {room.startedAgo}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
        {room.title}
      </h3>
      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
        {room.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {room.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent/60 text-accent-foreground border border-border/30"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        <div className="flex items-center gap-2">
          <UserAvatar src={room.hostAvatar} name={room.host} size="xs" />
          <span className="text-[11px] text-muted-foreground">{room.host}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>
              {room.participants}/{room.maxParticipants}
            </span>
          </div>
          <Button
            size="xs"
            variant={room.isLive ? "default" : "secondary"}
            className="ml-1"
          >
            {room.isLive ? "Join" : "Notify"}
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}

export function RoomsClient({ initialRooms }: { initialRooms: FormattedRoom[] }) {
  const [filter, setFilter] = useState<"all" | "live">("all");
  const liveCount = initialRooms.filter((r) => r.isLive).length;
  const filtered =
    filter === "live" ? initialRooms.filter((r) => r.isLive) : initialRooms;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Rooms"
        description="Real-time collaboration spaces for learning together."
      >
        <Button size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Create room
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
          <MessageSquare className="w-3 h-3" />
          All rooms ({initialRooms.length})
        </button>
        <button
          onClick={() => setFilter("live")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            filter === "live"
              ? "bg-success/10 border-success/30 text-success"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <Radio className="w-3 h-3" />
          Live now ({liveCount})
        </button>
      </div>

      {/* Room Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No rooms found. Be the first to create one!
          </div>
        ) : (
          filtered.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        )}
      </div>
    </div>
  );
}
