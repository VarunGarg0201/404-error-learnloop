"use client";

import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 h-[50vh] space-y-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-6 h-6" />
        <h2 className="text-xl font-bold">Dashboard component crashed</h2>
      </div>
      <div className="bg-destructive/10 p-4 rounded-xl text-xs font-mono max-w-2xl overflow-auto w-full border border-destructive/20">
        <p className="font-bold mb-1 text-destructive">{error.message}</p>
        <pre className="text-muted-foreground whitespace-pre-wrap">{error.stack}</pre>
      </div>
      <button onClick={() => reset()} className={cn(buttonVariants({ variant: "outline" }))}>
        Try again
      </button>
    </div>
  );
}
