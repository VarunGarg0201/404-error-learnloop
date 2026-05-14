"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createHelpRequest } from "@/features/profile/actions";
import { HelpCircle, Loader2, Check, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Help Request Modal — Ask for help on a topic
   ═══════════════════════════════════════════════════════════ */

interface HelpRequestModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const URGENCY_OPTIONS = [
  { value: "low", label: "Low", icon: HelpCircle, color: "text-muted-foreground" },
  { value: "medium", label: "Medium", icon: Zap, color: "text-warning" },
  { value: "high", label: "High", icon: AlertTriangle, color: "text-destructive" },
];

export function HelpRequestModal({ isOpen, onOpenChange }: HelpRequestModalProps) {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || !subject.trim()) return;
    setSubmitting(true);
    const res = await createHelpRequest({ topic: topic.trim(), subject: subject.trim(), urgency });
    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        onOpenChange(false);
        setSubmitted(false);
        setTopic("");
        setSubject("");
        setUrgency("medium");
      }, 1500);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogTitle className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <HelpCircle className="w-4 h-4 text-primary" />
          </div>
          Ask for Help
        </DialogTitle>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-success" />
            </div>
            <p className="text-sm font-semibold">Help request posted!</p>
            <p className="text-[11px] text-muted-foreground">
              Peers with matching skills will be notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Subject / Topic
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Data Structures, React, Linear Algebra"
                className="w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                What do you need help with?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe your doubt or what you're stuck on..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Urgency</label>
              <div className="grid grid-cols-3 gap-2">
                {URGENCY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setUrgency(opt.value)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium border transition-all",
                        urgency === opt.value
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-card border-border/50 text-muted-foreground hover:border-border"
                      )}
                    >
                      <Icon className={cn("w-3 h-3", urgency === opt.value ? "text-primary" : opt.color)} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <Button type="submit" className="w-full gap-1.5" disabled={submitting || !topic.trim() || !subject.trim()}>
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <HelpCircle className="w-3.5 h-3.5" />}
              Post Help Request
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
