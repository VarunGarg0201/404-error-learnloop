"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getAllNotifications, markAllNotificationsRead, markNotificationRead } from "@/features/notifications/actions";
import {
  Bell,
  Sparkles,
  Zap,
  Users,
  Star,
  CheckCheck,
  Loader2,
  MessageSquare,
  Filter,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Notifications Page — Full notification center
   ═══════════════════════════════════════════════════════════ */

type NotifItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  isRead: boolean;
  createdAt: string;
};

function getTimeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getNotifIcon(type: string): { icon: LucideIcon; color: string; bg: string } {
  switch (type) {
    case "match": return { icon: Sparkles, color: "text-primary", bg: "bg-primary/10" };
    case "credit": return { icon: Zap, color: "text-warning", bg: "bg-warning/10" };
    case "squad": return { icon: Users, color: "text-success", bg: "bg-success/10" };
    case "review": return { icon: Star, color: "text-info", bg: "bg-info/10" };
    case "message": return { icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" };
    default: return { icon: Bell, color: "text-muted-foreground", bg: "bg-muted" };
  }
}

function groupByDate(items: NotifItem[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; items: NotifItem[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Earlier", items: [] },
  ];

  items.forEach((item) => {
    const d = new Date(item.createdAt);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() >= today.getTime()) groups[0].items.push(item);
    else if (d.getTime() >= yesterday.getTime()) groups[1].items.push(item);
    else groups[2].items.push(item);
  });

  return groups.filter((g) => g.items.length > 0);
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  async function load() {
    setLoading(true);
    const res = await getAllNotifications();
    if (res.data) setNotifs(res.data as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = filter === "unread" ? notifs.filter((n) => !n.isRead) : notifs;
  const unreadCount = notifs.filter((n) => !n.isRead).length;
  const grouped = groupByDate(filtered);

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}`}
      >
        {unreadCount > 0 && (
          <Button size="sm" variant="secondary" className="gap-1.5 text-xs" onClick={handleMarkAllRead}>
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </Button>
        )}
      </PageHeader>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize",
              filter === f
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border/50 text-muted-foreground hover:border-border"
            )}
          >
            {f === "unread" ? `Unread (${unreadCount})` : "All"}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((notif) => {
                  const { icon: Icon, color, bg } = getNotifIcon(notif.type);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150",
                        notif.isRead
                          ? "hover:bg-accent/40"
                          : "bg-primary/[0.03] hover:bg-primary/[0.06] border border-primary/10"
                      )}
                    >
                      <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5", bg)}>
                        <Icon className={cn("w-4 h-4", color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={cn("text-sm truncate", notif.isRead ? "font-medium" : "font-semibold")}>
                            {notif.title}
                          </p>
                          {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{notif.body}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground whitespace-nowrap pt-1">
                        {getTimeAgo(notif.createdAt)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title={filter === "unread" ? "No unread notifications" : "No notifications yet"}
          description="When something happens — a match, a review, or a squad update — you'll see it here."
        />
      )}
    </div>
  );
}
