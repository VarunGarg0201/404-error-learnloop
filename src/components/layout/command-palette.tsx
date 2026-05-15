"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUIStore } from "@/store/ui-store";
import {
  Search,
  MessageSquare,
  Users,
  BookOpen,
  LayoutDashboard,
  Settings,
  User,
  Sparkles,
  Plus,
  ArrowRight,
  Loader2,
  GraduationCap,
  Coins,
  TrendingUp,
  Rss,
  Brain,
  Rocket,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Command Palette — ⌘K Search
   ═══════════════════════════════════════════════════════════ */

interface SearchItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
  category: "page" | "action" | "room" | "squad" | "community";
}

const STATIC_ITEMS: SearchItem[] = [
  { id: "dashboard", label: "Dashboard", description: "Your personalized home", icon: <LayoutDashboard className="w-4 h-4" />, href: "/dashboard", category: "page" },
  { id: "rooms", label: "Study Rooms", description: "Browse active rooms", icon: <MessageSquare className="w-4 h-4" />, href: "/rooms", category: "page" },
  { id: "squads", label: "Learning Squads", description: "Accountability groups", icon: <Users className="w-4 h-4" />, href: "/squads", category: "page" },
  { id: "communities", label: "Communities", description: "Campus hubs and skill groups", icon: <BookOpen className="w-4 h-4" />, href: "/communities", category: "page" },
  { id: "profile", label: "Profile", description: "View and edit your profile", icon: <User className="w-4 h-4" />, href: "/profile", category: "page" },
  { id: "settings", label: "Settings", description: "App preferences", icon: <Settings className="w-4 h-4" />, href: "/settings", category: "page" },
  { id: "assistant", label: "AI Assistant", description: "Get AI-powered help", icon: <Sparkles className="w-4 h-4" />, href: "/assistant", category: "page" },
  { id: "teach", label: "Teach", description: "Share micro lessons and earn KC", icon: <GraduationCap className="w-4 h-4" />, href: "/teach", category: "page" },
  { id: "growth", label: "Growth Analytics", description: "Track streaks and milestones", icon: <TrendingUp className="w-4 h-4" />, href: "/growth", category: "page" },
  { id: "credits", label: "Knowledge Credits", description: "Your learning economy dashboard", icon: <Coins className="w-4 h-4" />, href: "/credits", category: "page" },
  { id: "feed", label: "Feed & Discussions", description: "Teaching, help, and discussions feed", icon: <Rss className="w-4 h-4" />, href: "/feed", category: "page" },
  { id: "dna", label: "Learning DNA", description: "Manage your learning traits", icon: <Brain className="w-4 h-4" />, href: "/dna", category: "page" },
  { id: "projects", label: "Build Together", description: "Collaborate on projects and hackathons", icon: <Rocket className="w-4 h-4" />, href: "/projects", category: "page" },
  { id: "notifications", label: "Notifications", description: "Your notification center", icon: <Bell className="w-4 h-4" />, href: "/notifications", category: "page" },
  { id: "create-room", label: "Create Room", description: "Start a new study session", icon: <Plus className="w-4 h-4" />, href: "/rooms/new", category: "action" },
  { id: "create-squad", label: "Create Squad", description: "Start an accountability group", icon: <Plus className="w-4 h-4" />, href: "/squads/new", category: "action" },
  { id: "create-community", label: "Create Community", description: "Build a community hub", icon: <Plus className="w-4 h-4" />, href: "/communities/new", category: "action" },
  { id: "create-post", label: "Create Teaching Post", description: "Share what you learned", icon: <Plus className="w-4 h-4" />, href: "/teach", category: "action" },
  { id: "create-project", label: "Create Project", description: "Start a collaborative project", icon: <Plus className="w-4 h-4" />, href: "/projects", category: "action" },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items by query
  const filtered = query.trim()
    ? STATIC_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          (item.description || "").toLowerCase().includes(query.toLowerCase())
      )
    : STATIC_ITEMS;

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Navigate on Enter, arrow keys
  useEffect(() => {
    if (!commandPaletteOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex]);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, filtered, selectedIndex]);

  // Reset on open/close
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  function handleSelect(item: SearchItem) {
    setCommandPaletteOpen(false);
    router.push(item.href);
  }

  const categoryLabel: Record<string, string> = {
    page: "Pages",
    action: "Quick Actions",
    room: "Rooms",
    squad: "Squads",
    community: "Communities",
  };

  // Group by category
  const groups: Record<string, SearchItem[]> = {};
  filtered.forEach((item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  let flatIndex = 0;

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden bg-card border-border/40 gap-0">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b border-border/40">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search pages, rooms, squads, or actions..."
            className="flex-1 py-3.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden sm:inline-flex pointer-events-none h-5 items-center gap-0.5 rounded border border-border/60 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            Object.entries(groups).map(([category, items]) => (
              <div key={category}>
                <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {categoryLabel[category] || category}
                </p>
                {items.map((item) => {
                  const thisIndex = flatIndex++;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(thisIndex)}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors",
                        thisIndex === selectedIndex
                          ? "bg-primary/8 text-primary"
                          : "text-foreground hover:bg-accent/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                          thisIndex === selectedIndex
                            ? "bg-primary/10"
                            : "bg-muted/50"
                        )}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.label}</p>
                        {item.description && (
                          <p className="text-[11px] text-muted-foreground truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {thisIndex === selectedIndex && (
                        <ArrowRight className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-muted/20">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-border/60 bg-muted/50 font-mono text-[9px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-border/60 bg-muted/50 font-mono text-[9px]">↵</kbd>
              Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-border/60 bg-muted/50 font-mono text-[9px]">esc</kbd>
              Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
