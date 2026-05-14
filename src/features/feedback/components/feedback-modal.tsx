"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextareaField } from "@/components/shared/inputs";
import { StarRating } from "./star-rating";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Sparkles, CheckCircle2 } from "lucide-react";
import type { SessionFeedback } from "@/types";

/* ═══════════════════════════════════════════════════════════
   Post-Session Feedback Modal
   ─────────────────────────────────────────────────────────
   Interactive multi-parameter feedback form.
   ═══════════════════════════════════════════════════════════ */

interface FeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  targetUser: { id: string; name: string; avatarUrl: string | null };
  sessionId: string;
}

const RATING_CATEGORIES = [
  { key: "overallSatisfaction", label: "Overall Experience", desc: "How would you rate this session overall?" },
  { key: "clarity", label: "Clarity", desc: "How clearly did they explain the concepts?" },
  { key: "helpfulness", label: "Helpfulness", desc: "Did this session resolve your questions?" },
  { key: "patience", label: "Patience", desc: "Did you feel rushed or well-supported?" },
  { key: "communicationQuality", label: "Communication", desc: "Was it easy to communicate with them?" },
  { key: "conceptUnderstanding", label: "Concept Improvement", desc: "How much better do you understand the topic now?" },
  { key: "beginnerFriendliness", label: "Beginner Friendly", desc: "Was the session tailored to your skill level?" },
] as const;

export function FeedbackModal({ isOpen, onOpenChange, targetUser, sessionId }: FeedbackModalProps) {
  const [step, setStep] = useState<"ratings" | "comment" | "success">("ratings");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [feedback, setFeedback] = useState<Omit<SessionFeedback, "comment" | "isFlagged">>({
    clarity: 0,
    helpfulness: 0,
    patience: 0,
    accuracy: 0, // Inferred or skipped in basic UI
    beginnerFriendliness: 0,
    communicationQuality: 0,
    conceptUnderstanding: 0,
    overallSatisfaction: 0,
  });
  
  const [comment, setComment] = useState("");

  const handleRatingChange = (key: keyof typeof feedback, value: number) => {
    setFeedback(prev => ({ ...prev, [key]: value }));
  };

  const isRatingsComplete = Object.entries(feedback).every(
    ([key, value]) => key === "accuracy" || value > 0
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Send to our backend reputation API
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: targetUser.id,
          sessionId,
          feedback: {
            ...feedback,
            accuracy: feedback.clarity, // fallback inference if hidden
            comment: comment || null,
          }
        }),
      });
      setStep("success");
    } catch (error) {
      console.error("Failed to submit feedback", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card border-border/40">
        
        {/* Header Section */}
        <div className="bg-muted/30 p-6 pb-4 border-b border-border/30">
          <DialogHeader className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Session Complete!</DialogTitle>
                <DialogDescription className="mt-1">
                  How was your experience learning with {targetUser.name}?
                </DialogDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-background p-3 rounded-xl border shadow-sm">
              <UserAvatar name={targetUser.name} src={targetUser.avatarUrl} size="md" />
              <div>
                <p className="text-sm font-semibold">{targetUser.name}</p>
                <p className="text-[11px] text-muted-foreground">Session Host</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Section */}
        <div className="p-6">
          {step === "ratings" && (
            <div className="space-y-5">
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 scrollbar-thin">
                {RATING_CATEGORIES.map(({ key, label, desc }) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                    <StarRating 
                      value={feedback[key]} 
                      onChange={(val) => handleRatingChange(key, val)} 
                      size={key === "overallSatisfaction" ? "lg" : "md"}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={() => setStep("comment")} 
                  disabled={!isRatingsComplete}
                  className="w-full sm:w-auto px-8 rounded-full"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === "comment" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Any specific feedback? (Optional)</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  This will be shown on their profile anonymously.
                </p>
                <TextareaField
                  placeholder="e.g., Great analogies, very patient with my questions!"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep("ratings")} className="text-xs">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="px-8 rounded-full"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-500">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4 text-success">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2">Thank you!</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Your feedback helps keep the LearnLoop community high quality.
              </p>
              <Button onClick={() => onOpenChange(false)} variant="secondary" className="px-8 rounded-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
