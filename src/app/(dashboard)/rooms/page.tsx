import { getLiveRooms } from "@/features/rooms/actions";
import { RoomsClient } from "./rooms-client";

export default async function RoomsPage() {
  const response = await getLiveRooms();
  const rooms = response.data || [];

  // Map DB rooms to the expected frontend interface
  const formattedRooms = rooms.map((room) => ({
    id: room.id,
    title: room.title,
    type: room.type,
    participants: room.currentParticipants,
    maxParticipants: room.maxParticipants,
    host: room.host.displayName,
    hostAvatar: room.host.avatarUrl || undefined,
    tags: room.tags,
    isLive: room.isActive,
    startedAgo: new Date(room.createdAt).toLocaleTimeString(),
    description: room.description || "",
  }));

  return <RoomsClient initialRooms={formattedRooms} />;
}
