
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
                    trial_ends_at: attributes.trial_ends_at || null,
                    subscription_status: status,
                    subscription_renews_at: attributes.renews_at || null,
                    subscription_ends_at: attributes.ends_at || null,
                    subscription_amount: attributes.total || null,
                    subscription_currency: attributes.currency || null,
                    card_brand: attributes.card_brand || null,
                    card_last_four: attributes.card_last_four || null,
                    billing_country: attributes.user_country || null
                });

                // Record initial payment if it's a new subscription
                if (eventName === "subscription_created") {
                    await db.recordPayment({
                        user_id,
                        subscription_id: data.id,
                        customer_id: attributes.customer_id.toString(),
                        event_name: eventName,
                        amount: attributes.total || 0,
                        currency: attributes.currency || "USD",
                        status: status,
                        card_brand: attributes.card_brand || null,
                        card_last_four: attributes.card_last_four || null,
                        billing_country: attributes.user_country || null
                    });
                }
            } else {
                await db.updateUserSubscription(user_id, {
                    subscription_status: status
                });
            }

        } else if (eventName === "subscription_payment_success") {
            const attributes = data.attributes;
            // For recurring payments, we keep them premium and record the transaction
            await db.recordPayment({
                user_id,
                subscription_id: attributes.subscription_id.toString(),
                customer_id: attributes.customer_id.toString(),
                event_name: eventName,
                amount: attributes.total || 0,
                currency: attributes.currency || "USD",
                status: "paid",
                card_brand: attributes.card_brand || null,
                card_last_four: attributes.card_last_four || null,
                billing_country: attributes.user_country || null
            });

        } else if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
            await db.updateUserSubscription(user_id, {
                plan: 'freemium',
                subscription_id: null,
                trial_ends_at: null,
                subscription_status: eventName === "subscription_cancelled" ? "cancelled" : "expired",
                subscription_renews_at: null
            });
        }

        return new NextResponse("Webhook processed", { status: 200 });

    } catch (error: any) {
        console.error("Webhook error:", error);
        return new NextResponse(`Webhook error: ${error.message}`, { status: 500 });
    }
}
