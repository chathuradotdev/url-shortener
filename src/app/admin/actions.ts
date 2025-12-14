"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleUserStatus(userId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "banned" : "active";
    await db.updateUserStatus(userId, newStatus as any);
    revalidatePath("/admin");
}

export async function toggleUrlStatus(urlId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "removed" : "active";
    await db.updateUrlStatus(urlId, newStatus as any);
    revalidatePath("/admin");
}
