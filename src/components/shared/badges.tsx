import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Badge System
   ─────────────────────────────────────────────────────────
   Semantic, icon-able, and activity-coded badges.
   ═══════════════════════════════════════════════════════════ */

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "outline"
  | "glow";

interface StatusBadgeProps {
  variant?: BadgeVariant;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md";
  dot?: boolean;
  pulse?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-muted text-muted-foreground border-transparent",
  primary:
    "bg-primary/10 text-primary border-primary/20",
  secondary:
    "bg-secondary text-secondary-foreground border-border/50",
  success:
    "bg-success/10 text-success border-success/20",
  warning:
    "bg-warning/10 text-warning border-warning/20",
  destructive:
    "bg-destructive/10 text-destructive border-destructive/20",
  info:
    "bg-info/10 text-info border-info/20",
  outline:
    "bg-transparent text-foreground border-border",
  glow:
    "bg-primary/10 text-primary border-primary/20 glow-primary-sm",
};

const sizeClasses = {
  xs: "text-[10px] px-1.5 py-0 h-4 gap-0.5",
  sm: "text-[11px] px-2 py-0.5 h-5 gap-1",
  md: "text-xs px-2.5 py-0.5 h-6 gap-1",
};

export function StatusBadge({
  variant = "default",
  icon: Icon,
  children,
  className,
  size = "sm",
  dot = false,
  pulse = false,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        "transition-colors duration-150",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "destructive" && "bg-destructive",
            variant === "primary" && "bg-primary",
            variant === "info" && "bg-info",
            variant === "default" && "bg-muted-foreground",
            pulse && "animate-pulse"
          )}
        />
      )}
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}

/* ─── Knowledge Credit Badge ─── */
interface KCBadgeProps {
  amount: number;
  className?: string;
}

export function KCBadge({ amount, className }: KCBadgeProps) {
  return (
    <StatusBadge
      variant="glow"
      size="sm"
      className={cn("font-semibold", className)}
    >
      ⚡ {amount} KC
    </StatusBadge>
  );
}

/* ─── Online Status Badge ─── */
export function OnlineBadge({ className }: { className?: string }) {
  return (
    <StatusBadge variant="success" size="xs" dot pulse className={className}>
      Online
    </StatusBadge>
  );
}

/* ─── Room Type Badge ─── */
interface RoomTypeBadgeProps {
  type: string;
  className?: string;
}

const roomTypeStyles: Record<string, BadgeVariant> = {
  "quick-help": "warning",
  "study": "primary",
  "revision": "info",
  "coding": "success",
  "build-together": "primary",
  "workshop": "info",
  "whiteboard": "secondary",
  "hackathon": "destructive",
};

export function RoomTypeBadge({ type, className }: RoomTypeBadgeProps) {
  const variant = roomTypeStyles[type] || "default";
  const label = type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <StatusBadge variant={variant} size="xs" className={className}>
      {label}
    </StatusBadge>
  );
}

/* ─── Skill Tag ─── */
interface SkillTagProps {
  skill: string;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function SkillTag({
  skill,
  removable,
  onRemove,
  className,
}: SkillTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-medium",
        "px-2 py-0.5 rounded-md",
        "bg-accent/60 text-accent-foreground border border-border/30",
        "transition-colors duration-150",
        removable && "pr-1 hover:bg-accent",
        className
      )}
    >
      {skill}
      {removable && (
        <button
          onClick={onRemove}
          className="flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
}
