"use client";

import { useState } from "react";
import { GroupLayout, GroupChat, CommunityFeed } from "@/features/groups";
import { MessageSquare, LayoutTemplate } from "lucide-react";

export function CommunityClient({ community }: { community: any }) {
  const [activeTab, setActiveTab] = useState("feed");

  const tabs = [
    { id: "feed", label: "Announcements", icon: LayoutTemplate },
    { id: "chat", label: "General Chat", icon: MessageSquare },
  ];

  const currentUserRole = "member"; 
  const members = community.members || [];

  return (
    <GroupLayout
      group={community}
      members={members}
      currentUserRole={currentUserRole}
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
            <GroupChat groupId={community.id} currentUserId="user_2" />
          </div>
        )}
      </div>
    </GroupLayout>
  );
}
