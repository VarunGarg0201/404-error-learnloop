"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/inputs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dna, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import type { LearningDNATrait } from "@/types";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Edit DNA Modal
   ─────────────────────────────────────────────────────────
   Allows users to toggle visibility of inferred traits and
   manually add self-assessed traits.
   ═══════════════════════════════════════════════════════════ */

interface EditDNAModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  traits: LearningDNATrait[];
  onSave: (updatedTraits: LearningDNATrait[]) => Promise<void>;
}

export function EditDNAModal({ isOpen, onOpenChange, traits, onSave }: EditDNAModalProps) {
  const [localTraits, setLocalTraits] = useState<LearningDNATrait[]>(traits);
  const [newTraitName, setNewTraitName] = useState("");
  const [newTraitCategory, setNewTraitCategory] = useState<"learning" | "teaching" | "social">("learning");
  const [isSaving, setIsSaving] = useState(false);

  // Toggle visibility
  const toggleVisibility = (id: string) => {
    setLocalTraits(prev => 
      prev.map(t => t.id === id ? { ...t, isVisible: !t.isVisible } : t)
    );
  };

  // Remove a self-assessed trait
  const removeTrait = (id: string) => {
    setLocalTraits(prev => prev.filter(t => t.id !== id));
  };

  // Add a new self-assessed trait
  const handleAddTrait = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraitName.trim()) return;

    const newTrait: LearningDNATrait = {
      id: `self_${crypto.randomUUID()}`,
      trait: newTraitName.trim(),
      category: newTraitCategory,
      confidence: 0.5, // Base confidence for self-assessed
      isVisible: true,
      isSelfAssessed: true,
    };

    setLocalTraits(prev => [newTrait, ...prev]);
    setNewTraitName("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(localTraits);
    setIsSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-card border-border/40">
        
        {/* Header Section */}
        <div className="bg-muted/30 p-6 pb-4 border-b border-border/30">
          <DialogHeader className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Dna className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Edit Learning DNA</DialogTitle>
                <DialogDescription className="mt-1">
                  Manage your AI-inferred traits or add custom self-assessed ones.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Section */}
        <div className="p-6 space-y-6">
          
          {/* Add Custom Trait */}
          <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Add Custom Trait
            </Label>
            <form onSubmit={handleAddTrait} className="flex gap-2">
              <InputField
                value={newTraitName}
                onChange={(e) => setNewTraitName(e.target.value)}
                placeholder="e.g. Visual Learner"
                className="flex-1 min-h-[40px]"
              />
              <select
                value={newTraitCategory}
                onChange={(e) => setNewTraitCategory(e.target.value as any)}
                className="h-10 rounded-lg border border-border/60 bg-input/30 px-3 text-sm text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="learning">Learning</option>
                <option value="teaching">Teaching</option>
                <option value="social">Social</option>
              </select>
              <Button type="submit" disabled={!newTraitName.trim()} className="h-10 px-4 shrink-0">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Custom traits begin at 50% confidence. Their score will evolve as peers validate them through session feedback.
            </p>
          </div>

          {/* Existing Traits List */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Traits
            </Label>
            <div className="max-h-[250px] overflow-y-auto pr-2 space-y-2 scrollbar-thin">
              {localTraits.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No traits discovered yet.</p>
              ) : (
                localTraits.map(trait => (
                  <div 
                    key={trait.id} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-colors",
                      trait.isVisible ? "bg-card border-border/40" : "bg-muted/30 border-dashed opacity-70"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{trait.trait}</span>
                        {trait.isSelfAssessed && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-warning/20 text-warning font-semibold">
                            Self-Assessed
                          </span>
                        )}
                        {!trait.isVisible && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-muted-foreground/20 text-muted-foreground font-semibold">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                        {trait.category} • {Math.round(trait.confidence * 100)}% Confidence
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 mr-2">
                        <Switch 
                          checked={trait.isVisible} 
                          onCheckedChange={() => toggleVisibility(trait.id)}
                          id={`visible-${trait.id}`}
                        />
                        <Label htmlFor={`visible-${trait.id}`} className="sr-only">Toggle visibility</Label>
                        {trait.isVisible ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      
                      {trait.isSelfAssessed && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 text-destructive hover:bg-destructive/10"
                          onClick={() => removeTrait(trait.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-border/30 gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="px-6">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
