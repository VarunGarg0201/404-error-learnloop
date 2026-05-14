"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

/**
 * Create a micro teaching post
 */
export async function createMicroPost(data: {
  type: string;
  title: string;
  content: string;
  tags: string[];
  isAnonymous?: boolean;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!dbUser) return { success: false, error: "User not found" };

    const post = await prisma.microPost.create({
      data: {
        userId: dbUser.id,
        type: data.type,
        title: data.title,
        content: data.content,
        tags: data.tags,
        isAnonymous: data.isAnonymous || false,
      },
    });

    // Award KC for contributing
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { knowledgeCredits: { increment: 15 } },
    });

    await prisma.knowledgeCreditEntry.create({
      data: {
        userId: dbUser.id,
        amount: 15,
        reason: `Published a micro post: "${data.title}"`,
        category: "teaching",
      },
    });

    await prisma.activity.create({
      data: {
        userId: dbUser.id,
        type: "published_post",
        label: "Published a teaching post",
        detail: data.title,
      },
    });

    revalidatePath("/teach");
    revalidatePath("/dashboard");
    return { success: true, data: post, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get all micro posts (feed)
 */
export async function getMicroPosts(limit = 20) {
  try {
    const posts = await prisma.microPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
            campus: true,
            stream: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { data: posts, success: true, error: null };
  } catch (error: any) {
    return { data: null, success: false, error: error.message };
  }
}

/**
 * Like a micro post
 */
export async function likeMicroPost(postId: string) {
  try {
    await prisma.microPost.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
    revalidatePath("/teach");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
