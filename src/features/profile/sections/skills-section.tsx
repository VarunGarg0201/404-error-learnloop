"use client";

import { cn } from "@/lib/utils";
import { Widget } from "@/components/shared/widgets";
import { SkillTag } from "@/components/shared/badges";
import { BookOpen, GraduationCap } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Skills Section — Teaching + Learning skills
   ═══════════════════════════════════════════════════════════ */

interface SkillsSectionProps {
  skillsToTeach?: string[];
  skillsToLearn?: string[];
  isOwnProfile?: boolean;
  className?: string;
}

// Demo data
const DEMO_TEACH = [
  "React", "TypeScript", "Next.js", "System Design", "Node.js",
  "JavaScript", "Git", "REST APIs",
];
const DEMO_LEARN = [
  "Machine Learning", "Rust", "Docker", "Kubernetes",
  "GraphQL", "Go",
];

export function SkillsSection({
  skillsToTeach = DEMO_TEACH,
  skillsToLearn = DEMO_LEARN,
  isOwnProfile = true,
  className,
}: SkillsSectionProps) {
  return (
    <Widget
      title="Skills"
      description="What I teach & want to learn"
      icon={BookOpen}
      moreMenu={isOwnProfile}
      className={className}
    >
      <div className="space-y-4">
        {/* Skills to teach */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Can teach
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillsToTeach.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
            {skillsToTeach.length === 0 && (
              <p className="text-[11px] text-muted-foreground">No teaching skills added yet.</p>
            )}
          </div>
        </div>

        {/* Skills to learn */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-success" />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Wants to learn
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillsToLearn.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
            {skillsToLearn.length === 0 && (
              <p className="text-[11px] text-muted-foreground">No learning goals added yet.</p>
            )}
          </div>
        </div>
      </div>
    </Widget>
  );
}
