"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

/**
 * Get the full profile data for the current user
 */
export async function getFullProfile() {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        dnaTraits: true,
        creditEntries: { orderBy: { createdAt: "desc" }, take: 10 },
        receivedFeedback: true,
        roomParticipants: true,
        groupMemberships: true,
        activities: { orderBy: { createdAt: "desc" }, take: 5 },
        helpRequests: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });

    if (!dbUser) return { data: null, success: false, error: "User not found" };

    const totalSessions = dbUser.roomParticipants.length;
    const totalKC = dbUser.knowledgeCredits;
    const feedback = dbUser.receivedFeedback;
    const avgRating =
      feedback.length > 0
        ? feedback.reduce((s, f) => s + f.overallSatisfaction, 0) / feedback.length
        : 0;

    return {
      data: {
        ...dbUser,
        totalSessions,
        totalKC,
        avgRating: Math.round(avgRating * 10) / 10,
        totalFeedback: feedback.length,
        totalGroups: dbUser.groupMemberships.length,
      },
      success: true,
      error: null,
    };
  } catch (error: any) {
    console.error("Failed to fetch profile:", error);
    return { data: null, success: false, error: error.message };
  }
}

/**
 * Update user profile fields
 */
export async function updateProfile(data: {
  displayName?: string;
  bio?: string;
  campus?: string;
  stream?: string;
  year?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.user.update({
      where: { email: user.email },
      data,
    });

    revalidatePath("/profile");
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Create a help request
 */
export async function createHelpRequest(data: {
  topic: string;
  subject: string;
  urgency: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!dbUser) return { success: false, error: "User not found" };

    await prisma.helpRequest.create({
      data: {
        userId: dbUser.id,
        topic: data.topic,
        subject: data.subject,
        urgency: data.urgency,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: dbUser.id,
        type: "created_help_request",
        label: "Asked for help",
        detail: `Topic: ${data.topic}`,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Submit session feedback
 */
export async function submitFeedback(data: {
  receiverId: string;
  clarity: number;
  helpfulness: number;
  patience: number;
  accuracy: number;
  beginnerFriendliness: number;
  communicationQuality: number;
  conceptUnderstanding: number;
  overallSatisfaction: number;
  comment?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!dbUser) return { success: false, error: "User not found" };

    await prisma.sessionFeedback.create({
      data: {
        giverId: dbUser.id,
        ...data,
      },
    });

    // Award KC to the receiver for getting feedback
    await prisma.user.update({
      where: { id: data.receiverId },
      data: { knowledgeCredits: { increment: 10 } },
    });

    await prisma.knowledgeCreditEntry.create({
      data: {
        userId: data.receiverId,
        amount: 10,
        reason: "Received positive session feedback",
        category: "feedback",
      },
    });

    // Award KC to the giver for providing feedback
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { knowledgeCredits: { increment: 5 } },
    });

    await prisma.knowledgeCreditEntry.create({
      data: {
        userId: dbUser.id,
        amount: 5,
        reason: "Gave session feedback",
        category: "collaboration",
      },
    });

    // Notify the receiver
    await prisma.notification.create({
      data: {
        userId: data.receiverId,
        type: "review",
        title: "New Feedback Received!",
        body: `${dbUser.displayName} rated your session ${data.overallSatisfaction}/10.`,
        href: "/profile",
      },
    });

    // Activity for giver
    await prisma.activity.create({
      data: {
        userId: dbUser.id,
        type: "gave_feedback",
        label: "Submitted feedback",
        detail: "You rated a learning session.",
      },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Close a help request
 */
export async function closeHelpRequest(requestId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.helpRequest.update({
      where: { id: requestId },
      data: { status: "closed" },
    });

    revalidatePath("/dashboard");
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
