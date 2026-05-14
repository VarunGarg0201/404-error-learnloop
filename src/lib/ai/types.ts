/* ═══════════════════════════════════════════════════════════
   AI Matching System — Types
   ─────────────────────────────────────────────────────────
   Core type definitions for the matching engine.
   ═══════════════════════════════════════════════════════════ */

/* ─── Matchable User Profile ─── */
export interface MatchableProfile {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  campus: string | null;
  stream: string | null;
  year: string | null;
  bio: string | null;

  // Skills
  skillsToTeach: string[];
  skillsToLearn: string[];

  // Preferences
  goals: string[];
  learningStyle: string;
  availability: string[];
  preferredLanguage: string;

  // DNA traits
  dnaTraits: DNATraitScore[];

  // Behavioral signals
  knowledgeCredits: number;
  trustScore: number;
  totalSessions: number;
  avgRating: number;
  streak: number;

  // Energy & status
  energyMode: EnergyMode;
  isOnline: boolean;
  lastActiveAt: string;
}

/* ─── DNA trait with score ─── */
export interface DNATraitScore {
  trait: string;
  score: number; // 0–1
  category: "teaching" | "learning" | "social";
}

/* ─── Energy Mode ─── */
export type EnergyMode =
  | "focused"      // deep work, prefers 1:1
  | "social"       // open to groups, chat
  | "chill"        // casual, browsing
  | "teaching"     // wants to teach right now
  | "learning"     // needs help right now
  | "offline";     // away

/* ─── Match Result ─── */
export interface MatchResult {
  user: MatchableProfile;
  score: MatchScore;
  explanation: MatchExplanation;
  reasons: MatchReason[];
}

/* ─── Composite Score ─── */
export interface MatchScore {
  overall: number;       // 0–100 final weighted score
  skills: number;        // 0–1
  goals: number;         // 0–1
  dna: number;           // 0–1
  availability: number;  // 0–1
  style: number;         // 0–1
  language: number;      // 0–1
  reputation: number;    // 0–1
  energy: number;        // 0–1
  behavior: number;      // 0–1
}

/* ─── Human-readable match reason ─── */
export interface MatchReason {
  factor: keyof Omit<MatchScore, "overall">;
  emoji: string;
  label: string;
  detail: string;
  strength: "strong" | "good" | "fair";
}

/* ─── Explanation for AI transparency ─── */
export interface MatchExplanation {
  summary: string;
  highlights: string[];
  complementary: string[];
  tips: string[];
}

/* ─── Scoring weights (tunable) ─── */
export interface MatchWeights {
  skills: number;
  goals: number;
  dna: number;
  availability: number;
  style: number;
  language: number;
  reputation: number;
  energy: number;
  behavior: number;
}

/* ─── Default weights ─── */
export const DEFAULT_WEIGHTS: MatchWeights = {
  skills:       0.25,
  goals:        0.15,
  dna:          0.12,
  availability: 0.12,
  style:        0.08,
  language:     0.08,
  reputation:   0.08,
  energy:       0.06,
  behavior:     0.06,
};

/* ─── Match filter/query ─── */
export interface MatchQuery {
  userId: string;
  limit?: number;
  minScore?: number;
  filters?: {
    campus?: string;
    stream?: string;
    skills?: string[];
    availability?: string[];
    energyMode?: EnergyMode;
    onlineOnly?: boolean;
  };
  weights?: Partial<MatchWeights>;
}
