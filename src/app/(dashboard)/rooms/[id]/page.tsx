import { RoomLayout } from "@/features/rooms";

/* ═══════════════════════════════════════════════════════════
   Dynamic Room Page
   ─────────────────────────────────────────────────────────
   Entry point for /rooms/[id]
   ═══════════════════════════════════════════════════════════ */

interface RoomPageProps {
  params: { id: string };
}

export default function RoomPage({ params }: RoomPageProps) {
  // In a real app, we would verify the room exists in the DB here
  // and check if the user has permission to join.

  return <RoomLayout roomId={params.id} />;
}
