"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField, TextareaField } from "@/components/shared/inputs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, BookOpen, Hash } from "lucide-react";
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
  const [type, setType] = useState<GroupType>(defaultType);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API delay
    await new Promise(r => setTimeout(r, 1000));
    
    // In a real app, send to /api/groups
    // const tags = tagsStr.split(",").map(t => t.trim()).filter(Boolean);
    
    setIsSubmitting(false);
    onOpenChange(false);
    // router.push(`/squads/new-id`)
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                  If private, new members must be approved or invited.
                </p>
              </div>
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/30 gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting} className="px-6">
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
