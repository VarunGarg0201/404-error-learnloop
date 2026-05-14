"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  useOnboardingStore,
  TOTAL_STEPS,
} from "@/features/onboarding/store";
import { StepIdentity } from "@/features/onboarding/steps/step-identity";
import { StepEducation } from "@/features/onboarding/steps/step-education";
import { StepSkills } from "@/features/onboarding/steps/step-skills";
import { StepGoals } from "@/features/onboarding/steps/step-goals";
import { StepAvailability } from "@/features/onboarding/steps/step-availability";
import { completeOnboarding } from "@/features/onboarding/actions";
import { SurfaceCard } from "@/components/shared/cards";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════════════════
   Onboarding Flow Container
   ─────────────────────────────────────────────────────────
   Multi-step wizard with animated transitions,
   progress indicator, autosave, and completion.
   ═══════════════════════════════════════════════════════════ */

const STEP_LABELS = [
  "Identity",
  "Education",
  "Skills",
  "Goals",
  "Availability",
];

const AUTOSAVE_KEY = "learnloop-onboarding-draft";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export function OnboardingFlow() {
  const router = useRouter();
  const { step, data, nextStep, prevStep, updateData, setStep } =
    useOnboardingStore();
  const [direction, setDirection] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // ─── Autosave: Load on mount ───
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) updateData(parsed.data);
        if (parsed.step) setStep(parsed.step);
      }
    } catch {
      // Ignore parse errors
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Autosave: Persist on change ───
  useEffect(() => {
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ step, data }));
    } catch {
      // Ignore storage errors
    }
  }, [step, data]);

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      nextStep();
    }
  }

  function handleBack() {
    if (step > 1) {
      setDirection(-1);
      prevStep();
    }
  }

  // ─── Keyboard navigation ───
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore when user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "Enter" && canProceed()) {
        e.preventDefault();
        if (step < TOTAL_STEPS) handleNext();
        else handleComplete();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, data]);

  const handleComplete = useCallback(async () => {
    setSubmitting(true);
    try {
      // 1. Update Supabase Auth Metadata (for session/security)
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          display_name: data.displayName,
          username: data.username,
          avatar_url: data.avatarUrl,
          is_onboarded: true,
        },
      });

      // 2. Sync to Database (for matching engine and profiles)
      const res = await completeOnboarding({
        displayName: data.displayName,
        username: data.username,
        avatarUrl: data.avatarUrl ?? undefined,
        campus: data.school, // Mapping school -> campus
        stream: data.stream,
        year: data.year,
        skillsToTeach: data.skillsToTeach,
        skillsToLearn: data.skillsToLearn,
        goals: data.goals,
        learningStyle: data.learningStyle,
        availability: data.availability,
        preferredLanguage: data.preferredLanguage,
      });

      if (!res.success) {
        console.error("Onboarding save error:", res.error);
        setSubmitting(false);
        return;
      }

      localStorage.removeItem(AUTOSAVE_KEY);
      setCompleted(true);

      // Redirect after celebration
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } catch (err) {
      console.error("Onboarding error:", err);
      setSubmitting(false);
    }
  }, [data, router]);

  // ─── Completion Screen ───
  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              delay: 0.2,
            }}
            className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto glow-primary"
          >
            <Sparkles className="w-7 h-7 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight">
            You&apos;re all set! 🎉
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Your learning profile is ready. Taking you to the dashboard...
          </p>
          <div className="flex justify-center pt-2">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Step validation ───
  function canProceed(): boolean {
    switch (step) {
      case 1:
        return data.displayName.trim().length >= 2 && data.username.trim().length >= 2;
      case 2:
        return data.school.trim().length >= 2;
      case 3:
        return data.skillsToTeach.length > 0 || data.skillsToLearn.length > 0;
      case 4:
        return data.goals.length > 0;
      case 5:
        return data.availability.length > 0;
      default:
        return true;
    }
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/4 blur-3xl pointer-events-none" />

      {/* Top bar with progress */}
      <header className="relative z-10 flex items-center justify-between h-14 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <Zap className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-semibold text-sm tracking-tight">
            LearnLoop
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Step {step} of {TOTAL_STEPS}
        </span>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 px-4 sm:px-6 pb-2">
        <div className="mx-auto max-w-lg">
          {/* Segmented progress */}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full overflow-hidden bg-muted/60"
              >
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: i < step ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            ))}
          </div>

          {/* Step labels (desktop) */}
          <div className="hidden sm:flex justify-between mt-2 px-0.5">
            {STEP_LABELS.map((label, i) => (
              <span
                key={label}
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  i < step
                    ? "text-primary"
                    : i === step - 1
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-start sm:items-center justify-center px-4 pb-24 pt-4 sm:pt-0">
        <div className="w-full max-w-lg">
          <SurfaceCard padding="lg">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {step === 1 && <StepIdentity />}
                {step === 2 && <StepEducation />}
                {step === 3 && <StepSkills />}
                {step === 4 && <StepGoals />}
                {step === 5 && <StepAvailability />}
              </motion.div>
            </AnimatePresence>
          </SurfaceCard>
        </div>
      </main>

      {/* Bottom navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-xl border-t border-border/50">
        <div className="mx-auto max-w-lg flex items-center justify-between px-4 sm:px-6 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === step - 1
                    ? "w-5 h-1.5 bg-primary"
                    : i < step - 1
                    ? "w-1.5 h-1.5 bg-primary/50"
                    : "w-1.5 h-1.5 bg-muted-foreground/25"
                )}
              />
            ))}
          </div>

          {step < TOTAL_STEPS ? (
            <Button
              size="sm"
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-1.5"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={!canProceed() || submitting}
              className="gap-1.5"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete
                  <Check className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
