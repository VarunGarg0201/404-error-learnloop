"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { searchLibrary } from "@/features/library/actions";
import {
  Library,
  Search,
  BookOpen,
  Code,
  FileText,
  Lightbulb,
  StickyNote,
  Repeat,
  Heart,
  Loader2,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Legacy Knowledge Library — Phase 2
   ─────────────────────────────────────────────────────────
   Searchable archive of all micro-teaching posts and
   community knowledge contributions.
   ═══════════════════════════════════════════════════════════ */

type LibraryItem = {
  id: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  createdAt: string;
  user: { displayName: string; avatarUrl: string | null } | null;
  isAnonymous: boolean;
};

const TYPE_META: Record<string, { icon: typeof BookOpen; color: string; label: string }> = {
  lesson: { icon: Lightbulb, color: "text-primary", label: "Lesson" },
  explanation: { icon: FileText, color: "text-info", label: "Explanation" },
  recap: { icon: Repeat, color: "text-success", label: "Recap" },
  code: { icon: Code, color: "text-warning", label: "Code" },
  note: { icon: StickyNote, color: "text-muted-foreground", label: "Note" },
  discussion: { icon: FileText, color: "text-primary", label: "Discussion" },
  struggle: { icon: FileText, color: "text-destructive", label: "Struggle" },
};

function getTimeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function LibraryCard({ item }: { item: LibraryItem }) {
  const meta = TYPE_META[item.type] || TYPE_META.lesson;
  const Icon = meta.icon;

  return (
    <SurfaceCard className="hover:border-border/60 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0 bg-muted/60")}>
          <Icon className={cn("w-4 h-4", meta.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold truncate">{item.title}</h3>
            <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-muted", meta.color)}>
              {meta.label}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {item.content}
          </p>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-accent/60 text-accent-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 mt-2">
            {!item.isAnonymous && item.user && (
              <div className="flex items-center gap-1">
                <UserAvatar name={item.user.displayName} src={item.user.avatarUrl || undefined} size="xs" />
                <span className="text-[10px] text-muted-foreground">{item.user.displayName}</span>
              </div>
            )}
            <span className="text-[10px] text-muted-foreground">{getTimeAgo(item.createdAt)}</span>
            {item.likes > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Heart className="w-3 h-3" /> {item.likes}
              </span>
            )}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await searchLibrary(search || undefined, typeFilter || undefined);
    if (res.data) setItems(res.data as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, [typeFilter]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load();
  }

  const types = Object.entries(TYPE_META).filter(([k]) => !["struggle", "discussion"].includes(k));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Library"
        description="Browse and search the collective wisdom of the LearnLoop community."
      />

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lessons, code, notes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
        </div>
        <Button type="submit" size="sm" className="gap-1.5">
          <Search className="w-3.5 h-3.5" />
          Search
        </Button>
      </form>

      {/* Type filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setTypeFilter(null)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap",
            !typeFilter
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          All
        </button>
        {types.map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setTypeFilter(key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap",
              typeFilter === key
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border/50 text-muted-foreground hover:border-border"
            )}
          >
            <meta.icon className="w-3 h-3" />
            {meta.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <LibraryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Library}
          title={search ? "No results found" : "Library is empty"}
          description={search ? `No content matching "${search}". Try a different search.` : "As students share lessons and code, the library grows. Start teaching to contribute!"}
        />
      )}
    </div>
  );
}
