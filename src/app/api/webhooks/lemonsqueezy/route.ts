
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { LEMONSQUEEZY_CONFIG } from "@/lib/lemonsqueezy";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    if (!LEMONSQUEEZY_CONFIG.webhookSecret) {
        return new NextResponse("Lemon Squeezy Webhook Secret not set", { status: 500 });
    }

    try {
        const text = await req.text();
        const signature = (await headers()).get("x-signature");

        if (!signature) {
            return new NextResponse("No signature", { status: 400 });
        }

        const hmac = crypto.createHmac("sha256", LEMONSQUEEZY_CONFIG.webhookSecret);
        const digest = hmac.update(text).digest("hex");

        if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))) {
            return new NextResponse("Invalid signature", { status: 401 });
        }

        const payload = JSON.parse(text);
        const { meta, data } = payload;
        const user_id = meta.custom_data?.user_id;

        if (!user_id) {
            console.error("No user_id in webhook custom_data");
            return new NextResponse("No user_id provided", { status: 200 }); // Return 200 to prevent retries for bad data
        }

        const eventName = meta.event_name;
        console.log(`Processing Lemon Squeezy event: ${eventName} for user ${user_id}`);

        if (eventName === "subscription_created" || eventName === "subscription_updated" || eventName === "subscription_resumed") {
            const attributes = data.attributes;
            const status = attributes.status; // active, past_due, etc.

            // If active or on trial
            if (status === "active" || status === "on_trial") {
                await db.updateUserSubscription(user_id, {
                    plan: 'premium',
                    subscription_id: data.id,
                    customer_id: attributes.customer_id.toString(),
                    trial_ends_at: attributes.trial_ends_at || null
                });
            } else {
                // past_due, unpaid, etc. maybe downgrade or just keep tracking stats?
                // For now, let's leave it as is, or maybe downgrade if extremely past due?
                // Let's stick to simple logic: active = premium.
            }

        } else if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
            await db.updateUserSubscription(user_id, {
                plan: 'freemium',
                subscription_id: null,
                trial_ends_at: null
            });
        }

        return new NextResponse("Webhook processed", { status: 200 });

    } catch (error: any) {
        console.error("Webhook error:", error);
        return new NextResponse(`Webhook error: ${error.message}`, { status: 500 });
    }
}
