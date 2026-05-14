"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRoomStore } from "@/features/rooms/store";
import type { RoomParticipant, ChatMessage, SharedRoomState } from "@/features/rooms/types";
import { RealtimeChannel } from "@supabase/supabase-js";

/* ═══════════════════════════════════════════════════════════
   Supabase Realtime Hook
   ─────────────────────────────────────────────────────────
   Connects the Zustand room store to a Supabase Channel.
   Handles presence, broadcasts (chat), and shared state sync.
   ═══════════════════════════════════════════════════════════ */

export function useRoomChannel(roomId: string, userProfile: Partial<RoomParticipant>) {
  const store = useRoomStore();
  const supabase = createClient();

  useEffect(() => {
    if (!roomId || !userProfile.id) return;

    store.setRoomId(roomId);
    
    // Initialize local participant with a random presence ID
    const presenceId = crypto.randomUUID();
    const localParticipant: RoomParticipant = {
      id: userProfile.id,
      presenceId,
      displayName: userProfile.displayName || "Unknown",
      username: userProfile.username || "unknown",
      avatarUrl: userProfile.avatarUrl || null,
      role: userProfile.role || "participant",
      isMuted: true,
      isVideoOff: true,
      isScreenSharing: false,
      isTyping: false,
      isSpeaking: false,
      raisedHand: false,
      currentReaction: null,
      joinedAt: new Date().toISOString(),
      ...userProfile, // Override with any passed in state
    };
    
    store.setLocalParticipant(localParticipant);

    // 1. Initialize Channel
    const channel: RealtimeChannel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: { key: presenceId },
        broadcast: { self: true, ack: false },
      },
    });

    // 2. Presence Handlers
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const participants: RoomParticipant[] = [];
        
        // Flatten Supabase presence state into our array format
        for (const id in state) {
          // Take the most recent presence object for this key
          const presenceObjs = state[id] as unknown as RoomParticipant[];
          if (presenceObjs.length > 0) {
            participants.push(presenceObjs[0]);
          }
        }
        
        store.syncParticipants(participants);
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        // Handled by sync, but could trigger sound/toast here
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        // Handled by sync
      });

    // 3. Broadcast Handlers (Chat, Reactions, Typing)
    channel
      .on("broadcast", { event: "chat_message" }, ({ payload }) => {
        store.addMessage(payload as ChatMessage);
      })
      .on("broadcast", { event: "reaction" }, ({ payload }) => {
        // Payload: { messageId, emoji, userId }
        store.addReaction(payload.messageId, payload.emoji, payload.userId);
      })
      .on("broadcast", { event: "room_state_update" }, ({ payload }) => {
        store.updateSharedState(payload as Partial<SharedRoomState>);
      });

    // 4. Subscribe
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        store.setConnectionStatus(true);
        // Track local user presence
        await channel.track(localParticipant);
      } else if (status === "CHANNEL_ERROR") {
        store.setConnectionStatus(false, "Failed to connect to room channel");
      } else if (status === "CLOSED") {
        store.setConnectionStatus(false);
      }
    });

    // Cleanup on unmount
    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
      store.reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userProfile.id]);

  // Actions wrapped to broadcast to the channel
  const broadcastMessage = useCallback(
    (message: Pick<ChatMessage, "content" | "type" | "fileUrl">) => {
      const { localParticipant } = store;
      if (!localParticipant) return;

      const fullMessage: ChatMessage = {
        id: crypto.randomUUID(),
        roomId,
        userId: localParticipant.id!,
        displayName: localParticipant.displayName!,
        avatarUrl: localParticipant.avatarUrl || null,
        reactions: {},
        createdAt: new Date().toISOString(),
        ...message,
      };

      // Optimistically add to store
      store.addMessage(fullMessage);

      // Broadcast
      supabase.channel(`room:${roomId}`).send({
        type: "broadcast",
        event: "chat_message",
        payload: fullMessage,
      });
    },
    [roomId, store, supabase]
  );

  const updatePresence = useCallback(
    async (updates: Partial<RoomParticipant>) => {
      const { localParticipant } = store;
      if (!localParticipant) return;

      const newParticipant = { ...localParticipant, ...updates };
      store.setLocalParticipant(newParticipant);

      const channel = supabase.channel(`room:${roomId}`);
      if (channel) {
        await channel.track(newParticipant);
      }
    },
    [roomId, store, supabase]
  );

  const broadcastStateUpdate = useCallback(
    (updates: Partial<SharedRoomState>) => {
      store.updateSharedState(updates);

      supabase.channel(`room:${roomId}`).send({
        type: "broadcast",
        event: "room_state_update",
        payload: updates,
      });
    },
    [roomId, store, supabase]
  );

  return {
    broadcastMessage,
    updatePresence,
    broadcastStateUpdate,
  };
}
