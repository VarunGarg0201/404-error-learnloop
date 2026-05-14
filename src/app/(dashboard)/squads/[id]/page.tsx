"use client";

import { useState } from "react";
import { GroupLayout, GroupChat, SquadAccountability } from "@/features/groups";
import { MessageSquare, Target } from "lucide-react";
import type { Group, GroupMember, SquadGoal } from "@/types";

/* ═══════════════════════════════════════════════════════════
   Squad Detail Page
   ─────────────────────────────────────────────────────────
   Dynamic route for /squads/[id]
   ═══════════════════════════════════════════════════════════ */

export default function SquadPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("goals");

  // Mock Data for Phase 1
  const mockSquad: Group = {
    id: params.id,
    type: "squad",
    name: "Midnight Coders",
    description: "A small accountability group for night owls learning full-stack web development.",
    tags: ["Next.js", "Night Owls", "Frontend"],
    membersCount: 4,
    isPrivate: true,
    createdAt: new Date().toISOString(),
    streakDays: 14,
  };

  const mockGoals: SquadGoal[] = [
    {
      id: "g1",
      title: "Build the Dashboard UI",
      targetHours: 10,
      currentHours: 8,
      deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      isCompleted: false,
    },
    {
      id: "g2",
      title: "Complete Prisma Schema",
      targetHours: 5,
      currentHours: 5,
      deadline: new Date(Date.now() - 86400000 * 1).toISOString(),
      isCompleted: true,
    }
  ];

  const mockMembers: GroupMember[] = [
    { id: "m1", userId: "user_1", role: "admin", joinedAt: new Date().toISOString(), user: { id: "user_1", displayName: "Alice (You)", avatarUrl: null } },
    { id: "m2", userId: "user_2", role: "member", joinedAt: new Date().toISOString(), user: { id: "user_2", displayName: "Bob", avatarUrl: null } },
    { id: "m3", userId: "user_3", role: "member", joinedAt: new Date().toISOString(), user: { id: "user_3", displayName: "Charlie", avatarUrl: null } },
  ];

  const tabs = [
    { id: "goals", label: "Goals & Streaks", icon: Target },
    { id: "chat", label: "Group Chat", icon: MessageSquare },
  ];

  return (
    <GroupLayout
      group={mockSquad}
      members={mockMembers}
      currentUserRole="admin"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    >
      <div className="max-w-4xl mx-auto h-full">
        {activeTab === "goals" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SquadAccountability goals={mockGoals} streakDays={mockSquad.streakDays || 0} />
          </div>
        )}
        
        {activeTab === "chat" && (
          <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GroupChat groupId={mockSquad.id} currentUserId="user_1" />
          </div>
        )}
      </div>
    </GroupLayout>
  );
}
