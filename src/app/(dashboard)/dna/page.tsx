"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getDNATraits, toggleTraitVisibility, addDNATrait } from "@/features/dna/actions";
import {
  Brain,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Sparkles,
  RefreshCw,
  Shield,
  BookOpen,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Learning DNA Page — Full DNA visualization & management
   ═══════════════════════════════════════════════════════════ */

type DNATrait = {
  id: string;
  trait: string;
  confidence: number;
  category: string;
  isVisible: boolean;
  isSelfAssessed: boolean;
};

const CATEGORY_META: Record<string, { icon: typeof Brain; color: string; bg: string; label: string }> = {
  learning: { icon: BookOpen, color: "text-primary", bg: "bg-primary/10", label: "Learning" },
  teaching: { icon: Sparkles, color: "text-warning", bg: "bg-warning/10", label: "Teaching" },
  social: { icon: Users, color: "text-success", bg: "bg-success/10", label: "Social" },
};

const TRAIT_SUGGESTIONS = [
  { trait: "Visual Learner", category: "learning" },
  { trait: "Deep Explainer", category: "teaching" },
  { trait: "Beginner-Friendly Teacher", category: "teaching" },
  { trait: "Collaborative Thinker", category: "social" },
  { trait: "Night Learner", category: "learning" },
  { trait: "Fast Reviser", category: "learning" },
  { trait: "Problem Solver", category: "learning" },
  { trait: "Community Mentor", category: "social" },
  { trait: "Patient Explainer", category: "teaching" },
  { trait: "Active Listener", category: "social" },
  { trait: "Conceptual Thinker", category: "learning" },
  { trait: "Hands-on Builder", category: "learning" },
];

function TraitCard({ trait, onToggle }: { trait: DNATrait; onToggle: (id: string) => void }) {
  const meta = CATEGORY_META[trait.category] || CATEGORY_META.learning;
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-200",
        trait.isVisible
          ? "border-border/50 bg-card hover:border-border/80"
          : "border-border/20 bg-card/50 opacity-60"
      )}
    >
      <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", meta.bg)}>
        <Icon className={cn("w-4 h-4", meta.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{trait.trait}</p>
          {trait.isSelfAssessed && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
              Self-assessed
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">{meta.label} trait</p>

        {/* Confidence bar */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Confidence</span>
            <span className="text-[10px] font-semibold tabular-nums">{Math.round(trait.confidence * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", meta.bg.replace("/10", "/60"))}
              style={{ width: `${Math.round(trait.confidence * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visibility toggle */}
      <button
        onClick={() => onToggle(trait.id)}
        className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        title={trait.isVisible ? "Hide trait" : "Show trait"}
      >
        {trait.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default function DNAPage() {
  const [traits, setTraits] = useState<DNATrait[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await getDNATraits();
    if (res.data) setTraits(res.data as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleToggle(id: string) {
    const trait = traits.find((t) => t.id === id);
    if (!trait) return;
    setTraits((prev) => prev.map((t) => t.id === id ? { ...t, isVisible: !t.isVisible } : t));
    await toggleTraitVisibility(id, !trait.isVisible);
  }

  async function handleAddTrait(suggestion: { trait: string; category: string }) {
    if (traits.some((t) => t.trait === suggestion.trait)) return;
    setSubmitting(true);
    const res = await addDNATrait(suggestion.trait, suggestion.category);
    if (res.success) {
      await load();
    }
    setSubmitting(false);
    setAdding(false);
  }

  const grouped = {
    learning: traits.filter((t) => t.category === "learning"),
    teaching: traits.filter((t) => t.category === "teaching"),
    social: traits.filter((t) => t.category === "social"),
  };

  const available = TRAIT_SUGGESTIONS.filter((s) => !traits.some((t) => t.trait === s.trait));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning DNA"
        description="Your unique learning identity, shaped by how you learn, teach, and collaborate."
      >
        <Button size="sm" variant="secondary" className="gap-1.5 text-xs" onClick={() => setAdding(!adding)}>
          {adding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {adding ? "Cancel" : "Add Trait"}
        </Button>
      </PageHeader>

      {/* DNA Explanation */}
      <SurfaceCard className="flex items-start gap-3 bg-primary/[0.03] border-primary/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0 mt-0.5">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-[13px] font-semibold mb-0.5">How DNA works</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Your Learning DNA is built from your behavior — sessions, feedback, teaching, and collaboration patterns.
            It improves your AI matches, squad recommendations, and personalized content. You can self-assess traits
            or let the system infer them over time.
          </p>
        </div>
      </SurfaceCard>

      {/* Add Trait Panel */}
      {adding && (
        <SurfaceCard>
          <h3 className="text-sm font-semibold mb-3">Add a Trait</h3>
          <p className="text-[11px] text-muted-foreground mb-3">
            Select a trait that describes your learning style. These will be marked as self-assessed.
          </p>
          <div className="flex flex-wrap gap-2">
            {available.map((s) => {
              const meta = CATEGORY_META[s.category] || CATEGORY_META.learning;
              return (
                <button
                  key={s.trait}
                  disabled={submitting}
                  onClick={() => handleAddTrait(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    "bg-card border-border/50 text-muted-foreground",
                    "hover:border-primary/30 hover:text-primary hover:bg-primary/5",
                    submitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {s.trait}
                </button>
              );
            })}
            {available.length === 0 && (
              <p className="text-[11px] text-muted-foreground">All available traits have been added.</p>
            )}
          </div>
        </SurfaceCard>
      )}

      {/* Trait Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : traits.length > 0 ? (
        <div className="space-y-6">
          {(Object.entries(grouped) as [string, DNATrait[]][]).map(([cat, items]) => {
            if (items.length === 0) return null;
            const meta = CATEGORY_META[cat] || CATEGORY_META.learning;
            return (
              <div key={cat}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <meta.icon className={cn("w-3.5 h-3.5", meta.color)} />
                  {meta.label} Traits ({items.length})
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((trait) => (
                    <TraitCard key={trait.id} trait={trait} onToggle={handleToggle} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Brain}
          title="No DNA traits yet"
          description="Complete sessions, give feedback, and teach others to build your Learning DNA."
          action={
            <Button size="sm" variant="secondary" onClick={() => setAdding(true)} className="gap-1">
              <Plus className="w-3 h-3" />
              Self-assess traits
            </Button>
          }
        />
      )}
    </div>
  );
}
