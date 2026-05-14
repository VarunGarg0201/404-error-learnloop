"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import {
  MatchCard,
  MatchCardSkeleton,
} from "@/features/matching/components/match-card";
import { findMatches } from "@/lib/ai/matching";
import { DEMO_USER, DEMO_CANDIDATES } from "@/lib/ai/demo-data";
import type { MatchResult, EnergyMode } from "@/lib/ai/types";
import {
  Sparkles,
  Filter,
  Wifi,
  MapPin,
  Zap,
  RefreshCw,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   Discover Page — AI-Powered Matching
   ═══════════════════════════════════════════════════════════ */

type FilterState = {
  onlineOnly: boolean;
  campusOnly: boolean;
};

export default function DiscoverPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    onlineOnly: false,
    campusOnly: false,
  });

  async function loadMatches() {
    setLoading(true);
    try {
      const results = await findMatches(DEMO_USER, DEMO_CANDIDATES, {
        userId: DEMO_USER.id,
        limit: 10,
        minScore: 20,
        filters: {
          onlineOnly: filters.onlineOnly,
          campus: filters.campusOnly ? DEMO_USER.campus || undefined : undefined,
        },
      });
      setMatches(results);
    } catch (err) {
      console.error("Match error:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMatches();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const topMatch = matches[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover"
        description="AI-powered peer matching based on your Learning DNA"
      >
        <Button
          size="sm"
          variant="secondary"
          onClick={loadMatches}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
          Refresh
        </Button>
      </PageHeader>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-muted-foreground font-medium mr-1">
          <Filter className="w-3 h-3 inline mr-1" />
          Filters:
        </span>
        <button
          onClick={() =>
            setFilters((f) => ({ ...f, onlineOnly: !f.onlineOnly }))
          }
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            filters.onlineOnly
              ? "bg-success/10 border-success/30 text-success"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <Wifi className="w-3 h-3" />
          Online now
        </button>
        <button
          onClick={() =>
            setFilters((f) => ({ ...f, campusOnly: !f.campusOnly }))
          }
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
            filters.campusOnly
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-card border-border/50 text-muted-foreground hover:border-border"
          )}
        >
          <MapPin className="w-3 h-3" />
          Same campus
        </button>
      </div>

      {/* Match count */}
      {!loading && matches.length > 0 && (
        <div className="flex items-center gap-2">
          <StatusBadge variant="primary" size="sm" dot>
            {matches.length} matches found
          </StatusBadge>
          {topMatch && (
            <span className="text-[11px] text-muted-foreground">
              Top match: {topMatch.score.overall}% with {topMatch.user.displayName}
            </span>
          )}
        </div>
      )}

      {/* AI insight card */}
      {!loading && matches.length > 0 && (
        <SurfaceCard className="flex items-start gap-3 bg-primary/[0.03] border-primary/10">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[13px] font-semibold mb-0.5">AI Insight</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Based on your Learning DNA, you learn best through <strong>hands-on collaboration</strong>.
              Your top matches today are strong in areas you want to learn —
              especially <strong>Machine Learning</strong> and <strong>Docker</strong>.
              Consider connecting with {topMatch?.user.displayName} who is currently in teaching mode.
            </p>
          </div>
        </SurfaceCard>
      )}

      {/* Match list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <MatchCardSkeleton />
              <MatchCardSkeleton />
              <MatchCardSkeleton />
            </motion.div>
          ) : matches.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {matches.map((match, i) => (
                <MatchCard key={match.user.id} match={match} rank={i + 1} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <EmptyState
                icon={Sparkles}
                title="No matches found"
                description="Try adjusting your filters or updating your profile to find better matches."
                action={
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setFilters({ onlineOnly: false, campusOnly: false })
                    }
                  >
                    Clear filters
                  </Button>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
