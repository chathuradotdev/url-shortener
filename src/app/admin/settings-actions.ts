"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleMaintenanceMode(currentState: boolean) {
    await db.setMaintenanceMode(!currentState);
    revalidatePath("/admin");
}
