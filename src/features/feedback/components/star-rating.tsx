"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Star Rating Component
   ─────────────────────────────────────────────────────────
   Interactive star rating input for the feedback form.
   ═══════════════════════════════════════════════════════════ */

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function StarRating({ 
  value, 
  onChange, 
  max = 5, 
  size = "md",
  disabled = false 
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = (hoverValue ?? value) >= starValue;

        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            className={cn(
              "transition-all duration-200 focus:outline-none",
              disabled && "cursor-default opacity-50",
              !disabled && "hover:scale-110 active:scale-95"
            )}
            onMouseEnter={() => !disabled && setHoverValue(starValue)}
            onMouseLeave={() => !disabled && setHoverValue(null)}
            onClick={() => !disabled && onChange(starValue)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled 
                  ? "fill-warning text-warning drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" 
                  : "fill-transparent text-muted-foreground/30"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
