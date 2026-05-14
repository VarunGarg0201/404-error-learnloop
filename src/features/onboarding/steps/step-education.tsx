"use client";

import { useOnboardingStore, STREAM_OPTIONS, YEAR_OPTIONS } from "@/features/onboarding/store";
import { InputField } from "@/components/shared/inputs";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Step 2: Education — School, Stream, Year
   ═══════════════════════════════════════════════════════════ */

export function StepEducation() {
  const { data, updateData } = useOnboardingStore();

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center space-y-1">
        <p className="text-2xl">🎓</p>
        <h2 className="text-lg font-semibold tracking-tight">
          Your education
        </h2>
        <p className="text-sm text-muted-foreground">
          Helps us connect you with peers from your campus.
        </p>
      </div>

      {/* School */}
      <InputField
        label="School / College / University"
        placeholder="e.g. IIT Delhi, VIT Vellore"
        value={data.school}
        onChange={(e) => updateData({ school: e.target.value })}
      />

      {/* Stream */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-foreground">
          Stream / Branch
        </label>
        <div className="flex flex-wrap gap-2">
          {STREAM_OPTIONS.map((stream) => (
            <button
              key={stream}
              type="button"
              onClick={() => updateData({ stream })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium",
                "border transition-all duration-150",
                data.stream === stream
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {stream}
            </button>
          ))}
        </div>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-foreground">
          Year
        </label>
        <div className="flex flex-wrap gap-2">
          {YEAR_OPTIONS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => updateData({ year })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium",
                "border transition-all duration-150",
                data.year === year
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
