import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mx-auto">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">404</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          This page doesn&apos;t exist. Maybe the study room ended, or the link
          was wrong.
        </p>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
