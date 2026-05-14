"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createMicroPost, getMicroPosts, likeMicroPost } from "@/features/teaching/actions";
import {
  BookOpen,
  Plus,
  Heart,
  Code,
  FileText,
  Lightbulb,
  Repeat,
  StickyNote,
  Loader2,
  Check,
  Zap,
  Tag,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Teach Page — "Teach What You Learned"
   Micro Teaching System from MASTER_PROMPT.md
   ═══════════════════════════════════════════════════════════ */

const POST_TYPES = [
  { value: "lesson", label: "Mini Lesson", icon: Lightbulb, color: "text-primary" },
  { value: "explanation", label: "Explanation", icon: FileText, color: "text-info" },
  { value: "recap", label: "Concept Recap", icon: Repeat, color: "text-success" },
  { value: "code", label: "Code Snippet", icon: Code, color: "text-warning" },
  { value: "note", label: "Revision Note", icon: StickyNote, color: "text-muted-foreground" },
];

function getTimeAgo(d: string | Date) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function PostCard({ post, onLike }: { post: any; onLike: () => void }) {
  const typeInfo = POST_TYPES.find((t) => t.value === post.type) || POST_TYPES[0];
  const Icon = typeInfo.icon;

  return (
    <SurfaceCard className="hover:border-border/60 transition-all">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {post.isAnonymous ? (
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">?</div>
        ) : (
          <UserAvatar name={post.user.displayName} src={post.user.avatarUrl} size="sm" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">
              {post.isAnonymous ? "Anonymous Student" : post.user.displayName}
            </p>
            <StatusBadge variant="secondary" size="xs">
              <Icon className={cn("w-2.5 h-2.5 mr-0.5", typeInfo.color)} />
              {typeInfo.label}
            </StatusBadge>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {!post.isAnonymous && post.user.stream ? `${post.user.stream} · ` : ""}
            {getTimeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold mb-2">{post.title}</h3>

      {/* Content */}
      <div className={cn(
        "text-[13px] text-muted-foreground leading-relaxed mb-3 whitespace-pre-wrap",
        post.type === "code" && "font-mono text-[12px] bg-muted/40 p-3 rounded-lg border border-border/30 overflow-x-auto"
      )}>
        {post.content}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent/60 text-accent-foreground border border-border/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/30">
        <button
          onClick={onLike}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
        >
          <Heart className="w-3.5 h-3.5" />
          {post.likes > 0 ? post.likes : "Like"}
        </button>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Zap className="w-3 h-3 text-warning" />
          +15 KC earned
        </span>
      </div>
    </SurfaceCard>
  );
}

function CreatePostModal({ isOpen, onOpenChange, onCreated }: { isOpen: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void }) {
  const [type, setType] = useState("lesson");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    const res = await createMicroPost({ type, title: title.trim(), content: content.trim(), tags, isAnonymous });
    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        onOpenChange(false);
        setSubmitted(false);
        setTitle("");
        setContent("");
        setTags([]);
        setType("lesson");
        onCreated();
      }, 1500);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          Teach What You Learned
        </DialogTitle>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-success" />
            </div>
            <p className="text-sm font-semibold">Post published!</p>
            <p className="text-[11px] text-muted-foreground">
              You earned <strong>15 KC</strong> for sharing knowledge 🎉
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Type selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Post type</label>
              <div className="grid grid-cols-5 gap-1.5">
                {POST_TYPES.map((pt) => {
                  const PIcon = pt.icon;
                  return (
                    <button
                      key={pt.value}
                      type="button"
                      onClick={() => setType(pt.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium border transition-all",
                        type === pt.value
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-card border-border/50 text-muted-foreground hover:border-border"
                      )}
                    >
                      <PIcon className="w-4 h-4" />
                      {pt.label.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How binary search actually works"
                className="w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={type === "code" ? "Paste your code here..." : "Share what you learned..."}
                rows={6}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none",
                  type === "code" && "font-mono text-[12px]"
                )}
                required
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Tag className="w-3 h-3" /> Tags (up to 5)
              </label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-xs outline-none"
                />
                <Button type="button" size="xs" variant="secondary" onClick={addTag}>Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                    >
                      #{t} ×
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Anonymous toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-xs text-muted-foreground">Post anonymously</span>
            </label>

            <Button type="submit" className="w-full gap-1.5" disabled={submitting || !title.trim() || !content.trim()}>
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Publish & Earn 15 KC
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function TeachPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  async function fetchPosts() {
    const { data } = await getMicroPosts();
    if (data) setPosts(data);
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleLike(postId: string) {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    await likeMicroPost(postId);
  }

  const filtered = filter ? posts.filter((p) => p.type === filter) : posts;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teach What You Learned"
        description="Share mini lessons, code snippets, and concept recaps. Earn KC for every post."
      >
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5" />
          Create post
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            !filter
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          All ({posts.length})
        </button>
        {POST_TYPES.map((pt) => {
          const Icon = pt.icon;
          const count = posts.filter((p) => p.type === pt.value).length;
          return (
            <button
              key={pt.value}
              onClick={() => setFilter(pt.value)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all",
                filter === pt.value
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border/50 text-muted-foreground hover:border-border"
              )}
            >
              <Icon className="w-3 h-3" />
              {count}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No posts yet"
          description="Be the first to share what you learned today!"
          action={
            <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Create post
            </Button>
          }
        />
      )}

      <CreatePostModal isOpen={createOpen} onOpenChange={setCreateOpen} onCreated={fetchPosts} />
    </div>
  );
}
