"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRoomStore } from "@/features/rooms/store";
import { SurfaceCard } from "@/components/shared/cards";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Session Timer
   ─────────────────────────────────────────────────────────
   Synchronized Pomodoro timer.
   ═══════════════════════════════════════════════════════════ */

interface SessionTimerProps {
  onTimerAction: (action: "start" | "pause" | "reset", newDuration?: number) => void;
  className?: string;
  isHost?: boolean;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function SessionTimer({ onTimerAction, className, isHost = false }: SessionTimerProps) {
  const timerState = useRoomStore((state) => state.sharedState?.timer);
  const [displaySeconds, setDisplaySeconds] = useState(25 * 60);

  // Sync local display with shared state, calculating elapsed time if running
  useEffect(() => {
    if (!timerState) return;

    if (timerState.isRunning && timerState.lastStartedAt) {
      const now = Date.now();
      const started = new Date(timerState.lastStartedAt).getTime();
      const elapsed = Math.floor((now - started) / 1000);
      const remaining = Math.max(0, timerState.remainingSeconds - elapsed);
      setDisplaySeconds(remaining);
    } else {
      setDisplaySeconds(timerState.remainingSeconds);
    }
  }, [timerState?.isRunning, timerState?.lastStartedAt, timerState?.remainingSeconds, timerState]);

  // Local tick loop for smooth UI
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerState?.isRunning && displaySeconds > 0) {
      interval = setInterval(() => {
        setDisplaySeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState?.isRunning, displaySeconds]);

  const isRunning = timerState?.isRunning || false;
  const progress = timerState ? ((timerState.durationSeconds - displaySeconds) / timerState.durationSeconds) * 100 : 0;

  return (
    <SurfaceCard className={cn("flex flex-col items-center justify-center py-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {timerState?.mode.replace("_", " ") || "Focus Session"}
        </h3>
      </div>

      {/* Circular Progress (CSS driven) */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-6">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="60" fill="none" strokeWidth="4" className="stroke-muted/30" />
          <circle
            cx="64" cy="64" r="60" fill="none" strokeWidth="4" strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-linear", isRunning ? "stroke-primary" : "stroke-warning")}
            strokeDasharray={377} // 2 * pi * 60
            strokeDashoffset={377 - (progress / 100) * 377}
          />
        </svg>
        <span className="text-4xl font-bold font-mono tracking-tight z-10">
          {formatTime(displaySeconds)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full"
          disabled={!isHost}
          onClick={() => onTimerAction(isRunning ? "pause" : "start")}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full"
          disabled={!isHost}
          onClick={() => onTimerAction("reset")}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {!isHost && (
        <p className="text-[10px] text-muted-foreground mt-4">
          Only the host can control the timer
        </p>
      )}
    </SurfaceCard>
  );
}
