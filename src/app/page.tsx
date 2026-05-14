import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Users,
  MessageSquare,
  Sparkles,
  Brain,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 lg:px-6 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
              <Zap className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              LearnLoop
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 lg:px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            Built for students, by students
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
            Learn. Teach.{" "}
            <span className="text-gradient">Grow Together.</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            A collaborative learning ecosystem where students help each other
            grow through teaching, mentorship, and shared knowledge.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
            >
              Start learning
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "h-11 px-6"
              )}
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-20 border-t border-border/30">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Everything you need to learn better
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              A contribution-driven student intelligence network where knowledge
              becomes currency and collaboration becomes growth.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "AI Matching",
                description:
                  "Smart matching based on skills, goals, Learning DNA, and personality compatibility.",
              },
              {
                icon: Zap,
                title: "Knowledge Credits",
                description:
                  "Earn credits by teaching, helping, and collaborating. Your contribution is your currency.",
              },
              {
                icon: Brain,
                title: "Learning DNA",
                description:
                  "AI-inferred traits that improve matching, squad recommendations, and personalization.",
              },
              {
                icon: MessageSquare,
                title: "Study Rooms",
                description:
                  "Real-time collaborative spaces for quick help, revision, coding, and brainstorming.",
              },
              {
                icon: Users,
                title: "Learning Squads",
                description:
                  "Accountability groups with shared goals, streaks, and progress tracking.",
              },
              {
                icon: BookOpen,
                title: "Micro Teaching",
                description:
                  "Share mini lessons, quick recaps, and explanations. Turn learning into teaching.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card p-5 transition-all duration-200 hover:border-border hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 mb-3 transition-colors group-hover:bg-primary/15">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 border-t border-border/30">
        <div className="mx-auto max-w-2xl px-4 lg:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Ready to grow together?
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Join the collaborative learning ecosystem where every student is
            capable of helping, comfortable asking, and motivated to grow.
          </p>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-8")}
          >
            Get started free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/30 py-8">
        <div className="mx-auto max-w-6xl px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">
              LearnLoop — Learn. Teach. Grow Together.
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for students everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}
