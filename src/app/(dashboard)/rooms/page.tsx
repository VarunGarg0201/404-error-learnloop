import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Rooms",
};

export default function RoomsPage() {
  return (
    <>
      <PageHeader
        title="Study Rooms"
        description="Real-time collaboration spaces for learning together."
      >
        <Button size="sm">Create room</Button>
      </PageHeader>

      <EmptyState
        icon={MessageSquare}
        title="No active rooms"
        description="Create a study room to collaborate with peers in real time. Choose from Quick Help, Study, Revision, Coding, and more."
        action={
          <Button size="sm" variant="secondary">
            Create your first room
          </Button>
        }
      />
    </>
  );
}
