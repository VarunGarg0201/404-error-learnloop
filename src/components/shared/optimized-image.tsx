"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Optimized Image Wrapper
   ─────────────────────────────────────────────────────────
   Uses next/image with blur placeholder and lazy loading.
   Handles loading and error states gracefully.
   ═══════════════════════════════════════════════════════════ */

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
}

export function OptimizedImage({
  fallbackSrc,
  className,
  containerClassName,
  alt,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {isLoading && (
        <div className="absolute inset-0 animate-shimmer rounded-inherit" />
      )}
      <Image
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...(hasError && fallbackSrc ? { src: fallbackSrc } : {})}
        {...props}
      />
    </div>
  );
}
