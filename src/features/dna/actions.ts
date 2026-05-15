"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

export async function getDNATraits() {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { data: null, success: false, error: "User not found" };

    const traits = await prisma.learningDNATrait.findMany({
      where: { userId: dbUser.id },
      orderBy: { confidence: "desc" },
    });

    return { data: traits, success: true, error: null };
  } catch (error: any) {
    return { data: null, success: false, error: error.message };
  }
}

export async function toggleTraitVisibility(traitId: string, isVisible: boolean) {
  try {
    await prisma.learningDNATrait.update({
      where: { id: traitId },
      data: { isVisible },
    });
    revalidatePath("/dna");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addDNATrait(trait: string, category: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    await prisma.learningDNATrait.create({
      data: {
        userId: dbUser.id,
        trait,
        category,
        confidence: 0.3, // starts low for self-assessed
        isSelfAssessed: true,
        isVisible: true,
      },
    });

    revalidatePath("/dna");
    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeDNATrait(traitId: string) {
  try {
    await prisma.learningDNATrait.delete({ where: { id: traitId } });
    revalidatePath("/dna");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
