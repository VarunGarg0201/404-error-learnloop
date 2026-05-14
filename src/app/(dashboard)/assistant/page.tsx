"use client";

import { useState, useRef, useEffect } from "react";
import { SurfaceCard } from "@/components/shared/cards";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useUserStore } from "@/store/user-store";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Brain, 
  Zap, 
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   LearnLoop AI Assistant
   ─────────────────────────────────────────────────────────
   Premium, interactive chat interface for the hackathon demo.
   ═══════════════════════════════════════════════════════════ */

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
};

export default function AssistantPage() {
  const { user } = useUserStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi ${user?.displayName || "there"}! I'm your LearnLoop AI. I can help you find study partners, explain complex topics, or help you manage your Learning DNA. What's on your mind?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response for the hackathon demo
    // In a real app, this would call an API route
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getDemoResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-xs text-muted-foreground">Always active · Knowledgeable · Supportive</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <SurfaceCard className="flex-1 flex flex-col p-0 overflow-hidden border-border/40">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-border"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3 sm:gap-4",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                  msg.role === "assistant" 
                    ? "bg-primary/10 border-primary/20 text-primary" 
                    : "bg-muted border-border text-muted-foreground"
                )}>
                  {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={cn(
                  "max-w-[85%] sm:max-w-[70%] space-y-1",
                  msg.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "assistant" 
                      ? "bg-muted/50 text-foreground rounded-tl-none" 
                      : "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                  )}>
                    {msg.content}
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex gap-3 items-center text-muted-foreground"
            >
              <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                <Bot className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 text-[11px] hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/40 bg-card/50">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your learning journey..."
              className="flex-1 bg-muted/50 border border-border/60 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 rounded-lg w-9 h-9"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-3">
            Powered by LearnLoop Intelligence · Personalized to your DNA
          </p>
        </div>
      </SurfaceCard>
    </div>
  );
}

const SUGGESTIONS = [
  "Explain React hydration",
  "How can I earn more KC?",
  "Find me a study squad",
  "Analyze my Learning DNA",
];

function getDemoResponse(input: string): string {
  const low = input.toLowerCase();
  if (low.includes("react") || low.includes("hydration")) {
    return "React hydration is when React 'attaches' to existing HTML that was rendered on the server. Since your LearnLoop dashboard uses Server Components, hydration ensures your interactive charts and sidebar are live and responsive!";
  }
  if (low.includes("kc") || low.includes("credit")) {
    return "You earn Knowledge Credits (KC) by teaching others! Try creating a Study Room and marking it as 'Teaching Mode'. Each 30 minutes you spend helping a peer earns you 20 KC.";
  }
  if (low.includes("squad") || low.includes("partner")) {
    return "Based on your DNA, you'd match well with Priya S. or James K. They are also working on CS projects today. Would you like me to send them a 'High-Five' request?";
  }
  if (low.includes("dna")) {
    return "Your Learning DNA shows you are a 'Visual Strategist' with a 85% score in Collaborative Problem Solving. You learn best when using shared diagrams and whiteboards!";
  }
  return "That's a great question! As your LearnLoop assistant, I'm analyzing your current learning goals to give you the best advice. Feel free to ask about study rooms, your reputation, or any technical topic you're stuck on!";
}
