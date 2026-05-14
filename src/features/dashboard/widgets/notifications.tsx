"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Widget } from "@/components/shared/widgets";
import { EmptyState } from "@/components/shared/empty-state";
import { getNotifications, getRecentActivities } from "@/features/dashboard/actions";
import {
  Bell,
  Sparkles,
  Zap,
  Users,
  MessageSquare,
  Star,
  CheckCircle,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Notifications Widget
   ═══════════════════════════════════════════════════════════ */

interface NotifItem {
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

export function NotificationsWidget({ className }: { className?: string }) {
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await getNotifications();
      if (data) {
        setNotifs(data.map((n: any) => ({
          id: n.id,
          ...getNotifStyling(n.type),
          title: n.title,
          body: n.body,
          time: getTimeAgo(n.createdAt),
          isRead: n.isRead,
        })));
      }
      setLoading(false);
    }
    load();
  }, []);

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return (
    <Widget
      title="Notifications"
      description={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
      icon={Bell}
      noPadding
      action={notifs.length > 0 ? { label: "View all", onClick: () => {} } : undefined}
      className={className}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : notifs.length > 0 ? (
        <div className="pb-2">
          {notifs.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-2.5 cursor-pointer",
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
                        "text-[13px] truncate",
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
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
          className="pb-4"
        />
      )}
    </Widget>
  );
}

/* ═══════════════════════════════════════════════════════════
   Recent Activity Widget
   ═══════════════════════════════════════════════════════════ */

interface ActivityItem {
  id: string;
  icon: LucideIcon;
  label: string;
  detail: string;
  time: string;
}

function getActivityIcon(type: string) {
  switch (type) {
    case "joined_room": return MessageSquare;
    case "completed_session": return CheckCircle;
    case "earned_kc": return Zap;
    case "joined_squad": return Users;
    case "received_review": return Star;
    default: return CheckCircle;
  }
}

export function RecentActivityWidget({ className }: { className?: string }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await getRecentActivities();
      if (data) {
        setActivities(data.map((a: any) => ({
          id: a.id,
          icon: getActivityIcon(a.type),
          label: a.label,
          detail: a.detail,
          time: getTimeAgo(a.createdAt),
        })));
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <Widget
      title="Recent Activity"
      description="Your latest actions"
      icon={CheckCircle}
      noPadding
      className={className}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : activities.length > 0 ? (
        <div className="pb-2">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 px-4 py-2 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-muted/50 shrink-0 mt-0.5">
                  <Icon className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {item.detail}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap pt-0.5">
                  {item.time}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CheckCircle}
          title="No recent activity"
          description="Start collaborating to see your activity here."
          className="pb-4"
        />
      )}
    </Widget>
  );
}
