import { create } from "zustand";
import type {
  RoomParticipant,
  ChatMessage,
  SharedRoomState,
  TimerState,
} from "./types";

/* ═══════════════════════════════════════════════════════════
   Room Store
   ─────────────────────────────────────────────────────────
   Zustand store managing the local state of a live room.
   This state gets synchronized via Supabase Realtime channels.
   ═══════════════════════════════════════════════════════════ */

interface RoomStoreState {
  // Connection State
  isConnected: boolean;
  connectionError: string | null;

  // Local User State
  localParticipant: Partial<RoomParticipant> | null;
  
  // Room State
  roomId: string | null;
  participants: Map<string, RoomParticipant>; // Keyed by presenceId
  messages: ChatMessage[];
  sharedState: SharedRoomState | null;

  // Actions - Connection
  setConnectionStatus: (isConnected: boolean, error?: string | null) => void;
  setRoomId: (id: string) => void;
  setLocalParticipant: (participant: Partial<RoomParticipant>) => void;

  // Actions - Presence
  syncParticipants: (participants: RoomParticipant[]) => void;
  addParticipant: (participant: RoomParticipant) => void;
  removeParticipant: (presenceId: string) => void;
  updateParticipant: (presenceId: string, updates: Partial<RoomParticipant>) => void;

  // Actions - Chat
  addMessage: (message: ChatMessage) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;

  // Actions - Shared State
  updateSharedState: (updates: Partial<SharedRoomState>) => void;
  updateTimer: (updates: Partial<TimerState>) => void;
  updateNotes: (content: string, userId: string) => void;

  // Reset
  reset: () => void;
}

const DEFAULT_TIMER: TimerState = {
  isRunning: false,
  mode: "pomodoro",
  durationSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  lastStartedAt: null,
};

export const useRoomStore = create<RoomStoreState>((set) => ({
  isConnected: false,
  connectionError: null,
  localParticipant: null,
  roomId: null,
  participants: new Map(),
  messages: [],
  sharedState: null,

  setConnectionStatus: (isConnected, error = null) =>
    set({ isConnected, connectionError: error }),

  setRoomId: (id) => set({ roomId: id }),

  setLocalParticipant: (participant) =>
    set((state) => ({
      localParticipant: { ...state.localParticipant, ...participant },
    })),

  syncParticipants: (participantsList) =>
    set(() => {
      const newMap = new Map();
      participantsList.forEach((p) => newMap.set(p.presenceId, p));
      return { participants: newMap };
    }),

  addParticipant: (participant) =>
    set((state) => {
      const newMap = new Map(state.participants);
      newMap.set(participant.presenceId, participant);
      return { participants: newMap };
    }),

  removeParticipant: (presenceId) =>
    set((state) => {
      const newMap = new Map(state.participants);
      newMap.delete(presenceId);
      return { participants: newMap };
    }),

  updateParticipant: (presenceId, updates) =>
    set((state) => {
      const newMap = new Map(state.participants);
      const existing = newMap.get(presenceId);
      if (existing) {
        newMap.set(presenceId, { ...existing, ...updates });
      }
      return { participants: newMap };
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  addReaction: (messageId, emoji, userId) =>
    set((state) => {
      const newMessages = state.messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          const users = reactions[emoji] || [];
          if (!users.includes(userId)) {
            reactions[emoji] = [...users, userId];
          }
          return { ...msg, reactions };
        }
        return msg;
      });
      return { messages: newMessages };
    }),

  updateSharedState: (updates) =>
    set((state) => {
      if (!state.sharedState) return state;
      return { sharedState: { ...state.sharedState, ...updates } };
    }),

  updateTimer: (updates) =>
    set((state) => {
      if (!state.sharedState) return state;
      return {
        sharedState: {
          ...state.sharedState,
          timer: { ...state.sharedState.timer, ...updates },
        },
      };
    }),

  updateNotes: (content, userId) =>
    set((state) => {
      if (!state.sharedState) return state;
      return {
        sharedState: {
          ...state.sharedState,
          notes: {
            content,
            lastEditedBy: userId,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }),

  reset: () =>
    set({
      isConnected: false,
      connectionError: null,
      localParticipant: null,
      roomId: null,
      participants: new Map(),
      messages: [],
      sharedState: null,
    }),
}));
