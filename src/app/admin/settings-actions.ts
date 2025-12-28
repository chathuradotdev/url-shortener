"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleMaintenanceMode(currentState: boolean) {
    await db.setMaintenanceMode(!currentState);
    revalidatePath("/admin");
}

export async function createAlert(formData: FormData) {
    const message = formData.get('message') as string;
    const type = (formData.get('type') as any) || 'info';
    const is_active = formData.get('is_active') === 'on';

    // Handle dates - if empty string, send null
    const startDateRaw = formData.get('start_date') as string;
    const endDateRaw = formData.get('end_date') as string;

    const start_date = startDateRaw ? new Date(startDateRaw).toISOString() : null;
    const end_date = endDateRaw ? new Date(endDateRaw).toISOString() : null;

    const action_label = (formData.get('action_label') as string) || null;
    const action_url = (formData.get('action_url') as string) || null;
    const audience = (formData.get('audience') as any) || 'all';

    if (!message) return;

    await db.createSystemAlert({
        message,
        type,
        is_active,
        audience,
        start_date,
        end_date,
        action_label,
        action_url
    });
    revalidatePath("/admin");
}

export async function deleteAlert(id: string) {
    await db.deleteSystemAlert(id);
    revalidatePath("/admin");
}

export async function toggleAlertStatus(id: string, currentState: boolean) {
    await db.updateSystemAlert(id, { is_active: !currentState });
    revalidatePath("/admin");
}
