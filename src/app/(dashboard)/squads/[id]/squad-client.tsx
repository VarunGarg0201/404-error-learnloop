"use client";

import { useState } from "react";
import { GroupLayout, GroupChat, SquadAccountability } from "@/features/groups";
import { MessageSquare, Target } from "lucide-react";
import type { Group, GroupMember, SquadGoal } from "@/types";

export function SquadClient({ squad }: { squad: any }) {
  const [activeTab, setActiveTab] = useState("goals");

  const tabs = [
    { id: "goals", label: "Goals & Streaks", icon: Target },
    { id: "chat", label: "Group Chat", icon: MessageSquare },
  ];

  // We find if current user is admin, but for now default to member 
  // until we pass current user from the server component. Let's just assume "member".
  const currentUserRole = "member"; 

  // Map squad data to what the components expect
  const goals = squad.squadGoals || [];
  const members = squad.members || [];

  return (
    <GroupLayout
      group={squad}
      members={members}
      currentUserRole={currentUserRole}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    >
      <div className="max-w-4xl mx-auto h-full">
        {activeTab === "goals" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SquadAccountability goals={goals} streakDays={squad.streakDays || 0} />
          </div>
        )}
        
        {activeTab === "chat" && (
          <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GroupChat groupId={squad.id} currentUserId="user_1" />
          </div>
        )}
      </div>
    </GroupLayout>
  );
}
