"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Widget } from "@/components/shared/widgets";
import { Button } from "@/components/ui/button";
import { getHelpRequests } from "@/features/dashboard/actions";
import { HelpRequestModal } from "@/features/dashboard/components/help-request-modal";
import {
  HelpCircle,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Help Requests Widget — Live help requests from peers
   ═══════════════════════════════════════════════════════════ */

interface HelpRequestProps {
  id: string;
  user: string;
  avatarUrl?: string;
  topic: string;
  subject: string;
  urgency: "low" | "medium" | "high";
  postedAgo: string;
}

const urgencyVariant: Record<string, "info" | "warning" | "destructive"> = {
  low: "info",
  medium: "warning",
  high: "destructive",
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
          <StatusBadge variant={urgencyVariant[urgency] || "warning"} size="xs">
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

function getTimeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function HelpRequestsWidget({ className }: { className?: string }) {
  const [requests, setRequests] = useState<HelpRequestProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchRequests() {
    const { data } = await getHelpRequests();
    if (data) {
      setRequests(data.map((r: any) => ({
        id: r.id,
        user: r.user.displayName,
        avatarUrl: r.user.avatarUrl,
        topic: r.topic,
        subject: r.subject,
        urgency: r.urgency,
        postedAgo: getTimeAgo(r.createdAt),
      })));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  const hasRequests = requests.length > 0;

  return (
    <>
      <Widget
        title="Help Requests"
        description="Students need help right now"
        icon={HelpCircle}
        noPadding
        action={{
          label: "Ask for help",
          onClick: () => setIsModalOpen(true),
        }}
        className={className}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : hasRequests ? (
          <div className="pb-2">
            {requests.map((req) => (
              <HelpRequestItem key={req.id} {...req} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={HelpCircle}
            title="No active requests"
            description="Be the first to ask for help, or check back later."
            action={
              <Button size="sm" variant="secondary" className="gap-1" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-3 h-3" />
                Ask for help
              </Button>
            }
            className="pb-4"
          />
        )}
      </Widget>
      <HelpRequestModal isOpen={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) fetchRequests(); // Refresh after creating
      }} />
    </>
  );
}
