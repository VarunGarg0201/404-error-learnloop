"use client";

import { cn } from "@/lib/utils";
import { useRoomStore } from "@/features/rooms/store";
import { Button } from "@/components/ui/button";
import { 
  Mic, MicOff, Video, VideoOff, MonitorUp, Smile, Settings, PhoneOff, Hand
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ═══════════════════════════════════════════════════════════
   Room Controls
   ─────────────────────────────────────────────────────────
   Bottom action bar for media toggles, reactions, leaving.
   ═══════════════════════════════════════════════════════════ */

interface RoomControlsProps {
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onRaiseHand: () => void;
  onReact: (emoji: string) => void;
  onLeave: () => void;
  className?: string;
}

const REACTIONS = ["👍", "👋", "🔥", "💯", "🎉", "💡", "❓", "👀"];

export function RoomControls({
  onToggleMic,
  onToggleVideo,
  onToggleScreenShare,
  onRaiseHand,
  onReact,
  onLeave,
  className,
}: RoomControlsProps) {
  const localParticipant = useRoomStore((state) => state.localParticipant);
  
  // Safe defaults if store isn't fully initialized yet
  const isMuted = localParticipant?.isMuted ?? true;
  const isVideoOff = localParticipant?.isVideoOff ?? true;
  const isScreenSharing = localParticipant?.isScreenSharing ?? false;
  const raisedHand = localParticipant?.raisedHand ?? false;

  return (
    <div className={cn("flex items-center justify-center gap-2 sm:gap-4 p-4", className)}>
      
      {/* Media Controls */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/40 shadow-sm backdrop-blur-md">
        <Button
          size="icon"
          variant={isMuted ? "destructive" : "ghost"}
          className="rounded-xl h-10 w-10 sm:h-12 sm:w-12 transition-all"
          onClick={onToggleMic}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        <Button
          size="icon"
          variant={isVideoOff ? "destructive" : "ghost"}
          className="rounded-xl h-10 w-10 sm:h-12 sm:w-12 transition-all"
          onClick={onToggleVideo}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </Button>
        <Button
          size="icon"
          variant={isScreenSharing ? "secondary" : "ghost"}
          className={cn("rounded-xl h-10 w-10 sm:h-12 sm:w-12 transition-all hidden sm:flex", isScreenSharing && "text-primary")}
          onClick={onToggleScreenShare}
        >
          <MonitorUp className="w-5 h-5" />
        </Button>
      </div>

      {/* Interaction Controls */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/40 shadow-sm backdrop-blur-md">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button size="icon" variant="ghost" className="rounded-xl h-10 w-10 sm:h-12 sm:w-12" />}>
            <Smile className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-auto p-2 flex flex-wrap gap-1 max-w-[180px]">
            {REACTIONS.map(r => (
              <Button 
                key={r} 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-xl hover:bg-muted"
                onClick={() => onReact(r)}
              >
                {r}
              </Button>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          size="icon"
          variant={raisedHand ? "secondary" : "ghost"}
          className={cn("rounded-xl h-10 w-10 sm:h-12 sm:w-12 transition-all", raisedHand && "text-warning")}
          onClick={onRaiseHand}
        >
          <Hand className="w-5 h-5" />
        </Button>
      </div>

      {/* Leave Room */}
      <Button
        variant="destructive"
        className="rounded-2xl h-11 sm:h-14 px-4 sm:px-6 shadow-lg shadow-destructive/20 font-semibold gap-2"
        onClick={onLeave}
      >
        <PhoneOff className="w-5 h-5 hidden sm:block" />
        Leave
      </Button>

    </div>
  );
}
