"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications } from "@/features/dashboard/actions";
import {
  Bell,
  Sparkles,
  Zap,
  Users,
  Star,
  Loader2,
  CheckCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Notification Bell Dropdown
   ═══════════════════════════════════════════════════════════ */

interface NotifData {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
}

function getTimeAgo(dateString: string | Date) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getNotifStyling(type: string) {
  switch (type) {
    case "match": return { icon: Sparkles, iconColor: "text-primary", iconBg: "bg-primary/10" };
    case "credit": return { icon: Zap, iconColor: "text-warning", iconBg: "bg-warning/10" };
    case "squad": return { icon: Users, iconColor: "text-success", iconBg: "bg-success/10" };
    case "review": return { icon: Star, iconColor: "text-info", iconBg: "bg-info/10" };
    default: return { icon: Bell, iconColor: "text-primary", iconBg: "bg-primary/10" };
  }
}

export function NotificationBell() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<NotifData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [open, setOpen] = useState(false);

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  async function fetchNotifs() {
    if (fetched) return;
    setLoading(true);
    const { data } = await getNotifications();
    if (data) {
      setNotifs(
        data.map((n: any) => ({
          id: n.id,
          ...getNotifStyling(n.type),
          title: n.title,
          body: n.body,
          time: getTimeAgo(n.createdAt),
          isRead: n.isRead,
        }))
      );
    }
    setLoading(false);
    setFetched(true);
  }

  // Fetch when dropdown opens
  useEffect(() => {
    if (open) fetchNotifs();
  }, [open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="flex items-center justify-center h-8 px-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors outline-none relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[14px] h-[14px] px-0.5 bg-primary rounded-full text-[8px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {!fetched && unreadCount === 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[360px] p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-[10px] text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {notifs.length > 0 && (
            <Button
              variant="ghost"
              size="xs"
              className="text-[11px] text-muted-foreground gap-1"
              onClick={() => {
                setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
              }}
            >
              <CheckCheck className="w-3 h-3" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="max-h-[320px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifs.length > 0 ? (
            notifs.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 cursor-pointer",
                    "transition-colors duration-150",
                    notif.isRead
                      ? "hover:bg-accent/40"
                      : "bg-primary/[0.03] hover:bg-primary/[0.06]"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-md shrink-0 mt-0.5",
                      notif.iconBg
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", notif.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={cn(
                          "text-[12px] truncate",
                          notif.isRead ? "font-medium" : "font-semibold"
                        )}
                      >
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {notif.body}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap pt-0.5">
                    {notif.time}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                You&apos;re all caught up!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifs.length > 0 && (
          <div className="border-t border-border/40">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center py-2.5 text-[11px] font-medium text-primary hover:bg-accent/40 transition-colors"
            >
              View all notifications
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
