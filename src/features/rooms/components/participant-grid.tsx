"use client";

import { cn } from "@/lib/utils";
import { useRoomStore } from "@/features/rooms/store";
import { UserAvatar } from "@/components/shared/user-avatar";
import { MicOff, VideoOff, Hand } from "lucide-react";
import type { RoomParticipant } from "@/features/rooms/types";

/* ═══════════════════════════════════════════════════════════
   Participant Grid
   ─────────────────────────────────────────────────────────
   Displays video placeholders/avatars for all present users.
   ═══════════════════════════════════════════════════════════ */

function ParticipantCard({ participant }: { participant: RoomParticipant }) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-2xl border bg-card/40 overflow-hidden",
        "aspect-video md:aspect-square lg:aspect-video",
        participant.isSpeaking ? "ring-2 ring-primary border-primary/50" : "border-border/30",
        "transition-all duration-300"
      )}
    >
      {/* Reaction Float */}
      {participant.currentReaction && (
        <div className="absolute top-4 right-4 text-3xl animate-bounce-short z-20">
          {participant.currentReaction}
        </div>
      )}

      {/* Hand Raise */}
      {participant.raisedHand && (
        <div className="absolute top-4 left-4 p-1.5 rounded-full bg-warning/20 text-warning z-20 animate-pulse">
          <Hand className="w-4 h-4" />
        </div>
      )}

      {/* Status Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />

      {/* Main Avatar / Video Placeholder */}
      <div className="relative z-20 mb-2">
        <UserAvatar
          name={participant.displayName}
          src={participant.avatarUrl}
          size="lg"
          className={cn(
            "w-20 h-20 text-2xl shadow-xl",
            participant.isSpeaking && "ring-4 ring-primary/30 animate-pulse-ring"
          )}
        />
        {participant.isMuted && (
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-destructive text-destructive-foreground">
            <MicOff className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Name Tag */}
      <div className="relative z-20 text-center">
        <p className="text-sm font-semibold truncate max-w-[150px]">
          {participant.displayName}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {participant.role}
        </p>
      </div>

      {/* Top Right Video Off Indicator */}
      {participant.isVideoOff && (
        <div className="absolute top-4 right-4 p-1.5 rounded-md bg-background/50 backdrop-blur-md z-20">
          <VideoOff className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export function ParticipantGrid() {
  const participantsMap = useRoomStore((state) => state.participants);
  const localParticipant = useRoomStore((state) => state.localParticipant);
  
  const participants = Array.from(participantsMap.values());
  
  // Make sure local participant is always visible even if presence hasn't synced
  const allParticipants = [...participants];
  if (localParticipant && !participants.find(p => p.presenceId === localParticipant.presenceId)) {
    allParticipants.push(localParticipant as RoomParticipant);
  }

  // Determine grid layout based on count
  const count = allParticipants.length;
  let gridClass = "grid-cols-1";
  if (count === 2) gridClass = "sm:grid-cols-2";
  else if (count >= 3 && count <= 4) gridClass = "sm:grid-cols-2";
  else if (count > 4) gridClass = "sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-4 w-full h-full content-center", gridClass)}>
      {allParticipants.map((p) => (
        <ParticipantCard key={p.presenceId} participant={p} />
      ))}
      
      {allParticipants.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-sm">Waiting for participants...</p>
        </div>
      )}
    </div>
  );
}
