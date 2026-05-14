"use client";

import { useState } from "react";
import { SurfaceCard } from "@/components/shared/cards";
import { InputField } from "@/components/shared/inputs";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Group Chat
   ─────────────────────────────────────────────────────────
   Realtime-ready persistent chat component for groups.
   ═══════════════════════════════════════════════════════════ */

interface ChatMessage {
  id: string;
  sender: { id: string; name: string; avatarUrl: string | null };
  content: string;
  timestamp: string;
}

interface GroupChatProps {
  groupId: string;
  currentUserId: string;
}

export function GroupChat({ groupId, currentUserId }: GroupChatProps) {
  // Mock data for Phase 1
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: { id: "user_2", name: "Alice", avatarUrl: null },
      content: "Hey everyone! When are we meeting for the next study session?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      sender: { id: currentUserId, name: "Me", avatarUrl: null },
      content: "I'm free tomorrow evening around 8 PM.",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: { id: currentUserId, name: "Me", avatarUrl: null },
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMsg]);
    setInput("");
    
    // In Phase 2:
    // broadcast({ type: 'message', payload: newMsg });
    // await fetch('/api/groups/messages', { method: 'POST', body: ... })
  };

  return (
    <SurfaceCard className="flex flex-col h-full p-0 overflow-hidden border-border/40">
      
      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg, i) => {
          const isMe = msg.sender.id === currentUserId;
          const showAvatar = !isMe && (i === 0 || messages[i - 1].sender.id !== msg.sender.id);
          
          return (
            <div key={msg.id} className={cn("flex gap-3 max-w-[85%]", isMe ? "ml-auto flex-row-reverse" : "")}>
              
              {!isMe && (
                <div className="w-8 shrink-0">
                  {showAvatar && <UserAvatar name={msg.sender.name} src={msg.sender.avatarUrl} size="sm" />}
                </div>
              )}
              
              <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                {showAvatar && <span className="text-[10px] text-muted-foreground ml-1 mb-1">{msg.sender.name}</span>}
                <div 
                  className={cn(
                    "px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words",
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-muted/50 text-foreground border border-border/40 rounded-tl-sm"
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t border-border/40 bg-muted/10 flex items-center gap-2 shrink-0">
        <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
          <Smile className="w-5 h-5" />
        </Button>
        <InputField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message group..."
          className="flex-1 h-10 bg-background border-transparent focus:border-transparent focus:ring-0"
        />
        <Button type="submit" size="icon" disabled={!input.trim()} className="shrink-0 rounded-xl h-10 w-10">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </SurfaceCard>
  );
}
