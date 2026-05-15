"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";

/**
 * AI-generated Learning DNA improvements (Phase 2).
 * Analyzes user activity patterns and auto-evolves DNA trait confidence.
 * Called periodically or manually from the growth page.
 */
export async function evolveDNATraits() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        dnaTraits: true,
        activities: { orderBy: { createdAt: "desc" }, take: 50 },
        receivedFeedback: { orderBy: { createdAt: "desc" }, take: 20 },
        roomParticipants: true,
        microPosts: true,
        groupMemberships: true,
      },
    });

    if (!dbUser) return { success: false, error: "User not found" };

    const totalSessions = dbUser.roomParticipants.length;
    const totalPosts = dbUser.microPosts.length;
    const totalGroups = dbUser.groupMemberships.length;
    const feedback = dbUser.receivedFeedback;
    const avgClarity = feedback.length > 0
      ? feedback.reduce((s, f) => s + f.clarity, 0) / feedback.length / 10
      : 0;
    const avgHelpfulness = feedback.length > 0
      ? feedback.reduce((s, f) => s + f.helpfulness, 0) / feedback.length / 10
      : 0;
    const avgPatience = feedback.length > 0
      ? feedback.reduce((s, f) => s + f.patience, 0) / feedback.length / 10
      : 0;

    // Trait evolution rules
    const evolutions: { trait: string; category: string; confidence: number }[] = [];

    // Teaching traits — based on posts and feedback
    if (totalPosts >= 3) {
      evolutions.push({ trait: "Knowledge Sharer", category: "teaching", confidence: Math.min(0.3 + totalPosts * 0.05, 0.95) });
    }
    if (avgClarity > 0.6) {
      evolutions.push({ trait: "Deep Explainer", category: "teaching", confidence: Math.min(avgClarity, 0.95) });
    }
    if (avgPatience > 0.7) {
      evolutions.push({ trait: "Beginner-Friendly Teacher", category: "teaching", confidence: Math.min(avgPatience, 0.95) });
    }
    if (avgHelpfulness > 0.6) {
      evolutions.push({ trait: "Patient Explainer", category: "teaching", confidence: Math.min(avgHelpfulness, 0.95) });
    }

    // Learning traits — based on sessions
    if (totalSessions >= 5) {
      evolutions.push({ trait: "Active Learner", category: "learning", confidence: Math.min(0.4 + totalSessions * 0.02, 0.95) });
    }
    if (totalSessions >= 10) {
      evolutions.push({ trait: "Problem Solver", category: "learning", confidence: Math.min(0.5 + totalSessions * 0.01, 0.9) });
    }

    // Social traits — based on groups and collaboration
    if (totalGroups >= 2) {
      evolutions.push({ trait: "Collaborative Thinker", category: "social", confidence: Math.min(0.4 + totalGroups * 0.1, 0.9) });
    }
    if (totalGroups >= 3 && totalSessions >= 10) {
      evolutions.push({ trait: "Community Mentor", category: "social", confidence: Math.min(0.5 + totalGroups * 0.05, 0.85) });
    }

    // Apply evolutions — upsert each trait
    let updated = 0;
    for (const evo of evolutions) {
      const existing = dbUser.dnaTraits.find((t) => t.trait === evo.trait);
      if (existing) {
        // Only upgrade, never downgrade
        if (evo.confidence > existing.confidence) {
          await prisma.learningDNATrait.update({
            where: { id: existing.id },
            data: { confidence: evo.confidence },
          });
          updated++;
        }
      } else {
        await prisma.learningDNATrait.create({
          data: {
            userId: dbUser.id,
            trait: evo.trait,
            category: evo.category,
            confidence: evo.confidence,
            isSelfAssessed: false,
            isVisible: true,
          },
        });
        updated++;
      }
    }

    return { success: true, updated, total: evolutions.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
