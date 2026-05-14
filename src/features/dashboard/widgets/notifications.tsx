"use client";

import { cn } from "@/lib/utils";
import { Widget } from "@/components/shared/widgets";
import {
  Bell,
  Sparkles,
  Zap,
  Users,
  MessageSquare,
  Star,
  CheckCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Notifications Widget
   ═══════════════════════════════════════════════════════════ */

interface NotifItem {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
}

const DEMO_NOTIFS: NotifItem[] = [
  {
    icon: Sparkles,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "New match found",
    body: "Ananya S. matches 94% with your learning goals",
    time: "5m",
    isRead: false,
  },
  {
    icon: Zap,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
    title: "+15 Knowledge Credits",
    body: "Earned for teaching React hooks to Karthik",
    time: "1h",
    isRead: false,
  },
  {
    icon: Users,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    title: "Squad check-in",
    body: "Time for your daily check-in with DSA Warriors",
    time: "2h",
    isRead: true,
  },
  {
    icon: Star,
    iconColor: "text-info",
    iconBg: "bg-info/10",
    title: "New review received",
    body: "Sneha rated you 5⭐ for your explanation",
    time: "3h",
    isRead: true,
  },
];

export function NotificationsWidget({ className }: { className?: string }) {
  const unreadCount = DEMO_NOTIFS.filter((n) => !n.isRead).length;

  return (
    <Widget
      title="Notifications"
      description={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
      icon={Bell}
      noPadding
      action={{ label: "View all", onClick: () => {} }}
      className={className}
    >
      <div className="pb-2">
        {DEMO_NOTIFS.map((notif, i) => {
          const Icon = notif.icon;
          return (
            <div
              key={i}
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
    </Widget>
  );
}

/* ═══════════════════════════════════════════════════════════
   Recent Activity Widget
   ═══════════════════════════════════════════════════════════ */

interface ActivityItem {
  icon: LucideIcon;
  label: string;
  detail: string;
  time: string;
}

const DEMO_ACTIVITY: ActivityItem[] = [
  {
    icon: MessageSquare,
    label: "Joined study room",
    detail: "DSA Problem Solving with Ananya",
    time: "30m ago",
  },
  {
    icon: CheckCircle,
    label: "Completed session",
    detail: "React Hooks Explained — 45min",
    time: "2h ago",
  },
  {
    icon: Zap,
    label: "Earned 15 KC",
    detail: "For teaching React hooks",
    time: "2h ago",
  },
  {
    icon: Users,
    label: "Joined squad",
    detail: "DSA Warriors — 5 members",
    time: "1d ago",
  },
  {
    icon: Star,
    label: "Received 5⭐ review",
    detail: "From Sneha for DBMS help",
    time: "1d ago",
  },
];

export function RecentActivityWidget({ className }: { className?: string }) {
  return (
    <Widget
      title="Recent Activity"
      description="Your latest actions"
      icon={CheckCircle}
      noPadding
      className={className}
    >
      <div className="pb-2">
        {DEMO_ACTIVITY.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
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
    </Widget>
  );
}
