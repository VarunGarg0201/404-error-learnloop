import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Card System
   ─────────────────────────────────────────────────────────
   Base primitives for all card variants across the app.
   ═══════════════════════════════════════════════════════════ */

/* ─── Base Surface Card ─── */
interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5 sm:p-6",
};

export function SurfaceCard({
  children,
  className,
  hover = false,
  glow = false,
  glass = false,
  padding = "md",
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-card",
        paddingMap[padding],
        "transition-all duration-200 ease-out",
        hover &&
          "hover:border-border hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        glow && "glow-primary-sm",
        glass && "glass-card",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Stat Card ─── */
interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
  accent?: "primary" | "success" | "warning" | "info";
}

const accentBg = {
  primary: "bg-primary/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  info: "bg-info/10",
};

export function StatCard({
  label,
  value,
  description,
  icon,
  trend,
  className,
  accent = "primary",
}: StatCardProps) {
  return (
    <SurfaceCard className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg",
              accentBg[accent]
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold tracking-tight animate-count-up">
          {value}
        </p>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium pb-0.5",
              trend.positive ? "text-success" : "text-destructive"
            )}
          >
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {description && (
        <p className="text-[11px] text-muted-foreground">{description}</p>
      )}
    </SurfaceCard>
  );
}

/* ─── Feature Card (dashboard widgets) ─── */
interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon,
  children,
  headerAction,
  className,
  noPadding = false,
}: FeatureCardProps) {
  return (
    <SurfaceCard
      padding={noPadding ? "none" : "md"}
      className={cn("space-y-0", className)}
    >
      <div
        className={cn(
          "flex items-start justify-between",
          noPadding ? "px-4 pt-4 pb-3" : "pb-3"
        )}
      >
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            {description && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        {headerAction}
      </div>
      {children}
    </SurfaceCard>
  );
}

/* ─── Profile Card ─── */
interface ProfileCardProps {
  name: string;
  subtitle: string;
  avatarSlot: React.ReactNode;
  badges?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function ProfileCard({
  name,
  subtitle,
  avatarSlot,
  badges,
  action,
  className,
}: ProfileCardProps) {
  return (
    <SurfaceCard hover className={className}>
      <div className="flex items-center gap-3">
        {avatarSlot}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{name}</p>
          <p className="text-[11px] text-muted-foreground truncate">
            {subtitle}
          </p>
          {badges && <div className="flex flex-wrap gap-1.5 mt-1.5">{badges}</div>}
        </div>
        {action}
      </div>
    </SurfaceCard>
  );
}

/* ─── Activity Card ─── */
interface ActivityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  timestamp: string;
  className?: string;
}

export function ActivityCard({
  icon: Icon,
  title,
  description,
  timestamp,
  className,
}: ActivityCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg",
        "transition-colors duration-150 hover:bg-accent/40",
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
          {description}
        </p>
      </div>
      <p className="text-[10px] text-muted-foreground whitespace-nowrap pt-0.5">
        {timestamp}
      </p>
    </div>
  );
}

/* ─── Notification Card ─── */
interface NotificationCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  className?: string;
}

export function NotificationCard({
  icon: Icon,
  title,
  body,
  timestamp,
  isRead,
  className,
}: NotificationCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg cursor-pointer",
        "transition-colors duration-150",
        isRead ? "hover:bg-accent/40" : "bg-primary/5 hover:bg-primary/8",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5",
          isRead ? "bg-muted" : "bg-primary/10"
        )}
      >
        <Icon
          className={cn(
            "w-3.5 h-3.5",
            isRead ? "text-muted-foreground" : "text-primary"
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-sm truncate",
              isRead ? "font-medium" : "font-semibold"
            )}
          >
            {title}
          </p>
          {!isRead && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
          {body}
        </p>
      </div>
      <p className="text-[10px] text-muted-foreground whitespace-nowrap pt-0.5">
        {timestamp}
      </p>
    </div>
  );
}
