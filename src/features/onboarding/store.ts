import { create } from "zustand";

/* ═══════════════════════════════════════════════════════════
   Onboarding Data & Store
   ─────────────────────────────────────────────────────────
   Multi-step form state with autosave support.
   ═══════════════════════════════════════════════════════════ */

export interface OnboardingData {
  // Step 1: Identity
  displayName: string;
  username: string;
  avatarUrl: string | null;

  // Step 2: Education
  school: string;
  stream: string;
  year: string;

  // Step 3: Skills
  skillsToTeach: string[];
  skillsToLearn: string[];

  // Step 4: Goals & Style
  goals: string[];
  learningStyle: string;

  // Step 5: Availability & Language
  availability: string[];
  preferredLanguage: string;
}

export const INITIAL_DATA: OnboardingData = {
  displayName: "",
  username: "",
  avatarUrl: null,
  school: "",
  stream: "",
  year: "",
  skillsToTeach: [],
  skillsToLearn: [],
  goals: [],
  learningStyle: "",
  availability: [],
  preferredLanguage: "",
};

export const TOTAL_STEPS = 5;

interface OnboardingState {
  step: number;
  data: OnboardingData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  step: 1,
  data: { ...INITIAL_DATA },
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  updateData: (partial) =>
    set((s) => ({ data: { ...s.data, ...partial } })),
  reset: () => set({ step: 1, data: { ...INITIAL_DATA } }),
}));

/* ─── Preset Options ─── */

export const STREAM_OPTIONS = [
  "Computer Science",
  "Information Technology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics",
  "Data Science",
  "AI / Machine Learning",
  "Business / MBA",
  "Design",
  "Commerce",
  "Arts / Humanities",
  "Medicine",
  "Law",
  "Other",
];

export const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
  "Postgrad",
  "Alumni",
];

export const SKILL_SUGGESTIONS = [
  "JavaScript", "Python", "React", "Next.js", "TypeScript",
  "Java", "C++", "Data Structures", "Algorithms", "Machine Learning",
  "Deep Learning", "Web Development", "Mobile Development", "Flutter",
  "React Native", "SQL", "MongoDB", "Node.js", "System Design",
  "DevOps", "Docker", "Git", "AWS", "Firebase",
  "UI/UX Design", "Figma", "Mathematics", "Statistics",
  "Linear Algebra", "Calculus", "Physics", "Chemistry",
  "English", "Communication", "Public Speaking",
  "Resume Writing", "Interview Prep", "Competitive Programming",
];

export const GOAL_OPTIONS = [
  { emoji: "🧠", label: "Master a new skill" },
  { emoji: "🤝", label: "Help others learn" },
  { emoji: "📈", label: "Improve my grades" },
  { emoji: "💼", label: "Prepare for placements" },
  { emoji: "🏗️", label: "Build projects together" },
  { emoji: "🏆", label: "Win hackathons" },
  { emoji: "📚", label: "Stay consistent with studies" },
  { emoji: "🌍", label: "Grow my network" },
];

export const LEARNING_STYLE_OPTIONS = [
  { emoji: "👀", label: "Visual", description: "Diagrams, videos, visual aids" },
  { emoji: "🎧", label: "Auditory", description: "Discussions, podcasts, explanations" },
  { emoji: "✍️", label: "Reading/Writing", description: "Notes, articles, documentation" },
  { emoji: "🛠️", label: "Hands-on", description: "Projects, coding, experiments" },
];

export const AVAILABILITY_OPTIONS = [
  { label: "Morning", time: "6am - 12pm", emoji: "🌅" },
  { label: "Afternoon", time: "12pm - 5pm", emoji: "☀️" },
  { label: "Evening", time: "5pm - 9pm", emoji: "🌆" },
  { label: "Night", time: "9pm - 12am", emoji: "🌙" },
  { label: "Late Night", time: "12am - 3am", emoji: "🦉" },
  { label: "Weekends", time: "Flexible", emoji: "📅" },
];

export const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Other",
];
