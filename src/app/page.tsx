import Link from "next/link";
import {
  Zap, Users, MessageSquare, Sparkles, Brain, BookOpen,
  ArrowRight, Star, Shield, Target, Flame, Globe, Award,
  ChevronRight, CheckCircle2, Quote,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Landing Page — Premium Startup Quality
   ═══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <LogoBar />
      <Problem />
      <Solution />
      <FeatureAIMatching />
      <FeatureKC />
      <FeatureDNA />
      <FeatureRooms />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ─────────────────────── NAVBAR ─────────────────────── */
function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/40">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-sm tracking-tight">LearnLoop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13px] text-muted-foreground">
          {["Features", "How it works", "Community"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
               className="hover:text-foreground transition-colors">{item}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Sign in
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────── HERO ─────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <div className="absolute top-[100px] -left-[200px] w-[500px] h-[500px] rounded-full bg-info/4 blur-[100px] pointer-events-none" />
      <div className="absolute top-[200px] -right-[200px] w-[400px] h-[400px] rounded-full bg-chart-4/4 blur-[100px] pointer-events-none" />
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 lg:px-6 pt-28 sm:pt-36 pb-24 sm:pb-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          AI-powered collaborative learning
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6 animate-slide-up">
          Learn. Teach.{" "}
          <span className="text-gradient">Grow Together.</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "80ms" }}>
          The collaborative learning ecosystem where students help each other
          grow through AI-matched study sessions, shared knowledge, and
          real accountability.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: "160ms" }}>
          <Link href="/register"
            className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base rounded-xl gap-2 glow-primary-sm")}>
            Start learning free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="#how-it-works"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-8 text-base rounded-xl")}>
            See how it works
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mt-12 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span>2,400+ students</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-warning text-warning" />
            ))}
            <span className="ml-1">4.9/5 rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── LOGO BAR ─────────────────────── */
