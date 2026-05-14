"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRoomStore } from "@/features/rooms/store";
import { UserAvatar } from "@/components/shared/user-avatar";
import { InputField } from "@/components/shared/inputs";
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Live Chat
   ─────────────────────────────────────────────────────────
   Auto-scrolling chat panel for real-time messaging.
   ═══════════════════════════════════════════════════════════ */

interface LiveChatProps {
  onSendMessage: (content: string) => void;
  className?: string;
}

export function LiveChat({ onSendMessage, className }: LiveChatProps) {
  const [input, setInput] = useState("");
  const messages = useRoomStore((state) => state.messages);
  const localParticipant = useRoomStore((state) => state.localParticipant);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border-l border-border/30", className)}>
      {/* Header */}
      <div className="p-3 border-b border-border/30 bg-muted/10">
        <h3 className="text-sm font-semibold">Room Chat</h3>
      </div>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
            Say hi to start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === localParticipant?.id;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2 max-w-[90%]",
                  isMe ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <UserAvatar name={msg.displayName} src={msg.avatarUrl} size="sm" />
                <div
                  className={cn(
                    "flex flex-col",
                    isMe ? "items-end" : "items-start"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground mb-0.5 px-1">
                    {isMe ? "You" : msg.displayName}
                  </span>
                  <div
                    className={cn(
                      "px-3 py-2 rounded-2xl text-sm leading-relaxed",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-border/30 bg-muted/10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full h-8 w-8">
            <Smile className="w-4 h-4 text-muted-foreground" />
          </Button>
          <InputField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 min-h-0 h-9 rounded-full text-xs border-transparent focus:border-transparent focus:ring-0 bg-transparent"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="shrink-0 rounded-full h-8 w-8"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
