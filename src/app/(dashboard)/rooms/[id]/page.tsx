import { RoomLayout } from "@/features/rooms";
import { joinRoom } from "@/features/rooms/actions";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageSquare } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Dynamic Room Page
   ─────────────────────────────────────────────────────────
   Entry point for /rooms/[id]
   ═══════════════════════════════════════════════════════════ */

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  
  // Attempt to join the room on page load
  const res = await joinRoom(id);

  if (!res.success) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={MessageSquare}
          title="Cannot Join Room"
          description={res.error || "The room may be full, inactive, or not exist."}
          action={
            <Link href="/rooms" className={buttonVariants()}>
              Back to Rooms
            </Link>
          }
        />
      </div>
    );
  }

  return <RoomLayout roomId={id} />;
}
