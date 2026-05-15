"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SurfaceCard } from "@/components/shared/cards";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getCampusCommunities } from "@/features/campus/actions";
import {
  MapPin,
  Users,
  Search,
  Loader2,
  BookOpen,
  ArrowRight,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Campus Spaces — Phase 2
   ─────────────────────────────────────────────────────────
   Campus-filtered community hub showing local groups,
   study communities, and campus-specific activity.
   ═══════════════════════════════════════════════════════════ */

type CampusCommunity = {
  id: string;
  name: string;
  description: string;
  campus: string | null;
  type: string;
  membersCount: number;
  tags: string[];
};

export default function CampusPage() {
  const [communities, setCommunities] = useState<CampusCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const res = await getCampusCommunities(search || undefined);
    if (res.data) setCommunities(res.data as any);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load();
  }

  // Group by campus
  const grouped = communities.reduce((acc, c) => {
    const campus = c.campus || "General";
    if (!acc[campus]) acc[campus] = [];
    acc[campus].push(c);
    return acc;
  }, {} as Record<string, CampusCommunity[]>);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Spaces"
        description="Find communities, study groups, and hubs from your campus."
      />

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by campus name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
        </div>
        <Button type="submit" size="sm" className="gap-1.5">
          <Search className="w-3.5 h-3.5" />
          Search
        </Button>
      </form>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : Object.keys(grouped).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([campus, items]) => (
            <div key={campus}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                {campus} ({items.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((community) => (
                  <Link key={community.id} href={`/communities/${community.id}`}>
                    <SurfaceCard className="hover:border-border/60 transition-all duration-200 h-full">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold truncate">{community.name}</h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                            {community.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Users className="w-3 h-3" />
                              {community.membersCount} members
                            </span>
                            {community.campus && (
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {community.campus}
                              </span>
                            )}
                          </div>
                          {community.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {community.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </SurfaceCard>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title={search ? "No campus communities found" : "No campus spaces yet"}
          description={search
            ? `No communities match "${search}". Try a different campus name.`
            : "Create a community and set a campus to start building your campus hub!"
          }
          action={
            <Link href="/communities/new">
              <Button size="sm" variant="secondary" className="gap-1">
                Create community
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
