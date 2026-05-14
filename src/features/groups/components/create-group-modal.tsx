"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField, TextareaField } from "@/components/shared/inputs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, BookOpen, Hash, Copy, Check, Link as LinkIcon, Loader2 } from "lucide-react";
import { createGroup } from "@/features/groups/actions";
import type { GroupType } from "@/types";

/* ═══════════════════════════════════════════════════════════
   Create Group Modal
   ─────────────────────────────────────────────────────────
   Premium multi-step modal for creating Squads or Communities.
   ═══════════════════════════════════════════════════════════ */

interface CreateGroupModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: GroupType;
}

export function CreateGroupModal({ isOpen, onOpenChange, defaultType = "squad" }: CreateGroupModalProps) {
  const router = useRouter();
  const [type, setType] = useState<GroupType>(defaultType);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success state
  const [createdGroup, setCreatedGroup] = useState<{ id: string; name: string; type: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const getShareLink = (id: string, groupType: string) => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/${groupType === "squad" ? "squads" : "communities"}/${id}`;
  };

  const handleCopy = () => {
    if (!createdGroup) return;
    navigator.clipboard.writeText(getShareLink(createdGroup.id, createdGroup.type));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tags = tagsStr.split(",").map(t => t.trim()).filter(Boolean);

    const res = await createGroup({
      type,
      name,
      description,
      tags,
      isPrivate,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setCreatedGroup({ id: res.data.id, name: res.data.name, type: res.data.type });
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset state on close
      setName("");
      setDescription("");
      setTagsStr("");
      setIsPrivate(false);
      setCreatedGroup(null);
      setCopied(false);
    }
    onOpenChange(open);
  };

  const handleGoToGroup = () => {
    if (createdGroup) {
      const path = createdGroup.type === "squad" ? "squads" : "communities";
      router.push(`/${path}/${createdGroup.id}`);
      handleClose(false);
    }
  };

  // ─── Success View ───
  if (createdGroup) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card border-border/40">
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10">
              <Check className="w-8 h-8 text-success" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold">{createdGroup.name}</h2>
              <p className="text-sm text-muted-foreground">
                Your {createdGroup.type === "squad" ? "squad" : "community"} is ready! Share the link to invite members.
              </p>
            </div>

            {/* Share Link */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/40">
              <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate flex-1 text-left">
                {getShareLink(createdGroup.id, createdGroup.type)}
              </span>
              <Button type="button" size="xs" variant="secondary" className="gap-1 shrink-0" onClick={handleCopy}>
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <Button variant="secondary" onClick={() => handleClose(false)}>
                Close
              </Button>
              <Button onClick={handleGoToGroup}>
                Open {createdGroup.type === "squad" ? "Squad" : "Community"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Create Form View ───
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card border-border/40">
        
        {/* Header Section */}
        <div className="bg-muted/30 p-6 pb-4 border-b border-border/30">
          <DialogHeader className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                {type === "squad" ? (
                  <Users className="w-5 h-5 text-primary" />
                ) : (
                  <BookOpen className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <DialogTitle>
                  Create a {type === "squad" ? "Squad" : "Community"}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {type === "squad" 
                    ? "Form a tight-knit study group focused on shared goals and accountability."
                    : "Build a large hub for a specific campus, subject, or interest."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Section */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Group Type Selector */}
          <div className="flex gap-2 p-1 bg-muted/30 rounded-xl border border-border/40">
            <Button
              type="button"
              variant={type === "squad" ? "secondary" : "ghost"}
              className="flex-1 rounded-lg"
              onClick={() => setType("squad")}
            >
              <Users className="w-4 h-4 mr-2" /> Squad
            </Button>
            <Button
              type="button"
              variant={type === "community" ? "secondary" : "ghost"}
              className="flex-1 rounded-lg"
              onClick={() => setType("community")}
            >
              <BookOpen className="w-4 h-4 mr-2" /> Community
            </Button>
          </div>

          <div className="space-y-4">
            <InputField
              label="Name"
              placeholder={type === "squad" ? "e.g., Midnight Coders" : "e.g., MIT Computer Science"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextareaField
              label="Description"
              placeholder="What is the purpose of this group?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
              required
            />

            <InputField
              label="Tags (comma separated)"
              icon={Hash}
              placeholder="React, Machine Learning, Exam Prep"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
            />

            <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20">
              <div className="space-y-0.5">
                <Label className="text-sm">Private Group</Label>
                <p className="text-[10px] text-muted-foreground">
                  {isPrivate
                    ? "Only people with the link can join."
                    : "Anyone can discover and join this group."}
                </p>
              </div>
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/30 gap-3">
            <Button type="button" variant="ghost" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !description.trim() || isSubmitting} className="px-6">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
