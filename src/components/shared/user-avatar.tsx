import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showOnline?: boolean;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function UserAvatar({
  src,
  name,
  size = "sm",
  className,
  showOnline,
}: UserAvatarProps) {
  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src || undefined} alt={name || "User"} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {showOnline && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 block rounded-full bg-emerald-500 ring-2 ring-background",
            size === "xs" ? "w-2 h-2" : "w-2.5 h-2.5"
          )}
        />
      )}
    </div>
  );
}
