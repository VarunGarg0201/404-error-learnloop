"use server";

import { prisma } from "@/lib/prisma";

export async function getCampusCommunities(campusSearch?: string) {
  try {
    const where: any = { type: "community" };

    if (campusSearch) {
      where.OR = [
        { campus: { contains: campusSearch, mode: "insensitive" } },
        { name: { contains: campusSearch, mode: "insensitive" } },
      ];
    }

    const communities = await prisma.group.findMany({
      where,
      orderBy: [
        { membersCount: "desc" },
        { createdAt: "desc" },
      ],
      take: 40,
    });

    return { data: communities, success: true, error: null };
  } catch (error: any) {
    return { data: null, success: false, error: error.message };
  }
}
