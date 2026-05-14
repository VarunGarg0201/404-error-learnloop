"use client";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Help Requests Widget — Live help requests from peers
   ═══════════════════════════════════════════════════════════ */

interface HelpRequestProps {
  user: string;
  avatarUrl?: string;
  topic: string;
  subject: string;
  urgency: "low" | "medium" | "high";
  postedAgo: string;
}

const urgencyVariant = {
  low: "info" as const,
  medium: "warning" as const,
  high: "destructive" as const,
};

function HelpRequestItem({
  user,
  avatarUrl,
  topic,
  subject,
  urgency,
  postedAgo,
}: HelpRequestProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-3 py-2.5 rounded-lg",
        "hover:bg-accent/40 transition-colors cursor-pointer group"
      )}
    >
      <UserAvatar name={user} src={avatarUrl} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-medium truncate">{topic}</p>
          <StatusBadge variant={urgencyVariant[urgency]} size="xs">
            {urgency}
          </StatusBadge>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {user} · {subject}
        </p>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 pt-0.5">
        <Clock className="w-3 h-3" />
        {postedAgo}
      </div>
    </div>
  );
}

const DEMO_REQUESTS: HelpRequestProps[] = [
  {
    user: "Karthik R.",
    topic: "Binary Search Tree deletion",
    subject: "Data Structures",
    urgency: "high",
    postedAgo: "2m",
  },
  {
    user: "Sneha P.",
    topic: "React useEffect cleanup",
    subject: "Web Dev",
    urgency: "medium",
    postedAgo: "8m",
  },
  {
    user: "Arjun M.",
    topic: "Linked list reversal doubt",
    subject: "DSA",
    urgency: "low",
    postedAgo: "15m",
  },
];

export function HelpRequestsWidget({ className }: { className?: string }) {
  const hasRequests = DEMO_REQUESTS.length > 0;

  return (
    <Widget
      title="Help Requests"
      description="Students need help right now"
      icon={HelpCircle}
      noPadding
      action={
        hasRequests
          ? { label: "See all", onClick: () => {} }
          : undefined
      }
      className={className}
    >
      {hasRequests ? (
        <div className="pb-2">
          {DEMO_REQUESTS.map((req, i) => (
            <HelpRequestItem key={i} {...req} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HelpCircle}
          title="No active requests"
          description="Be the first to ask for help, or check back later."
          action={<Button size="sm" variant="secondary">Ask for help</Button>}
          className="pb-4"
        />
      )}
    </Widget>
  );
}
