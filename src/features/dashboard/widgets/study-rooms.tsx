import { useState, useEffect } from "react";
import { getLiveRooms } from "@/features/rooms/actions";
import { cn } from "@/lib/utils";
import { RoomTypeBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { buttonVariants } from "@/components/ui/button";
import { MessageSquare, Users, Radio, Loader2 } from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Study Rooms Widget — Active/trending study rooms
   ═══════════════════════════════════════════════════════════ */

interface RoomItemProps {
  id: string;
  title: string;
  type: string;
  participants: number;
  maxParticipants: number;
  host: string;
  isLive: boolean;
}

function RoomItem({
  id,
  title,
  type,
  participants,
  maxParticipants,
  host,
  isLive,
}: RoomItemProps) {
  return (
    <Link href={`/rooms/${id}`}>
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
    </Link>
  );
}

export function StudyRoomsWidget({ className }: { className?: string }) {
  const [rooms, setRooms] = useState<RoomItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      const { data } = await getLiveRooms();
      if (data) {
        setRooms(
          data.slice(0, 4).map((r: any) => ({
            id: r.id,
            title: r.title,
            type: r.type,
            participants: r.currentParticipants,
            maxParticipants: r.maxParticipants,
            host: r.host.displayName,
            isLive: r.isActive,
          }))
        );
      }
      setIsLoading(false);
    }
    fetchRooms();
  }, []);

  const hasRooms = rooms.length > 0;

  return (
    <Widget
      title="Study Rooms"
      description="Live collaborative sessions"
      icon={MessageSquare}
      noPadding
      action={
        hasRooms
          ? { label: "Browse", href: "/rooms" }
          : undefined
      }
      className={className}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : hasRooms ? (
        <div className="pb-2">
          {rooms.map((room) => (
            <RoomItem key={room.id} {...room} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No active rooms"
          description="Create a study room to collaborate in real time."
          action={<Link href="/rooms" className={buttonVariants({ size: "sm", variant: "secondary" })}>Create room</Link>}
          className="pb-4"
        />
      )}
    </Widget>
  );
}
