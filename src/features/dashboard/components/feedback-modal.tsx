"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/features/profile/actions";
import { Star, Loader2, Check, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Session Feedback Modal
   ─────────────────────────────────────────────────────────
   Structured feedback: Clarity, Helpfulness, Patience,
   Accuracy, Beginner Friendliness, Communication,
   Concept Understanding, Overall Satisfaction
   ═══════════════════════════════════════════════════════════ */

interface FeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: string;
  receiverName: string;
}

const CATEGORIES = [
  { key: "clarity", label: "Clarity" },
  { key: "helpfulness", label: "Helpfulness" },
  { key: "patience", label: "Patience" },
  { key: "accuracy", label: "Accuracy" },
  { key: "beginnerFriendliness", label: "Beginner Friendliness" },
  { key: "communicationQuality", label: "Communication" },
  { key: "conceptUnderstanding", label: "Concept Understanding" },
  { key: "overallSatisfaction", label: "Overall Satisfaction" },
] as const;

function RatingSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium">{label}</span>
        <span className="text-[11px] font-bold tabular-nums text-primary">{value}/10</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={cn(
              "flex-1 h-2.5 rounded-full transition-colors",
              i < value ? "bg-primary" : "bg-muted/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function FeedbackModal({ isOpen, onOpenChange, receiverId, receiverName }: FeedbackModalProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({
    clarity: 7,
    helpfulness: 7,
    patience: 7,
    accuracy: 7,
    beginnerFriendliness: 7,
    communicationQuality: 7,
    conceptUnderstanding: 7,
    overallSatisfaction: 7,
  });
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await submitFeedback({
      receiverId,
      clarity: ratings.clarity,
      helpfulness: ratings.helpfulness,
      patience: ratings.patience,
      accuracy: ratings.accuracy,
      beginnerFriendliness: ratings.beginnerFriendliness,
      communicationQuality: ratings.communicationQuality,
      conceptUnderstanding: ratings.conceptUnderstanding,
      overallSatisfaction: ratings.overallSatisfaction,
      comment: comment.trim() || undefined,
    });
    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        onOpenChange(false);
        setSubmitted(false);
      }, 2000);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/10">
            <Star className="w-4 h-4 text-warning" />
          </div>
          Rate your session with {receiverName}
        </DialogTitle>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-success" />
            </div>
            <p className="text-sm font-semibold">Feedback submitted!</p>
            <p className="text-[11px] text-muted-foreground">
              You earned 5 KC and {receiverName} earned 10 KC.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            {CATEGORIES.map(({ key, label }) => (
              <RatingSlider
                key={key}
                label={label}
                value={ratings[key]}
                onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))}
              />
            ))}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none"
              />
            </div>
            <Button type="submit" className="w-full gap-1.5" disabled={submitting}>
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className="w-3.5 h-3.5" />}
              Submit Feedback
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
