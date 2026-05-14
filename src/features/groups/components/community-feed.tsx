"use client";

import { SurfaceCard } from "@/components/shared/cards";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Pin } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Community Feed Widget
   ─────────────────────────────────────────────────────────
   Displays announcements and discussion threads for large groups.
   ═══════════════════════════════════════════════════════════ */

interface FeedPost {
  id: string;
  author: { name: string; avatarUrl: string | null; role: string };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: "1",
    author: { name: "Dr. Alan", avatarUrl: null, role: "admin" },
    content: "Welcome to the Computer Science hub! Please check the syllabus pinned in the sidebar. Office hours will be held in the main voice room every Tuesday at 4 PM.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 42,
    comments: 5,
    isPinned: true,
  },
  {
    id: "2",
    author: { name: "Sarah J.", avatarUrl: null, role: "member" },
    content: "Is anyone planning a study group for the upcoming Data Structures midterm? I'm struggling with Red-Black trees and could use some help.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 8,
    comments: 12,
  }
];

export function CommunityFeed() {
  return (
    <div className="space-y-4">
      
      {/* Create Post Input (Mock) */}
      <SurfaceCard className="p-4 border-primary/20 bg-primary/5">
        <div className="flex gap-3 items-center">
          <UserAvatar name="Me" size="sm" />
          <Button variant="outline" className="flex-1 justify-start text-muted-foreground h-10 bg-background">
            Start a discussion...
          </Button>
        </div>
      </SurfaceCard>

      {/* Feed */}
      {MOCK_POSTS.map(post => (
        <SurfaceCard key={post.id} className="p-0 overflow-hidden">
          {post.isPinned && (
            <div className="bg-warning/10 px-4 py-1.5 flex items-center gap-2 border-b border-warning/20">
              <Pin className="w-3 h-3 text-warning" />
              <span className="text-[10px] font-bold text-warning uppercase tracking-wider">Pinned Announcement</span>
            </div>
          )}
          
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <UserAvatar name={post.author.name} src={post.author.avatarUrl} size="md" />
              <div>
                <p className="text-sm font-semibold flex items-center gap-2">
                  {post.author.name}
                  {post.author.role === "admin" && (
                    <span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(post.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-4">
              {post.content}
            </p>

            <div className="flex items-center gap-4 pt-3 border-t border-border/40">
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary">
                <Heart className="w-4 h-4" /> {post.likes}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
                <MessageSquare className="w-4 h-4" /> {post.comments} Comments
              </Button>
            </div>
          </div>
        </SurfaceCard>
      ))}

    </div>
  );
}
