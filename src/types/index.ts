/* ─── Navigation ─── */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  isActive?: boolean;
}

/* ─── User ─── */
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  campus: string | null;
  stream: string | null;
  year: string | null;
  bio: string | null;
  knowledgeCredits: number;
  trustScore: number;
  isOnboarded: boolean;
  createdAt: string;
}

/* ─── Learning DNA ─── */
export interface LearningDNATrait {
  id: string;
  trait: string;
  confidence: number; // 0-1
  category: "teaching" | "learning" | "social";
  isVisible: boolean;
  isSelfAssessed: boolean;
}

/* ─── Rooms ─── */
export type RoomType =
  | "quick-help"
  | "study"
  | "revision"
  | "coding"
  | "build-together"
  | "workshop"
  | "whiteboard"
  | "hackathon";

export interface Room {
  id: string;
  title: string;
  description: string | null;
  type: RoomType;
  hostId: string;
  isActive: boolean;
  maxParticipants: number;
  currentParticipants: number;
  tags: string[];
  createdAt: string;
}

/* ─── Squads ─── */
export interface Squad {
  id: string;
  name: string;
  description: string | null;
  goal: string;
  memberCount: number;
  streak: number;
  isPublic: boolean;
}

/* ─── Knowledge Credits ─── */
export interface KnowledgeCreditEntry {
  id: string;
  amount: number;
  reason: string;
  category: "teaching" | "helping" | "collaboration" | "feedback" | "consistency";
  createdAt: string;
}

/* ─── Notifications ─── */
export type NotificationType =
  | "match-found"
  | "help-request"
  | "session-feedback"
  | "squad-checkin"
  | "room-starting"
  | "credit-earned"
  | "mention";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  href: string | null;
  createdAt: string;
}

/* ─── Feedback ─── */
export interface SessionFeedback {
  clarity: number;
  helpfulness: number;
  patience: number;
  accuracy: number;
  beginnerFriendliness: number;
  communicationQuality: number;
  conceptUnderstanding: number;
  overallSatisfaction: number;
  comment: string | null;
  isFlagged?: boolean; // Moderation flag
}

/* ─── Groups (Squads & Communities) ─── */
export type GroupType = "squad" | "community";

export interface SquadGoal {
  id: string;
  title: string;
  targetHours: number;
  currentHours: number;
  deadline: string; // ISO date
  isCompleted: boolean;
}

export interface GroupMember {
  id: string;
  userId: string;
  role: "admin" | "member";
  joinedAt: string; // ISO date
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export interface Group {
  id: string;
  type: GroupType;
  name: string;
  description: string;
  tags: string[];
  membersCount: number;
  isPrivate: boolean;
  createdAt: string; // ISO date
  // Specific to Squads
  squadGoals?: SquadGoal[];
  streakDays?: number;
  // Specific to Communities
  campus?: string;
  rules?: string[];
}

/* ─── API Response ─── */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}
