"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

export async function getUserGroups(type?: "squad" | "community") {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return { data: null, success: false, error: "User not found" };

    const whereClause: any = {
      members: {
        some: {
          userId: dbUser.id,
        },
      },
    };

    if (type) {
      whereClause.type = type;
    }

    const groups = await prisma.group.findMany({
      where: whereClause,
      include: {
        members: {
          include: {
            user: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        squadGoals: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return { data: groups, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to fetch groups:", error);
    return { data: null, success: false, error: "Failed to fetch groups." };
  }
}

export async function createGroup(data: {
  type: "squad" | "community";
  name: string;
  description: string;
  tags: string[];
  isPrivate?: boolean;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return { data: null, success: false, error: "User not found" };

    const group = await prisma.group.create({
      data: {
        type: data.type,
        name: data.name,
        description: data.description,
        tags: data.tags,
        isPrivate: data.isPrivate || false,
        membersCount: 1,
        members: {
          create: {
            userId: dbUser.id,
            role: "admin",
          },
        },
      },
    });

    revalidatePath("/dashboard");
    if (data.type === "squad") revalidatePath("/squads");
    if (data.type === "community") revalidatePath("/communities");

    return { data: group, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to create group:", error);
    return { data: null, success: false, error: error.message };
  }
}

export async function getGroupById(groupId: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        squadGoals: true,
      },
    });

    if (!group) {
      return { data: null, success: false, error: "Group not found" };
    }

    return { data: group, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to fetch group:", error);
    return { data: null, success: false, error: error.message };
  }
}

export async function joinGroup(groupId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return { data: null, success: false, error: "User not found" };

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) return { data: null, success: false, error: "Group not found" };

    // Check if already joined
    const existing = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: dbUser.id,
        },
      },
    });

    if (existing) {
      return { data: group, success: true, error: null };
    }

    // Join
    await prisma.$transaction([
      prisma.groupMember.create({
        data: {
          groupId,
          userId: dbUser.id,
          role: "member",
        },
      }),
      prisma.group.update({
        where: { id: groupId },
        data: {
          membersCount: { increment: 1 },
        },
      }),
    ]);

    revalidatePath("/dashboard");
    if (group.type === "squad") revalidatePath("/squads");
    if (group.type === "community") revalidatePath("/communities");
    revalidatePath(`/squads/${groupId}`);
    revalidatePath(`/communities/${groupId}`);

    return { data: group, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to join group:", error);
    return { data: null, success: false, error: error.message };
  }
}
