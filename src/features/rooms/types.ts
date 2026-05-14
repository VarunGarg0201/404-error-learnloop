/* ═══════════════════════════════════════════════════════════
   Realtime Room Types
   ─────────────────────────────────────────────────────────
   State structures for live collaborative study rooms.
   ═══════════════════════════════════════════════════════════ */

export type ParticipantRole = "host" | "co-host" | "participant";
export type RoomStatus = "waiting" | "active" | "break" | "ended";

/* ─── Room Participant (Presence State) ─── */
export interface RoomParticipant {
  id: string; // User ID
  presenceId: string; // Unique connection ID
  displayName: string;
  username: string;
  avatarUrl: string | null;
  role: ParticipantRole;
  
  // Media states
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  
  // Interaction states
  isTyping: boolean;
  isSpeaking: boolean;
  raisedHand: boolean;
  currentReaction: string | null; // e.g., "🔥", "👍" (ephemeral)
  
  joinedAt: string;
}

/* ─── Chat Message (Broadcast State) ─── */
export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  content: string;
  type: "text" | "system" | "file";
  fileUrl?: string;
  reactions: Record<string, string[]>; // { "👍": ["user_1", "user_2"] }
  createdAt: string;
}

/* ─── Collaborative Note ─── */
export interface NoteDelta {
  content: string;
  lastEditedBy: string;
  updatedAt: string;
}

/* ─── Timer State ─── */
export interface TimerState {
  isRunning: boolean;
  mode: "pomodoro" | "short_break" | "long_break";
  durationSeconds: number; // e.g., 25 * 60
  remainingSeconds: number;
  lastStartedAt: string | null; // For syncing client clocks
}

/* ─── Global Room State (Shared State) ─── */
export interface SharedRoomState {
  roomId: string;
  status: RoomStatus;
  currentGoal: string | null;
  timer: TimerState;
  notes: NoteDelta;
}
