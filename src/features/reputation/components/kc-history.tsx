"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Zap, ArrowUp, ArrowDown } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   KC History List
   ─────────────────────────────────────────────────────────
   Premium data list showing knowledge credit transactions.
   ═══════════════════════════════════════════════════════════ */

interface KCHistoryItem {
  id: string;
  amount: number;
  reason: string;
  category: string;
  createdAt: string;
}

export function KCHistoryList() {
  const [history, setHistory] = useState<KCHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reputation/kc?limit=10");
        const json = await res.json();
        if (json.success) setHistory(json.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "teaching": return "primary";
      case "helping": return "success";
      case "feedback": return "info";
      case "consistency": return "warning";
      case "penalty": return "destructive";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <SurfaceCard className="animate-pulse space-y-4">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted/50 rounded-lg" />)}
        </div>
      </SurfaceCard>
    );
  }

  if (history.length === 0) {
    return (
      <SurfaceCard>
        <EmptyState
          icon={Zap}
          title="No transaction history"
          description="You haven't earned or spent any Knowledge Credits yet."
        />
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard>
      <h3 className="text-sm font-semibold mb-4">Transaction History</h3>
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-muted/20 transition-colors"
          >
            <div>
              <p className="text-sm font-medium">{item.reason}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge variant={getCategoryColor(item.category)} size="xs">
                  {item.category}
                </StatusBadge>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
            <div className={cn(
              "flex items-center font-bold text-lg",
              item.amount > 0 ? "text-success" : "text-destructive"
            )}>
              {item.amount > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {Math.abs(item.amount)}
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
