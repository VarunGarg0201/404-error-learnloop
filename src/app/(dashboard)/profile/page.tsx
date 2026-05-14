"use client";

import { useUserStore } from "@/store/user-store";
import { ProfileHeader } from "@/features/profile/sections/profile-header";
import { LearningDNASection } from "@/features/profile/sections/learning-dna";
import { SkillsSection } from "@/features/profile/sections/skills-section";
import { ReputationSection } from "@/features/profile/sections/reputation-section";
import { KnowledgeCreditsSection } from "@/features/profile/sections/knowledge-credits";
import { ContributionSection } from "@/features/profile/sections/contribution-section";
import { ActivityTimeline } from "@/features/profile/sections/activity-timeline";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Profile Page
   ─────────────────────────────────────────────────────────
   Premium, modular profile with all sections composed
   into a responsive 2-column layout.
   ═══════════════════════════════════════════════════════════ */

export default function ProfilePage() {
  const { user } = useUserStore();

  const defaultBio = "Passionate about web development and teaching. I love breaking down complex topics into simple explanations. Always learning, always sharing.";

  return (
    <div className="space-y-4 stagger-children">
      {/* ─── Profile Header (full width) ─── */}
      <ProfileHeader
        displayName={user?.displayName || "Student"}
        username={user?.username || "username"}
        avatarUrl={user?.avatarUrl}
        bio={user?.bio || defaultBio}
        campus={user?.campus || "IIT Delhi"}
        stream={user?.stream || "Computer Science"}
        year={user?.year || "3rd Year"}
        knowledgeCredits={user?.knowledgeCredits ?? 1420}
        trustScore={user?.trustScore ?? 4.8}
        totalSessions={65}
        memberSince={"Oct 2025"}
        isOnline
        isOwnProfile
      />

      {/* ─── Two-column content grid ─── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left column — Primary info (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <LearningDNASection />
          <SkillsSection />
          <ContributionSection />
        </div>

        {/* Right column — Stats + Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <ReputationSection />
          <KnowledgeCreditsSection />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}
