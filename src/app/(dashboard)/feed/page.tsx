"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { InputField, TextareaField } from "@/components/shared/inputs";
import { UserAvatar } from "@/components/shared/user-avatar";
import { getFeedPosts, createFeedPost, likeFeedPost } from "@/features/feed/actions";
import {
  MessageSquare,
  Heart,
  Loader2,
  Plus,
  X,
  Send,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Code,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Feed & Discussions Page — Unified content feed
   ═══════════════════════════════════════════════════════════ */

type FeedPost = {
  id: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  isAnonymous: boolean;
  createdAt: string;
  user: { displayName: string; avatarUrl: string | null } | null;
};

type TabType = "all" | "teaching" | "help" | "discussion" | "struggle";

const TABS: { value: TabType; label: string; icon: typeof MessageSquare }[] = [
  { value: "all", label: "All", icon: Filter },
  { value: "teaching", label: "Teaching", icon: BookOpen },
  { value: "help", label: "Help", icon: HelpCircle },
  { value: "discussion", label: "Discussion", icon: MessageSquare },
  { value: "struggle", label: "Struggles", icon: AlertTriangle },
];

const POST_TYPES = [
  { value: "discussion", label: "Discussion", icon: MessageSquare, description: "Start a conversation" },
  { value: "struggle", label: "Struggle / Confusion", icon: AlertTriangle, description: "Share what's confusing you" },
  { value: "lesson", label: "Mini Lesson", icon: BookOpen, description: "Teach something you learned" },
  { value: "code", label: "Code Snippet", icon: Code, description: "Share helpful code" },
];

const SUPPORTIVE_REACTIONS = ["🤗", "👊", "💡", "❤️", "🙌"];

function getTimeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function FeedCard({ post, onLike }: { post: FeedPost; onLike: (id: string) => void }) {
  const isStruggle = post.type === "struggle";
  const typeIcons: Record<string, typeof MessageSquare> = {
    discussion: MessageSquare,
    struggle: AlertTriangle,
    lesson: BookOpen,
    explanation: Lightbulb,
    code: Code,
    recap: BookOpen,
    note: BookOpen,
  };
  const TypeIcon = typeIcons[post.type] || MessageSquare;

  return (
    <SurfaceCard
      className={cn(
        "transition-all duration-200 hover:border-border/60",
        isStruggle && "border-warning/20 bg-warning/[0.02]"
      )}
    >
      <div className="flex items-start gap-3">
        {post.isAnonymous ? (
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          </div>
        ) : (
          <UserAvatar
            name={post.user?.displayName || "Student"}
            src={post.user?.avatarUrl || undefined}
            size="md"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">
              {post.isAnonymous ? "Anonymous Student" : post.user?.displayName || "Student"}
            </p>
            <span className="text-[10px] text-muted-foreground">{getTimeAgo(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <TypeIcon className={cn("w-3 h-3", isStruggle ? "text-warning" : "text-muted-foreground")} />
            <span className={cn("text-[10px] font-medium capitalize", isStruggle ? "text-warning" : "text-muted-foreground")}>
              {post.type}
            </span>
            {isStruggle && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-warning/10 text-warning font-medium">
                Safe space
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold mt-2">{post.title}</h3>
          <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed line-clamp-3">
            {post.content}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
              {post.likes > 0 && post.likes}
            </button>
            {isStruggle && (
              <div className="flex items-center gap-1">
                {SUPPORTIVE_REACTIONS.map((r) => (
                  <button
                    key={r}
                    className="text-sm hover:scale-125 transition-transform"
                    title="Send support"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>("all");
  const [composing, setComposing] = useState(false);
  const [newPost, setNewPost] = useState({ type: "discussion", title: "", content: "", tags: "", isAnonymous: false });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const typeFilter = tab === "all" ? undefined
      : tab === "teaching" ? ["lesson", "explanation", "recap", "code", "note"]
      : tab === "help" ? ["help"]
      : tab === "discussion" ? ["discussion"]
      : ["struggle"];
    const res = await getFeedPosts(typeFilter);
    if (res.data) setPosts(res.data as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, [tab]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || submitting) return;
    setSubmitting(true);

    const res = await createFeedPost({
      type: newPost.type,
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      tags: newPost.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isAnonymous: newPost.isAnonymous,
    });

    if (res.success) {
      setNewPost({ type: "discussion", title: "", content: "", tags: "", isAnonymous: false });
      setComposing(false);
      await load();
    }
    setSubmitting(false);
  }

  async function handleLike(id: string) {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    await likeFeedPost(id);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feed & Discussions"
        description="Teaching posts, help requests, discussions, and struggles — all in one place."
      >
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setComposing(!composing)}>
          {composing ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {composing ? "Cancel" : "New Post"}
        </Button>
      </PageHeader>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap",
              tab === t.value
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border/50 text-muted-foreground hover:border-border"
            )}
          >
            <t.icon className="w-3 h-3" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Compose */}
      {composing && (
        <SurfaceCard>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setNewPost((p) => ({ ...p, type: pt.value }))}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    newPost.type === pt.value
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card border-border/50 text-muted-foreground"
                  )}
                >
                  <pt.icon className="w-3 h-3" />
                  {pt.label}
                </button>
              ))}
            </div>

            <InputField label="Title" value={newPost.title} onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))} placeholder="What's on your mind?" />
            <TextareaField label="Content" value={newPost.content} onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))} placeholder="Share your thoughts, questions, or learnings..." rows={4} />
            <InputField label="Tags (comma-separated)" value={newPost.tags} onChange={(e) => setNewPost((p) => ({ ...p, tags: e.target.value }))} placeholder="react, hooks, state" />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPost.isAnonymous}
                  onChange={(e) => setNewPost((p) => ({ ...p, isAnonymous: e.target.checked }))}
                  className="rounded border-border"
                />
                {newPost.isAnonymous ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                Post anonymously
              </label>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5">
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Post
              </Button>
            </div>
          </form>
        </SurfaceCard>
      )}

      {/* Feed */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No posts yet"
          description={tab === "struggle"
            ? "This is a safe space to share confusions and struggles. Be the first to open up!"
            : "Be the first to start a discussion or share a micro lesson."
          }
          action={
            <Button size="sm" variant="secondary" onClick={() => setComposing(true)} className="gap-1">
              <Plus className="w-3 h-3" />
              Create first post
            </Button>
          }
        />
      )}
    </div>
  );
}
