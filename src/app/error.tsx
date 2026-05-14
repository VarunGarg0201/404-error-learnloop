"use client";

import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-8 border border-destructive/20 bg-destructive/5 rounded-2xl space-y-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-8 h-8" />
          <h2 className="text-2xl font-bold tracking-tight">Client-Side Crash Detected</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          A React component threw an error during rendering or hydration.
        </p>
        <div className="bg-background/50 p-4 rounded-xl overflow-auto text-xs font-mono border border-border/40">
          <p className="font-bold text-destructive mb-2">{error.message}</p>
          <pre className="text-muted-foreground whitespace-pre-wrap">{error.stack}</pre>
        </div>
        <button
          onClick={() => reset()}
          className={cn(buttonVariants(), "w-full")}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
