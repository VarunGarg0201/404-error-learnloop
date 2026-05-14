"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

/**
 * Complete user onboarding and sync data to database
 */
export async function completeOnboarding(data: {
  displayName: string;
  username: string;
  avatarUrl?: string;
  campus: string;
  stream: string;
  year: string;
  skillsToTeach: string[];
  skillsToLearn: string[];
  goals: string[];
  learningStyle: string;
  availability: string[];
  preferredLanguage: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.user.update({
      where: { email: user.email },
      data: {
        displayName: data.displayName,
        username: data.username,
        avatarUrl: data.avatarUrl,
        campus: data.campus,
        stream: data.stream,
        year: data.year,
        skillsToTeach: data.skillsToTeach,
        skillsToLearn: data.skillsToLearn,
        goals: data.goals,
        learningStyle: data.learningStyle,
        availability: data.availability,
        preferredLanguage: data.preferredLanguage,
        isOnboarded: true,
      },
    });

    // Create a "Welcome" activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: "onboarding_complete",
        label: "Completed Onboarding",
        detail: "Welcome to the LearnLoop ecosystem!",
      },
    });

    // Create some initial DNA traits based on onboarding
    // For now, let's just initialize them with a low confidence
    const initialTraits = [
      { trait: "Visual Learner", category: "learning" as const, confidence: data.learningStyle === "visual" ? 0.6 : 0.3 },
      { trait: "Collaborator", category: "social" as const, confidence: 0.5 },
      { trait: "Peer Mentor", category: "teaching" as const, confidence: data.skillsToTeach.length > 0 ? 0.4 : 0.2 },
    ];

    for (const t of initialTraits) {
      await prisma.learningDNATrait.create({
        data: {
          userId: user.id,
          trait: t.trait,
          category: t.category,
          confidence: t.confidence,
          isSelfAssessed: true,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    
    return { success: true };
  } catch (error: any) {
    console.error("Onboarding completion failed:", error);
    return { success: false, error: error.message };
  }
}
