"use client";

import {
  useOnboardingStore,
  GOAL_OPTIONS,
  LEARNING_STYLE_OPTIONS,
} from "@/features/onboarding/store";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Step 4: Goals & Learning Style
   ═══════════════════════════════════════════════════════════ */

export function StepGoals() {
  const { data, updateData } = useOnboardingStore();

  function toggleGoal(goal: string) {
    const goals = data.goals.includes(goal)
      ? data.goals.filter((g) => g !== goal)
      : [...data.goals, goal];
    updateData({ goals });
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center space-y-1">
        <p className="text-2xl">🚀</p>
        <h2 className="text-lg font-semibold tracking-tight">
          Your goals & style
        </h2>
        <p className="text-sm text-muted-foreground">
          This powers our AI matching to find your ideal study partners.
        </p>
      </div>

      {/* Goals */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-foreground">
          What are you looking to achieve? <span className="text-muted-foreground">(pick any)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <button
              key={goal.label}
              type="button"
              onClick={() => toggleGoal(goal.label)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left",
                "border transition-all duration-150",
                data.goals.includes(goal.label)
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <span className="text-base">{goal.emoji}</span>
              <span className="text-xs font-medium">{goal.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Style */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-foreground">
          How do you learn best?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LEARNING_STYLE_OPTIONS.map((style) => (
            <button
              key={style.label}
              type="button"
              onClick={() => updateData({ learningStyle: style.label })}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl text-center",
                "border transition-all duration-150",
                data.learningStyle === style.label
                  ? "bg-primary/10 border-primary/30"
                  : "bg-card border-border/50 hover:border-border"
              )}
            >
              <span className="text-xl">{style.emoji}</span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  data.learningStyle === style.label
                    ? "text-primary"
                    : "text-foreground"
                )}
              >
                {style.label}
              </span>
              <span className="text-[10px] text-muted-foreground leading-snug">
                {style.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
