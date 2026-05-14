"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRoomChannel } from "@/lib/realtime/use-room-channel";
import { useRoomStore } from "@/features/rooms/store";
import { useUserStore } from "@/store/user-store";

import { ParticipantGrid } from "./participant-grid";
import { LiveChat } from "./live-chat";
import { CollaborativeNotes } from "./collaborative-notes";
import { SessionTimer } from "./session-timer";
import { RoomControls } from "./room-controls";
import { Button } from "@/components/ui/button";
import { PanelRightClose, PanelRightOpen, Users, FileText } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Room Layout
   ─────────────────────────────────────────────────────────
   Main wrapper that composes the room UI and initializes
   the realtime connection via useRoomChannel.
   ═══════════════════════════════════════════════════════════ */

interface RoomLayoutProps {
  roomId: string;
}

type SidebarTab = "chat" | "notes";

export function RoomLayout({ roomId }: RoomLayoutProps) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  
  // Initialize Realtime Connection
  const { broadcastMessage, updatePresence, broadcastStateUpdate } = useRoomChannel(roomId, {
    id: user?.id || "guest",
    displayName: user?.displayName || "Guest",
    username: user?.username || "guest",
    avatarUrl: user?.avatarUrl,
    role: "participant", // In a real app, query DB to see if they are the host
  });

  const { isConnected, localParticipant } = useRoomStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>("chat");

  // Control Handlers
  const handleToggleMic = () => {
    if (localParticipant) updatePresence({ isMuted: !localParticipant.isMuted });
  };

  const handleToggleVideo = () => {
    if (localParticipant) updatePresence({ isVideoOff: !localParticipant.isVideoOff });
  };

  const handleToggleScreenShare = () => {
    if (localParticipant) updatePresence({ isScreenSharing: !localParticipant.isScreenSharing });
  };

  const handleRaiseHand = () => {
    if (localParticipant) {
      updatePresence({ raisedHand: !localParticipant.raisedHand });
      // Auto lower hand after 10 seconds
      if (!localParticipant.raisedHand) {
        setTimeout(() => updatePresence({ raisedHand: false }), 10000);
      }
    }
  };

  const handleReact = (emoji: string) => {
    updatePresence({ currentReaction: emoji });
    // Clear reaction after 3 seconds
    setTimeout(() => updatePresence({ currentReaction: null }), 3000);
  };

  const handleLeave = () => {
    router.push("/dashboard");
  };

  const handleTimerAction = (action: "start" | "pause" | "reset", newDuration?: number) => {
    const timerState = useRoomStore.getState().sharedState?.timer;
    const currentRemaining = timerState?.remainingSeconds || 25 * 60;
    const currentDuration = timerState?.durationSeconds || 25 * 60;

    if (action === "start") {
      broadcastStateUpdate({
        timer: {
          isRunning: true,
          mode: timerState?.mode || "pomodoro",
          durationSeconds: currentDuration,
          remainingSeconds: currentRemaining,
          lastStartedAt: new Date().toISOString(),
        }
      });
    } else if (action === "pause") {
      broadcastStateUpdate({
        timer: {
          isRunning: false,
          mode: timerState?.mode || "pomodoro",
          durationSeconds: currentDuration,
          remainingSeconds: currentRemaining,
          lastStartedAt: null,
        }
      });
    } else if (action === "reset") {
      broadcastStateUpdate({
        timer: {
          isRunning: false,
          mode: timerState?.mode || "pomodoro",
          durationSeconds: newDuration || 25 * 60,
          remainingSeconds: newDuration || 25 * 60,
          lastStartedAt: null,
        }
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Connecting to room...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-4 sm:-m-8 bg-background overflow-hidden relative">
      
      {/* ─── Main Stage (Video Grid & Controls) ─── */}
      <div className={cn("flex flex-col flex-1 min-w-0 transition-all duration-300 relative", sidebarOpen ? "mr-[320px] lg:mr-[400px]" : "")}>
        
        {/* Top Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-30 bg-gradient-to-b from-background/80 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live</span>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex gap-2"
          >
            {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            {sidebarOpen ? "Hide Panel" : "Show Panel"}
          </Button>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4 sm:p-8 pt-16 overflow-y-auto">
          <ParticipantGrid />
        </div>

        {/* Bottom Controls */}
        <div className="shrink-0 pb-4 sm:pb-8">
          <RoomControls
            onToggleMic={handleToggleMic}
            onToggleVideo={handleToggleVideo}
            onToggleScreenShare={handleToggleScreenShare}
            onRaiseHand={handleRaiseHand}
            onReact={handleReact}
            onLeave={handleLeave}
          />
        </div>
      </div>

      {/* ─── Right Sidebar (Chat, Notes, Timer) ─── */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-[320px] lg:w-[400px] bg-card border-l border-border/40 shadow-2xl transition-transform duration-300 z-40 flex flex-col",
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Tabs */}
        <div className="flex p-2 gap-1 border-b border-border/30 bg-muted/20">
          <Button
            variant={activeTab === "chat" ? "secondary" : "ghost"}
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setActiveTab("chat")}
          >
            <Users className="w-4 h-4" /> Chat
          </Button>
          <Button
            variant={activeTab === "notes" ? "secondary" : "ghost"}
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setActiveTab("notes")}
          >
            <FileText className="w-4 h-4" /> Notes & Timer
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto shrink-0"
            onClick={() => setSidebarOpen(false)}
          >
            <PanelRightClose className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "chat" ? (
            <LiveChat
              onSendMessage={(content) => broadcastMessage({ content, type: "text" })}
              className="border-none"
            />
          ) : (
            <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto">
              <SessionTimer onTimerAction={handleTimerAction} isHost={true} />
              <CollaborativeNotes
                onNoteChange={(content) => broadcastStateUpdate({ notes: { content, lastEditedBy: user?.id || "", updatedAt: new Date().toISOString() } })}
                className="flex-1"
              />
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
