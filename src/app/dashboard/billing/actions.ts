"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getBillingData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const [user, history] = await Promise.all([
        db.findUserById(session.user.id),
        db.getPaymentHistory(session.user.id)
    ]);

    return {
        user,
        history
    };
}
