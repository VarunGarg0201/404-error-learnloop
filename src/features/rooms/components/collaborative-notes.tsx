"use client";

import { useState, useEffect, useCallback } from "react";
import { useRoomStore } from "@/features/rooms/store";
import { SurfaceCard } from "@/components/shared/cards";
import { Edit3 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

/* ═══════════════════════════════════════════════════════════
   Collaborative Notes (Phase 1)
   ─────────────────────────────────────────────────────────
   Shared scratchpad. Uses a debounced textarea to prevent
   frequent broadcast spam while allowing basic syncing.
   ═══════════════════════════════════════════════════════════ */

interface CollaborativeNotesProps {
  onNoteChange: (content: string) => void;
  className?: string;
}

export function CollaborativeNotes({ onNoteChange, className }: CollaborativeNotesProps) {
  const sharedNotes = useRoomStore((state) => state.sharedState?.notes);
  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Sync from remote only if we are not actively typing
  useEffect(() => {
    if (sharedNotes?.content !== undefined && !isFocused) {
      setLocalValue(sharedNotes.content);
    }
  }, [sharedNotes?.content, isFocused]);

  // Debounce the local value to broadcast changes
  const debouncedValue = useDebounce(localValue, 500);

  useEffect(() => {
    // Only broadcast if we are the one making changes (focused) and value actually changed
    if (isFocused && debouncedValue !== sharedNotes?.content) {
      onNoteChange(debouncedValue);
    }
  }, [debouncedValue, isFocused, sharedNotes?.content, onNoteChange]);

  return (
    <SurfaceCard className={className} padding="sm">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Edit3 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Shared Notes</h3>
        {sharedNotes?.updatedAt && (
          <span className="text-[10px] text-muted-foreground ml-auto">
            Last edit: {new Date(sharedNotes.updatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type shared notes here... (Synced with everyone in the room)"
        className="w-full h-[200px] sm:h-full min-h-[150px] resize-none bg-transparent border-none focus:ring-0 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50"
      />
    </SurfaceCard>
  );
}
