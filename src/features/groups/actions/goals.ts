"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

/**
 * Add a new goal to a squad
 */
export async function addSquadGoal(groupId: string, data: {
  title: string;
  targetHours: number;
  deadline: Date;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Check if user is a member of the squad
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: user.id,
        }
      }
    });

    if (!membership) return { success: false, error: "You must be a member of this squad to add goals." };

    const goal = await prisma.squadGoal.create({
      data: {
        groupId,
        title: data.title,
        targetHours: data.targetHours,
        deadline: data.deadline,
      }
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: "squad_goal_created",
        label: "Created a Squad Goal",
        detail: `Goal: ${data.title} in squad.`,
      }
    });

    revalidatePath(`/squads/${groupId}`);
    return { success: true, data: goal };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Log progress for a squad goal
 */
export async function logGoalProgress(groupId: string, goalId: string, hours: number) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const goal = await prisma.squadGoal.findUnique({
      where: { id: goalId },
    });

    if (!goal) return { success: false, error: "Goal not found" };

    const newCurrent = goal.currentHours + hours;
    const isCompleted = newCurrent >= goal.targetHours;

    const updated = await prisma.squadGoal.update({
      where: { id: goalId },
      data: {
        currentHours: newCurrent,
        isCompleted,
      }
    });

    // Award KC for contribution if not already completed
    if (!goal.isCompleted && hours > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { knowledgeCredits: { increment: 2 * hours } }
      });

      await prisma.knowledgeCreditEntry.create({
        data: {
          userId: user.id,
          amount: 2 * hours,
          reason: `Logged progress for goal: ${goal.title}`,
          category: "collaboration",
        }
      });
    }

    revalidatePath(`/squads/${groupId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
