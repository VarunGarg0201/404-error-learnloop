"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { CreateGroupModal } from "@/features/groups";

export default function CommunitiesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Communities"
        description="Campus hubs, study groups, and skill-based communities."
      >
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>Create community</Button>
      </PageHeader>

      <EmptyState
        icon={BookOpen}
        title="No communities yet"
        description="Create or join study communities, campus hubs, and interest groups to connect with like-minded learners."
        action={
          <Button size="sm" variant="secondary" onClick={() => setIsCreateModalOpen(true)}>
            Start a Community
          </Button>
        }
      />

      <CreateGroupModal 
        isOpen={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        defaultType="community" 
      />
    </>
  );
}
