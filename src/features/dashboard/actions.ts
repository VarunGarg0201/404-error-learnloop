"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";

export async function getHelpRequests() {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const requests = await prisma.helpRequest.findMany({
      where: {
        status: "open",
      },
      include: {
        user: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return { data: requests, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to fetch help requests:", error);
    return { data: null, success: false, error: error.message };
  }
}

export async function getRecentActivities() {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return { data: null, success: false, error: "User not found" };

    const activities = await prisma.activity.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return { data: activities, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to fetch activities:", error);
    return { data: null, success: false, error: error.message };
  }
}

export async function getNotifications() {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return { data: null, success: false, error: "User not found" };

    const notifications = await prisma.notification.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return { data: notifications, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    return { data: null, success: false, error: error.message };
  }
}

export async function getPotentialMatches() {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        dnaTraits: true,
        creditEntries: true,
        receivedFeedback: true,
        roomParticipants: true,
      },
    });

    if (!dbUser) return { data: null, success: false, error: "User not found" };

    // Fetch other users with their full profile data for matching
    const otherUsers = await prisma.user.findMany({
      where: { 
        id: { not: dbUser.id }
      },
      include: {
        dnaTraits: true,
        creditEntries: true,
        receivedFeedback: true,
        roomParticipants: true,
      },
      take: 30,
    });

    return { data: { currentUser: dbUser, candidates: otherUsers }, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to fetch potential matches:", error);
    return { data: null, success: false, error: error.message };
  }
}

export async function getUserStats() {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        creditEntries: true,
        receivedFeedback: true,
      }
    });

    if (!dbUser) return { data: null, success: false, error: "User not found" };

    return { data: dbUser, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to fetch user stats:", error);
    return { data: null, success: false, error: error.message };
  }
}

/**
 * Send a match request / connect invitation.
 * Creates a notification for the target user.
 */
export async function sendMatchRequest(targetUserId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return { success: false, error: "User not found" };

    // Create a notification for the target user
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "match",
        title: "New Match Request!",
        body: `${dbUser.displayName} wants to connect and learn together.`,
        href: `/profile`,
      },
    });

    // Create an activity for the sender
    await prisma.activity.create({
      data: {
        userId: dbUser.id,
        type: "sent_match_request",
        label: "Sent a match request",
        detail: "You reached out to a peer to learn together.",
      },
    });

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Failed to send match request:", error);
    return { success: false, error: error.message };
  }
}
