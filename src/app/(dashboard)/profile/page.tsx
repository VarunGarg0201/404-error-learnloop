"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/user-store";
import { ProfileHeader } from "@/features/profile/sections/profile-header";
import { LearningDNASection } from "@/features/profile/sections/learning-dna";
import { SkillsSection } from "@/features/profile/sections/skills-section";
import { ReputationSection } from "@/features/profile/sections/reputation-section";
import { KnowledgeCreditsSection } from "@/features/profile/sections/knowledge-credits";
import { ContributionSection } from "@/features/profile/sections/contribution-section";
import { ActivityTimeline } from "@/features/profile/sections/activity-timeline";
import { getFullProfile } from "@/features/profile/actions";
import { Loader2 } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Profile Page
   ─────────────────────────────────────────────────────────
   Premium, modular profile with all sections composed
   into a responsive 2-column layout.
   Now fetches live data from the database.
   ═══════════════════════════════════════════════════════════ */

export default function ProfilePage() {
  const { user } = useUserStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFullProfile().then((res) => {
      if (res.data) setProfile(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const p = profile;
  const memberSince = p?.createdAt
    ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Recently";

  return (
    <div className="space-y-4 stagger-children">
      {/* ─── Profile Header (full width) ─── */}
      <ProfileHeader
        displayName={p?.displayName || user?.displayName || "Student"}
        username={p?.username || user?.username || "username"}
        avatarUrl={p?.avatarUrl || user?.avatarUrl}
        bio={p?.bio || user?.bio}
        campus={p?.campus || user?.campus}
        stream={p?.stream || user?.stream}
        year={p?.year || user?.year}
        knowledgeCredits={p?.totalKC ?? user?.knowledgeCredits ?? 0}
        trustScore={p?.trustScore ?? user?.trustScore ?? 0}
        totalSessions={p?.totalSessions ?? 0}
        memberSince={memberSince}
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
