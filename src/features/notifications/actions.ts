"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

export async function getAllNotifications() {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { data: null, success: false, error: "User not found" };

    const notifications = await prisma.notification.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { data: notifications, success: true, error: null };
  } catch (error: any) {
    return { data: null, success: false, error: error.message };
  }
}

export async function markAllNotificationsRead() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return { success: false, error: "User not found" };

    await prisma.notification.updateMany({
      where: { userId: dbUser.id, isRead: false },
      data: { isRead: true },
    });

    revalidatePath("/notifications");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
