"use client";

import { useState } from "react";
import { useOnboardingStore, SKILL_SUGGESTIONS } from "@/features/onboarding/store";
import { SearchInput } from "@/components/shared/inputs";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Step 3: Skills — Teach & Learn
   ═══════════════════════════════════════════════════════════ */

function SkillPicker({
  label,
  description,
  emoji,
  selected,
  onToggle,
}: {
  label: string;
  description: string;
  emoji: string;
  selected: string[];
  onToggle: (skill: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = SKILL_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(s)
  );

  function handleCustomSkill() {
    const trimmed = search.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onToggle(trimmed);
      setSearch("");
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">
          {emoji} {label}
        </p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>

      {/* Selected pills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {skill}
              <button
                type="button"
                onClick={() => onToggle(skill)}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search or type a custom skill..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleCustomSkill();
          }
        }}
      />

      {/* Suggestions */}
      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
        {search && !SKILL_SUGGESTIONS.some((s) => s.toLowerCase() === search.toLowerCase()) && (
          <button
            type="button"
            onClick={handleCustomSkill}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium",
              "border border-dashed border-primary/30 text-primary",
              "hover:bg-primary/10 transition-colors"
            )}
          >
            <Plus className="w-3 h-3" />
            Add &quot;{search}&quot;
          </button>
        )}
        {filtered.slice(0, 15).map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => onToggle(skill)}
            className={cn(
              "px-2 py-1 rounded-md text-[11px] font-medium",
              "border border-border/50 bg-card text-muted-foreground",
              "hover:text-foreground hover:border-border transition-all duration-150"
            )}
          >
            {skill}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepSkills() {
  const { data, updateData } = useOnboardingStore();

  function toggleTeach(skill: string) {
    const skills = data.skillsToTeach.includes(skill)
      ? data.skillsToTeach.filter((s) => s !== skill)
      : [...data.skillsToTeach, skill];
    updateData({ skillsToTeach: skills });
  }

  function toggleLearn(skill: string) {
    const skills = data.skillsToLearn.includes(skill)
      ? data.skillsToLearn.filter((s) => s !== skill)
      : [...data.skillsToLearn, skill];
    updateData({ skillsToLearn: skills });
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center space-y-1">
        <p className="text-2xl">⚡</p>
        <h2 className="text-lg font-semibold tracking-tight">
          Your skills
        </h2>
        <p className="text-sm text-muted-foreground">
          What can you teach? What do you want to learn?
        </p>
      </div>

      <div className="space-y-6">
        <SkillPicker
          label="Skills I can teach"
          description="Topics you're confident in and can help others with"
          emoji="🎯"
          selected={data.skillsToTeach}
          onToggle={toggleTeach}
        />

        <div className="border-t border-border/30" />

        <SkillPicker
          label="Skills I want to learn"
          description="Topics you want to improve or explore"
          emoji="🌱"
          selected={data.skillsToLearn}
          onToggle={toggleLearn}
        />
      </div>
    </div>
  );
}
