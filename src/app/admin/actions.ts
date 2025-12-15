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

export async function changeUserPlan(userId: string, newPlan: 'freemium' | 'premium') {
    console.log("Updating user plan...", userId, newPlan);
    // Explicitly check if function exists to debug runtime header
    if (typeof db.updateUserPlan !== 'function') {
        console.error("CRITICAL: db.updateUserPlan is not a function!", Object.keys(db));
        throw new Error("Database method declaration mismatch");
    }
    await db.updateUserPlan(userId, newPlan);
    revalidatePath("/admin");
}
