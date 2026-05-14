import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-card p-5 space-y-4 relative overflow-hidden",
        className
      )}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />

      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3.5 w-2/5 rounded-md" />
          <Skeleton className="h-3 w-1/4 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-3 w-full rounded-md" />
      <Skeleton className="h-3 w-3/4 rounded-md" />
    </div>
  );
}

interface LoadingPageProps {
  cards?: number;
  className?: string;
}

export function LoadingPage({ cards = 3, className }: LoadingPageProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Page header skeleton */}
      <div className="space-y-3 pb-2">
        <Skeleton className="h-7 w-44 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>
      {/* Card skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="relative w-9 h-9">
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-full bg-primary/15 animate-breathe blur-md" />
        {/* Track */}
        <div className="absolute inset-0 rounded-full border-2 border-muted/40" />
        {/* Spinner */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
    </div>
  );
}

