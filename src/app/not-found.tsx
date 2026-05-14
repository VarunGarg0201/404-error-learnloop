import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Zap, LayoutDashboard, MessageSquare, Users, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Ambient effects */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[200px] h-[200px] rounded-full bg-info/4 blur-3xl pointer-events-none" />

      <div className="relative text-center space-y-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mx-auto">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            This page doesn&apos;t exist. Maybe the study room ended, or the
            link was wrong.
          </p>
        </div>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Back to dashboard
        </Link>

        {/* Quick links */}
        <div className="pt-4 border-t border-border/30 mt-6">
          <p className="text-[11px] text-muted-foreground mb-3">
            Or try one of these:
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { href: "/discover", label: "Discover", icon: Compass },
              { href: "/rooms", label: "Rooms", icon: MessageSquare },
              { href: "/squads", label: "Squads", icon: Users },
            ].map(({ href, label, icon: NavIcon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  buttonVariants({ size: "xs", variant: "secondary" }),
                  "gap-1"
                )}
              >
                <NavIcon className="w-3 h-3" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
