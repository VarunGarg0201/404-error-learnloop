"use client";

import { cn } from "@/lib/utils";
import { RoomTypeBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Radio } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Study Rooms Widget — Active/trending study rooms
   ═══════════════════════════════════════════════════════════ */

interface RoomItemProps {
  title: string;
  type: string;
  participants: number;
  maxParticipants: number;
  host: string;
  isLive: boolean;
}

function RoomItem({
  title,
  type,
  participants,
  maxParticipants,
  host,
  isLive,
}: RoomItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
        "hover:bg-accent/40 transition-colors cursor-pointer group"
      )}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/8 shrink-0">
        <MessageSquare className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-medium truncate">{title}</p>
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-success">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <RoomTypeBadge type={type} />
          <span className="text-[10px] text-muted-foreground">
            by {host}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
        <Users className="w-3 h-3" />
        {participants}/{maxParticipants}
      </div>
    </div>
  );
}

const DEMO_ROOMS: RoomItemProps[] = [
  {
    title: "DSA Problem Solving",
    type: "study",
    participants: 4,
    maxParticipants: 8,
    host: "Ananya S.",
    isLive: true,
  },
  {
    title: "React Hooks Explained",
    type: "quick-help",
    participants: 2,
    maxParticipants: 5,
    host: "Rahul V.",
    isLive: true,
  },
  {
    title: "DBMS Revision Sprint",
    type: "revision",
    participants: 6,
    maxParticipants: 10,
    host: "Priya N.",
    isLive: false,
  },
];

export function StudyRoomsWidget({ className }: { className?: string }) {
  const hasRooms = DEMO_ROOMS.length > 0;

  return (
    <Widget
      title="Study Rooms"
      description="Live collaborative sessions"
      icon={MessageSquare}
      noPadding
      action={
        hasRooms
          ? { label: "Browse", onClick: () => {} }
          : undefined
      }
      className={className}
    >
      {hasRooms ? (
        <div className="pb-2">
          {DEMO_ROOMS.map((room, i) => (
            <RoomItem key={i} {...room} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No active rooms"
          description="Create a study room to collaborate in real time."
          action={<Button size="sm" variant="secondary">Create room</Button>}
          className="pb-4"
        />
      )}
    </Widget>
  );
}
