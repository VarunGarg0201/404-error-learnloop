"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        creator: {
          select: { displayName: true, avatarUrl: true },
        },
        members: {
          select: { id: true, userId: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return { data: projects, success: true, error: null };
  } catch (error: any) {
    return { data: null, success: false, error: error.message };
  }
}

export async function createProject(data: {
  title: string;
  description: string;
  techStack: string[];
  maxMembers: number;
  category: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        techStack: data.techStack,
        maxMembers: data.maxMembers,
        category: data.category,
        creatorId: dbUser.id,
      },
    });

    // Add creator as first member
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: dbUser.id,
        role: "creator",
      },
    });

    // Activity log
    await prisma.activity.create({
      data: {
        userId: dbUser.id,
        type: "project_created",
        label: "Created a project",
        detail: `Started "${data.title}"`,
      },
    });

    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function joinProject(projectId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    // Check if already a member
    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: dbUser.id } },
    });
    if (existing) return { success: false, error: "Already a member" };

    // Check if project is full
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true, creator: { select: { displayName: true } } },
    });
    if (!project) return { success: false, error: "Project not found" };
    if (project.members.length >= project.maxMembers) return { success: false, error: "Project is full" };

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: dbUser.id,
        role: "member",
      },
    });

    // Notify creator
    await prisma.notification.create({
      data: {
        userId: project.creatorId,
        type: "squad",
        title: "New teammate!",
        body: `${dbUser.displayName} joined your project "${project.title}"`,
        href: "/projects",
      },
    });

    // Activity
    await prisma.activity.create({
      data: {
        userId: dbUser.id,
        type: "project_joined",
        label: "Joined a project",
        detail: `Joined "${project.title}"`,
      },
    });

    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
