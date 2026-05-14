"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Hash, Settings2, Users, Crown } from "lucide-react";
import type { Group, GroupMember } from "@/types";

/* ═══════════════════════════════════════════════════════════
   Shared Group Layout
   ─────────────────────────────────────────────────────────
   Common architectural skeleton for both Squads and Communities.
   Features a sidebar for members and a main content area.
   ═══════════════════════════════════════════════════════════ */

interface GroupLayoutProps {
  group: Group;
  members: GroupMember[];
  currentUserRole: "admin" | "member" | "none";
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; icon: React.ElementType }[];
}

export function GroupLayout({
  group,
  members,
  currentUserRole,
  children,
  activeTab,
  onTabChange,
  tabs,
}: GroupLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-4 sm:-m-8 bg-background overflow-hidden relative">
      
      {/* ─── Main Content Area ─── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        
        {/* Header Overlay */}
        <header className="shrink-0 border-b border-border/40 bg-card/50 backdrop-blur-md px-4 sm:px-8 py-4 sm:py-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                  {group.type}
                </span>
                {group.isPrivate && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
                    Private
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{group.name}</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{group.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Users className="w-4 h-4 mr-2" />
                {members.length}
              </Button>
              {currentUserRole === "admin" && (
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-full px-4 shrink-0 transition-colors",
                  activeTab === tab.id ? "font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 sm:p-8 relative">
          {children}
        </main>
      </div>

      {/* ─── Members Sidebar (Right) ─── */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-card border-l border-border/40 shadow-2xl transition-transform duration-300 z-40 flex flex-col",
          "lg:relative lg:translate-x-0 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 border-b border-border/30 flex items-center justify-between bg-muted/20">
          <h3 className="font-semibold text-sm">Members ({members.length})</h3>
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(false)}>
            <span className="sr-only">Close sidebar</span>
            &times;
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          
          {/* Tags */}
          {group.tags && group.tags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-muted px-2 py-1 rounded-md flex items-center gap-1">
                    <Hash className="w-3 h-3 text-muted-foreground" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Member List */}
          <div>
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Online — 1</h4>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={member.user.displayName} src={member.user.avatarUrl} size="sm" />
                    <div>
                      <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                        {member.user.displayName}
                        {member.role === "admin" && <Crown className="w-3 h-3 text-warning" />}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
