"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createGroup } from "@/features/groups/actions";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewCommunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      type: "community" as const,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
    };

    const res = await createGroup(data);
    setLoading(false);

    if (res.success && res.data) {
      toast.success("Community created!");
      router.push(`/communities/${res.data.id}`);
    } else {
      toast.error(res.error || "Failed to create community");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/dashboard"
          className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-2 -ml-2 text-muted-foreground" })}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to dashboard
        </Link>
        <PageHeader 
          title="Start a Community" 
          description="Create a massive space for campus students or specific skill groups."
        />
      </div>

      <SurfaceCard padding="lg">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input id="name" name="name" placeholder="e.g. IIT Delhi Coders, Frontend Mastery" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">About</Label>
            <Textarea id="description" name="description" placeholder="What is this community about?" rows={3} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" placeholder="e.g. Web Dev, Campus Hub, React" />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Community
            </Button>
          </div>
        </form>
      </SurfaceCard>
    </div>
  );
}
