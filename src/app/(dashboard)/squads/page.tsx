"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { CreateGroupModal } from "@/features/groups";

export default function SquadsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Learning Squads"
        description="Accountability-based groups to keep you on track."
      >
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>Create squad</Button>
      </PageHeader>

      <EmptyState
        icon={Users}
        title="No squads yet"
        description="Join or create a learning squad with shared goals, streaks, and check-ins. Stay accountable and grow together."
        action={
          <Button size="sm" variant="secondary" onClick={() => setIsCreateModalOpen(true)}>
            Create your first Squad
          </Button>
        }
      />

      <CreateGroupModal 
        isOpen={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        defaultType="squad" 
      />
    </>
  );
}
