"use client";

import {
  useOnboardingStore,
  AVAILABILITY_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/features/onboarding/store";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Step 5: Availability & Language
   ═══════════════════════════════════════════════════════════ */

export function StepAvailability() {
  const { data, updateData } = useOnboardingStore();

  function toggleAvailability(slot: string) {
    const availability = data.availability.includes(slot)
      ? data.availability.filter((a) => a !== slot)
      : [...data.availability, slot];
    updateData({ availability });
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center space-y-1">
        <p className="text-2xl">🕐</p>
        <h2 className="text-lg font-semibold tracking-tight">
          Almost done!
        </h2>
        <p className="text-sm text-muted-foreground">
          When are you free to study? And what language works best?
        </p>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-foreground">
          When are you usually available? <span className="text-muted-foreground">(pick all that apply)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AVAILABILITY_OPTIONS.map((slot) => (
            <button
              key={slot.label}
              type="button"
              onClick={() => toggleAvailability(slot.label)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-center",
                "border transition-all duration-150",
                data.availability.includes(slot.label)
                  ? "bg-primary/10 border-primary/30"
                  : "bg-card border-border/50 hover:border-border"
              )}
            >
              <span className="text-lg">{slot.emoji}</span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  data.availability.includes(slot.label)
                    ? "text-primary"
                    : "text-foreground"
                )}
              >
                {slot.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {slot.time}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-foreground">
          Preferred language
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => updateData({ preferredLanguage: lang })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium",
                "border transition-all duration-150",
                data.preferredLanguage === lang
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
