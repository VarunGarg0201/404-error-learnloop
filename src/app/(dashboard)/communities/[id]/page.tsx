import { joinGroup, getGroupById } from "@/features/groups/actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Hash } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { CommunityClient } from "./community-client";

/* ═══════════════════════════════════════════════════════════
   Dynamic Community Page
   ─────────────────────────────────────────────────────────
   Entry point for /communities/[id]
   ═══════════════════════════════════════════════════════════ */

interface CommunityPageProps {
  params: Promise<{ id: string }>;
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { id } = await params;
  
  // Attempt to join the community on page load
  const joinRes = await joinGroup(id);

  if (!joinRes.success) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={Hash}
          title="Cannot Join Community"
          description={joinRes.error || "The community may be private or not exist."}
          action={
            <Link href="/communities" className={buttonVariants()}>
              Back to Communities
            </Link>
          }
        />
      </div>
    );
  }

  // Fetch full community data
  const { data: community } = await getGroupById(id);

  if (!community) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={Hash}
          title="Community Not Found"
          description="This community does not exist."
          action={
            <Link href="/communities" className={buttonVariants()}>
              Back to Communities
            </Link>
          }
        />
      </div>
    );
  }

  return <CommunityClient community={community as any} />;
}
