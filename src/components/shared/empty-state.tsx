import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 text-center",
        className
      )}
    >
      {/* Breathing icon with gradient ring */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-breathe blur-xl" />
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/60 border border-border/50">
          <Icon className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-base font-semibold mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">{description}</p>
      {action && <div className="animate-fade-in">{action}</div>}
    </div>
  );
}

