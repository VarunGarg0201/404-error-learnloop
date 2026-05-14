import { joinGroup, getGroupById } from "@/features/groups/actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { SquadClient } from "./squad-client";

/* ═══════════════════════════════════════════════════════════
   Dynamic Squad Page
   ─────────────────────────────────────────────────────────
   Entry point for /squads/[id]
   ═══════════════════════════════════════════════════════════ */

interface SquadPageProps {
  params: Promise<{ id: string }>;
}

export default async function SquadPage({ params }: SquadPageProps) {
  const { id } = await params;
  
  // Attempt to join the squad on page load
  const joinRes = await joinGroup(id);

  if (!joinRes.success) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={Users}
          title="Cannot Join Squad"
          description={joinRes.error || "The squad may be private or not exist."}
          action={
            <Link href="/squads" className={buttonVariants()}>
              Back to Squads
            </Link>
          }
        />
      </div>
    );
  }

  // Fetch full squad data
  const { data: squad } = await getGroupById(id);

  if (!squad) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={Users}
          title="Squad Not Found"
          description="This squad does not exist."
          action={
            <Link href="/squads" className={buttonVariants()}>
              Back to Squads
            </Link>
          }
        />
      </div>
    );
  }

  return <SquadClient squad={squad as any} />;
}
