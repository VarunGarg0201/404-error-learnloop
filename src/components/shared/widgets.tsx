"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon, ArrowRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/shared/cards";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Dashboard Widgets
   ─────────────────────────────────────────────────────────
   Modular widget system for the dashboard grid.
   ═══════════════════════════════════════════════════════════ */

/* ─── Widget Container ─── */
interface WidgetProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: { label: string; onClick: () => void };
  moreMenu?: boolean;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Widget({
  title,
  description,
  icon: Icon,
  action,
  moreMenu,
  children,
  className,
  noPadding = false,
}: WidgetProps) {
  return (
    <SurfaceCard padding={noPadding ? "none" : "md"} className={cn("space-y-0", className)}>
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between",
          noPadding ? "px-4 pt-4 pb-3" : "pb-3"
        )}
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 shrink-0">
              <Icon className="w-3.5 h-3.5 text-primary" />
            </div>
          )}
          <div>
            <h3 className="text-[13px] font-semibold leading-tight">{title}</h3>
            {description && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {action && (
            <Button
              variant="ghost"
              size="xs"
              onClick={action.onClick}
              className="text-muted-foreground hover:text-primary text-[11px] gap-1"
            >
              {action.label}
              <ArrowRight className="w-3 h-3" />
            </Button>
          )}
          {moreMenu && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {children}
    </SurfaceCard>
  );
}

/* ─── Progress Widget ─── */
interface ProgressWidgetProps {
  label: string;
  value: number; // 0-100
  description?: string;
  color?: "primary" | "success" | "warning" | "info";
  className?: string;
}

const progressColors = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
};

export function ProgressWidget({
  label,
  value,
  description,
  color = "primary",
  className,
}: ProgressWidgetProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{value}%</p>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            progressColors[color]
          )}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {description && (
        <p className="text-[10px] text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/* ─── Streak Widget ─── */
interface StreakWidgetProps {
  days: number;
  maxDays?: number;
  className?: string;
}

export function StreakWidget({
  days,
  maxDays = 7,
  className,
}: StreakWidgetProps) {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium">Weekly streak</p>
        <p className="text-xs font-semibold text-primary">{days} days</p>
      </div>
      <div className="flex items-center gap-1.5">
        {weekDays.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-full aspect-square rounded-md transition-colors duration-200",
                i < days ? "bg-primary/80" : "bg-muted/60"
              )}
            />
            <span className="text-[9px] text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Quick Action Button ─── */
interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

export function QuickAction({
  icon: Icon,
  label,
  description,
  onClick,
  className,
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left",
        "transition-all duration-150 ease-out",
        "hover:bg-accent/60 active:scale-[0.99]",
        "group",
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-[11px] text-muted-foreground truncate">
            {description}
          </p>
        )}
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
