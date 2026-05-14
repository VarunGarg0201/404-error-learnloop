"use client";

import { useState } from "react";
import { GroupLayout, GroupChat, CommunityFeed } from "@/features/groups";
import { MessageSquare, LayoutTemplate } from "lucide-react";
import type { Group, GroupMember } from "@/types";

/* ═══════════════════════════════════════════════════════════
   Community Detail Page
   ─────────────────────────────────────────────────────────
   Dynamic route for /communities/[id]
   ═══════════════════════════════════════════════════════════ */

export default function CommunityPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("feed");

  // Mock Data for Phase 1
  const mockCommunity: Group = {
    id: params.id,
    type: "community",
    name: "MIT Computer Science",
    description: "Official community hub for all CS majors at MIT. Join for study groups, announcements, and peer support.",
    tags: ["Campus", "Computer Science", "Engineering"],
    membersCount: 1240,
    isPrivate: false,
    createdAt: new Date().toISOString(),
    campus: "MIT",
  };

  const mockMembers: GroupMember[] = [
    { id: "m1", userId: "user_1", role: "admin", joinedAt: new Date().toISOString(), user: { id: "user_1", displayName: "Dr. Alan", avatarUrl: null } },
    { id: "m2", userId: "user_2", role: "member", joinedAt: new Date().toISOString(), user: { id: "user_2", displayName: "Sarah J. (You)", avatarUrl: null } },
    { id: "m3", userId: "user_3", role: "member", joinedAt: new Date().toISOString(), user: { id: "user_3", displayName: "Mike T.", avatarUrl: null } },
  ];

  const tabs = [
    { id: "feed", label: "Announcements", icon: LayoutTemplate },
    { id: "chat", label: "General Chat", icon: MessageSquare },
  ];

  return (
    <GroupLayout
      group={mockCommunity}
      members={mockMembers}
      currentUserRole="member"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    >
      <div className="max-w-4xl mx-auto h-full">
        {activeTab === "feed" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CommunityFeed />
          </div>
        )}
        
        {activeTab === "chat" && (
          <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GroupChat groupId={mockCommunity.id} currentUserId="user_2" />
          </div>
        )}
      </div>
    </GroupLayout>
  );
}
