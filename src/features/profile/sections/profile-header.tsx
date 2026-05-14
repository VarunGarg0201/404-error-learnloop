"use client";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/user-avatar";
import { SurfaceCard } from "@/components/shared/cards";
import { StatusBadge, KCBadge, OnlineBadge, SkillTag } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import {
  Zap,
  TrendingUp,
  Star,
  MapPin,
  GraduationCap,
  Calendar,
  LinkIcon,
  Edit3,
  Share2,
  Copy,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Profile Header — Hero section with avatar, name, stats
   ═══════════════════════════════════════════════════════════ */

interface ProfileHeaderProps {
  displayName: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  campus?: string | null;
  stream?: string | null;
  year?: string | null;
  knowledgeCredits: number;
  trustScore: number;
  totalSessions: number;
  memberSince: string;
  isOnline?: boolean;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export function ProfileHeader({
  displayName,
  username,
  avatarUrl,
  bio,
  campus,
  stream,
  year,
  knowledgeCredits,
  trustScore,
  totalSessions,
  memberSince,
  isOnline,
  isOwnProfile = true,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <SurfaceCard padding="none" className="overflow-hidden">
      {/* Gradient banner */}
      <div className="h-24 sm:h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent relative">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pb-5 -mt-10">
        {/* Avatar + Actions row */}
        <div className="flex items-end justify-between mb-3">
          <div className="relative">
            <UserAvatar
              name={displayName}
              src={avatarUrl}
              size="lg"
              showOnline={isOnline}
              className="w-20 h-20 text-xl ring-4 ring-card"
            />
          </div>
          <div className="flex items-center gap-2 pb-1">
            {isOwnProfile ? (
              <Button size="sm" variant="secondary" onClick={onEdit} className="gap-1.5 text-xs">
                <Edit3 className="w-3 h-3" />
                Edit profile
              </Button>
            ) : (
              <>
                <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                  <Copy className="w-3 h-3" />
                  Share
                </Button>
                <Button size="sm" className="gap-1.5 text-xs">
                  Connect
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Name & username */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight">{displayName}</h1>
            {isOnline && <OnlineBadge />}
          </div>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-foreground/80 mb-3 max-w-lg leading-relaxed">
            {bio}
          </p>
        )}

        {/* Meta info pills */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground mb-4">
          {campus && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {campus}
            </span>
          )}
          {stream && (
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> {stream}
              {year && ` · ${year}`}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Joined {memberSince}
          </span>
        </div>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-2">
          <KCBadge amount={knowledgeCredits} />
          <StatusBadge variant="success" size="sm" icon={TrendingUp}>
            {trustScore > 0 ? `${trustScore} Trust` : "New"}
          </StatusBadge>
          <StatusBadge variant="info" size="sm" icon={Star}>
            {totalSessions} Sessions
          </StatusBadge>
        </div>
      </div>
    </SurfaceCard>
  );
}