function LogoBar() {
  const universities = ["MIT", "Stanford", "IIT Delhi", "Oxford", "UCL", "NUS"];
  return (
    <section className="py-8 border-y border-border/30">
      <div className="mx-auto max-w-5xl px-4 lg:px-6">
        <p className="text-[11px] text-muted-foreground/60 text-center uppercase tracking-widest mb-5">
          Trusted by students from
        </p>
        <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
          {universities.map((u) => (
            <span key={u} className="text-sm font-semibold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors">
              {u}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── PROBLEM ─────────────────────── */
function Problem() {
  const pains = [
    { icon: Users, text: "Studying alone with no one to ask" },
    { icon: Target, text: "No accountability for learning goals" },
    { icon: Globe, text: "Can't find the right study partner" },
  ];
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 lg:px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-destructive/80 mb-3">The problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Learning shouldn&apos;t feel lonely
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Most students struggle in isolation. The right help exists — it&apos;s just impossible to find.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {pains.map(({ icon: Icon, text }) => (
            <div key={text} className="relative group rounded-2xl border border-border/40 bg-card p-6 text-center hover:border-destructive/20 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-destructive/8 mx-auto mb-4">
                <Icon className="w-5 h-5 text-destructive/70" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── SOLUTION ─────────────────────── */
function Solution() {
  const steps = [
    { num: "01", title: "Share what you know", desc: "List your skills, goals, and learning style to build your profile." },
    { num: "02", title: "Get matched by AI", desc: "Our algorithm finds the perfect study partners based on your Learning DNA." },
    { num: "03", title: "Learn & earn together", desc: "Collaborate in study rooms, earn Knowledge Credits, and grow your reputation." },
  ];
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-5xl px-4 lg:px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Three steps to{" "}<span className="text-gradient">better learning</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="relative group">
              <span className="text-5xl font-black text-primary/8 group-hover:text-primary/15 transition-colors">{num}</span>
              <h3 className="text-lg font-semibold mt-2 mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Shared Feature Section Shell ─── */
function FeatureSection({ id, badge, badgeIcon: BadgeIcon, title, titleGradient, description, children, reverse = false }: {
  id?: string; badge: string; badgeIcon: typeof Sparkles; title: string; titleGradient: string;
  description: string; children: React.ReactNode; reverse?: boolean;
}) {
  return (
    <section id={id} className="py-24 sm:py-32">
      <div className={cn("mx-auto max-w-6xl px-4 lg:px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center", reverse && "lg:[direction:rtl] lg:*:[direction:ltr]")}>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-5">
            <BadgeIcon className="w-3.5 h-3.5" /> {badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight">
            {title} <span className="text-gradient">{titleGradient}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>
          {children}
        </div>
        <FeatureVisual />
      </div>
    </section>
  );
}

function FeatureVisual() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl" />
      <div className="relative rounded-2xl border border-border/40 bg-card p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/6 rounded-full blur-2xl" />
        <div className="space-y-3">
          {[85, 60, 45, 70].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted/60 shrink-0" />
              <div className="h-2.5 rounded-full bg-muted/40" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── FEATURE: AI MATCHING ─────────────────────── */
function FeatureAIMatching() {
  const points = [
    "Multi-dimensional compatibility scoring",
    "Skills, goals, DNA & personality matching",
    "Real-time availability awareness",
  ];
  return (
    <FeatureSection id="features" badge="AI Matching" badgeIcon={Sparkles}
      title="Find your perfect" titleGradient="study partner"
      description="Our AI analyzes your skills, goals, learning style, and availability to surface the most compatible peers — not random matches, real connections.">
      <ul className="space-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span className="text-muted-foreground">{p}</span>
          </li>
        ))}
      </ul>
    </FeatureSection>
  );
}

/* ─────────────────────── FEATURE: KNOWLEDGE CREDITS ─────────────────────── */
function FeatureKC() {
  const stats = [
    { val: "12K+", label: "Credits earned" },
    { val: "3.2K", label: "Sessions completed" },
    { val: "98%", label: "Satisfaction rate" },
  ];
  return (
    <FeatureSection badge="Knowledge Credits" badgeIcon={Zap} reverse
      title="Your knowledge is" titleGradient="your currency"
      description="Earn credits by teaching, helping, and collaborating. Spend them to get help when you need it. A fair, merit-based economy that rewards contribution.">
      <div className="grid grid-cols-3 gap-4 mt-2">
        {stats.map(({ val, label }) => (
          <div key={label} className="text-center p-3 rounded-xl bg-muted/30 border border-border/30">
            <p className="text-xl font-bold text-gradient">{val}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}

/* ─────────────────────── FEATURE: LEARNING DNA ─────────────────────── */
function FeatureDNA() {
  const traits = ["Visual Learner", "Patient Explainer", "Night Owl", "Collaborative"];
  return (
    <FeatureSection badge="Learning DNA" badgeIcon={Brain}
      title="Your unique" titleGradient="learning fingerprint"
      description="AI analyzes your sessions to build a dynamic profile of how you learn, teach, and collaborate — making every future match smarter.">
      <div className="flex flex-wrap gap-2 mt-1">
        {traits.map((t) => (
          <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/15">
            🧬 {t}
          </span>
        ))}
      </div>
    </FeatureSection>
  );
}

/* ─────────────────────── FEATURE: STUDY ROOMS ─────────────────────── */
function FeatureRooms() {
  const features = ["Real-time chat & voice", "Collaborative notes", "Session timer & focus mode", "AI-generated summaries"];
  return (
    <FeatureSection badge="Study Rooms" badgeIcon={MessageSquare} reverse
      title="Collaborate in" titleGradient="real time"
      description="Jump into focused study rooms with video, chat, shared notes, and an AI assistant that keeps track of everything discussed.">
      <div className="grid grid-cols-2 gap-3 mt-1">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
            {f}
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}

/* ─────────────────────── TESTIMONIALS ─────────────────────── */
function Testimonials() {
  const reviews = [
    { name: "Priya S.", role: "CS Major, IIT Delhi", text: "LearnLoop matched me with a partner who explained recursion better than any lecture. My grades went up a full letter.", stars: 5 },
    { name: "James K.", role: "Pre-Med, UCL", text: "The Knowledge Credits system is genius. Teaching others forced me to truly understand the material. Best study hack ever.", stars: 5 },
    { name: "Sofia M.", role: "Engineering, Stanford", text: "Our learning squad held me accountable for the entire finals season. I've never been this consistent.", stars: 5 },
  ];
  return (
    <section id="community" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Community</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Loved by <span className="text-gradient">students everywhere</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border/40 bg-card p-6 flex flex-col hover:border-border/60 transition-colors">
              <Quote className="w-5 h-5 text-primary/30 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">{r.role}</p>
                </div>
                <div className="flex ml-auto gap-0.5">
                  {[...Array(r.stars)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── FINAL CTA ─────────────────────── */
function FinalCTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-10 sm:p-16 text-center">
          {/* Ambient blobs */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-info/6 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mx-auto mb-6">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to grow together?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Join thousands of students who are learning faster, teaching better,
              and building real academic communities.
            </p>
            <Link href="/register"
              className={cn(buttonVariants({ size: "lg" }), "h-12 px-10 text-base rounded-xl gap-2 glow-primary")}>
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[11px] text-muted-foreground mt-4">No credit card required · Free forever for students</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── FOOTER ─────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border/30 py-10">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
              <Zap className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold">LearnLoop</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
