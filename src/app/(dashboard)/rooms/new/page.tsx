"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createRoom } from "@/features/rooms/actions";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
      maxParticipants: parseInt(formData.get("maxParticipants") as string) || 10,
    };

    const res = await createRoom(data);
    setLoading(false);

    if (res.success && res.data) {
      toast.success("Room created!");
      router.push(`/rooms/${res.data.id}`);
    } else {
      toast.error(res.error || "Failed to create room");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/rooms"
          className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-2 -ml-2 text-muted-foreground" })}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to rooms
        </Link>
        <PageHeader 
          title="Create a Study Room" 
          description="Start a live collaboration session to study, solve problems, or build together."
        />
      </div>

      <SurfaceCard padding="lg">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Room Title</Label>
            <Input id="title" name="title" placeholder="e.g. DSA Problem Solving (Trees)" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" name="description" placeholder="What will you be working on?" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Room Type</Label>
              <select 
                id="type" 
                name="type" 
                required
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="study">Study Session</option>
                <option value="quick-help">Quick Help</option>
                <option value="revision">Revision Sprint</option>
                <option value="coding">Coding Practice</option>
                <option value="build-together">Build Together</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input id="maxParticipants" name="maxParticipants" type="number" min="2" max="50" defaultValue="10" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" placeholder="e.g. React, Next.js, Frontend" />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create and Join Room
            </Button>
          </div>
        </form>
      </SurfaceCard>
    </div>
  );
}
