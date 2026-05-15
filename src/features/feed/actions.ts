"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

export async function getFeedPosts(types?: string[]) {
  try {
    const posts = await prisma.microPost.findMany({
      where: types ? { type: { in: types } } : undefined,
      include: {
        user: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // Strip user data from anonymous posts
    const sanitized = posts.map((p) => ({
      ...p,
      user: p.isAnonymous ? null : p.user,
    }));

    return { data: sanitized, success: true, error: null };
  } catch (error: any) {
    return { data: null, success: false, error: error.message };
  }
}

export async function createFeedPost(data: {
  type: string;
  title: string;
  content: string;
  tags: string[];
  isAnonymous: boolean;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    await prisma.microPost.create({
      data: {
        userId: dbUser.id,
        type: data.type,
        title: data.title,
        content: data.content,
        tags: data.tags,
        isAnonymous: data.isAnonymous,
      },
    });

    // Award KC for teaching posts
    if (["lesson", "explanation", "recap", "code"].includes(data.type)) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { knowledgeCredits: { increment: 15 } },
      });
      await prisma.knowledgeCreditEntry.create({
        data: {
          userId: dbUser.id,
          amount: 15,
          reason: `Published a ${data.type}: ${data.title}`,
          category: "teaching",
        },
      });
    }

    // Award KC for sharing struggles (courage bonus)
    if (data.type === "struggle") {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { knowledgeCredits: { increment: 5 } },
      });
      await prisma.knowledgeCreditEntry.create({
        data: {
          userId: dbUser.id,
          amount: 5,
          reason: `Shared a learning struggle: ${data.title}`,
          category: "collaboration",
        },
      });
    }

    revalidatePath("/feed");
    revalidatePath("/teach");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function likeFeedPost(postId: string) {
  try {
    await prisma.microPost.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
