"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";

export async function getLiveRooms() {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        isActive: true,
      },
      include: {
        host: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
        participants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data: rooms, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to fetch live rooms:", error);
    return { data: null, success: false, error: "Failed to fetch active rooms." };
  }
}

export async function createRoom(data: {
  title: string;
  description?: string;
  type: string;
  tags: string[];
  maxParticipants?: number;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, success: false, error: "Unauthorized" };
    }

    // Get the internal User ID
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return { data: null, success: false, error: "User not found in DB" };
    }

    const room = await prisma.room.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        tags: data.tags,
        hostId: dbUser.id,
        maxParticipants: data.maxParticipants || 10,
        currentParticipants: 1,
        isActive: true,
      },
    });

    // Auto-join the host
    await prisma.roomParticipant.create({
      data: {
        roomId: room.id,
        userId: dbUser.id,
      },
    });

    revalidatePath("/rooms");
    revalidatePath("/dashboard");

    return { data: room, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to create room:", error);
    return { data: null, success: false, error: error.message };
  }
}

export async function joinRoom(roomId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, success: false, error: "Unauthorized" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return { data: null, success: false, error: "User not found in DB" };
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return { data: null, success: false, error: "Room not found" };
    }

    if (!room.isActive) {
      return { data: null, success: false, error: "Room is no longer active" };
    }

    if (room.currentParticipants >= room.maxParticipants) {
      return { data: null, success: false, error: "Room is full" };
    }

    // Check if already joined
    const existing = await prisma.roomParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId: room.id,
          userId: dbUser.id,
        },
      },
    });

    if (existing) {
      return { data: room, success: true, error: null };
    }

    // Join
    await prisma.$transaction([
      prisma.roomParticipant.create({
        data: {
          roomId: room.id,
          userId: dbUser.id,
        },
      }),
      prisma.room.update({
        where: { id: room.id },
        data: {
          currentParticipants: { increment: 1 },
        },
      }),
    ]);

    revalidatePath("/rooms");
    return { data: room, success: true, error: null };
  } catch (error: any) {
    console.error("Failed to join room:", error);
    return { data: null, success: false, error: error.message };
  }
}

export async function leaveRoom(roomId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return { success: false, error: "User not found in DB" };

    await prisma.$transaction(async (tx) => {
      const participant = await tx.roomParticipant.findUnique({
        where: { roomId_userId: { roomId, userId: dbUser.id } },
      });

      if (participant && !participant.leftAt) {
        await tx.roomParticipant.update({
          where: { id: participant.id },
          data: { leftAt: new Date() },
        });

        await tx.room.update({
          where: { id: roomId },
          data: { currentParticipants: { decrement: 1 } },
        });
      }
    });

    revalidatePath("/rooms");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Failed to leave room:", error);
    return { success: false, error: error.message };
  }
}
