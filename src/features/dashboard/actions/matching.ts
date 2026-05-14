"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { findMatches } from "@/lib/ai/matching";
import type { MatchResult, MatchableProfile, DNATraitScore } from "@/lib/ai/types";

/**
 * Optimized AI matching that runs entirely on the server.
 * Only returns the top results to save bandwidth and client CPU.
 */
export async function getTopServerMatches(limit: number = 3) {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    // Fetch the current user with full profile
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        dnaTraits: true,
        receivedFeedback: true,
        roomParticipants: true,
      },
    });

    if (!dbUser) return { data: null, success: false, error: "User not found" };

    // Fetch potential candidates (other onboarded users)
    // We take a larger pool to match against, but only send back the top 'limit'
    const candidates = await prisma.user.findMany({
      where: {
        id: { not: dbUser.id },
        isOnboarded: true,
      },
      include: {
        dnaTraits: true,
        receivedFeedback: true,
        roomParticipants: true,
      },
      take: 40, 
    });

    if (candidates.length === 0) return { data: [], success: true };

    // Map to profile objects for the matching engine
    const profile = mapToMatchableProfile(dbUser);
    const candidateProfiles = candidates.map(mapToMatchableProfile);

    // Run matching engine on the server
    const results = await findMatches(profile, candidateProfiles, {
      userId: profile.id,
      limit,
      minScore: 5,
    });

    return { data: results, success: true };
  } catch (error: any) {
    console.error("Server-side matching failed:", error);
    return { data: null, success: false, error: error.message };
  }
}

/** Helper to map Prisma user to MatchableProfile */
function mapToMatchableProfile(dbUser: any): MatchableProfile {
  const dnaTraits: DNATraitScore[] = (dbUser.dnaTraits || []).map((t: any) => ({
    trait: t.trait,
    score: t.confidence,
    category: t.category as any,
  }));

  const feedback = dbUser.receivedFeedback || [];
  const avgRating = feedback.length > 0
    ? feedback.reduce((sum: number, f: any) => sum + f.overallSatisfaction, 0) / feedback.length / 2
    : 3.5;

  const totalSessions = (dbUser.roomParticipants || []).length;

  return {
    id: dbUser.id,
    displayName: dbUser.displayName,
    username: dbUser.username,
    avatarUrl: dbUser.avatarUrl,
    campus: dbUser.campus,
    stream: dbUser.stream,
    year: dbUser.year,
    bio: dbUser.bio,
    skillsToTeach: dbUser.skillsToTeach || [],
    skillsToLearn: dbUser.skillsToLearn || [],
    goals: dbUser.goals || [],
    learningStyle: dbUser.learningStyle || "visual",
    availability: dbUser.availability || ["Evening"],
    preferredLanguage: dbUser.preferredLanguage || "English",
    dnaTraits,
    knowledgeCredits: dbUser.knowledgeCredits || 0,
    trustScore: Math.min(dbUser.trustScore / 20, 5),
    totalSessions,
    avgRating,
    streak: Math.min(totalSessions, 30),
    energyMode: "focused",
    isOnline: true, 
    lastActiveAt: dbUser.updatedAt?.toISOString() || new Date().toISOString(),
  };
}
