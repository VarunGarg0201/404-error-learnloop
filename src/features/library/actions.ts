"use server";

import { prisma } from "@/lib/prisma";

export async function searchLibrary(search?: string, type?: string) {
  try {
    const where: any = {};

    // Only show teaching-type content in library (not struggles/discussions)
    if (type) {
      where.type = type;
    } else {
      where.type = { in: ["lesson", "explanation", "recap", "code", "note"] };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    const posts = await prisma.microPost.findMany({
      where,
      include: {
        user: {
          select: { displayName: true, avatarUrl: true },
        },
      },
      orderBy: [
        { likes: "desc" },
        { createdAt: "desc" },
      ],
      take: 40,
    });

    const sanitized = posts.map((p) => ({
      ...p,
      user: p.isAnonymous ? null : p.user,
    }));

    return { data: sanitized, success: true, error: null };
  } catch (error: any) {
    return { data: null, success: false, error: error.message };
  }
}
