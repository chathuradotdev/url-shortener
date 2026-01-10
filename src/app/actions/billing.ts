
"use server";

import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { configureLemonSqueezy, LEMONSQUEEZY_CONFIG } from "@/lib/lemonsqueezy";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createCheckoutSession(variantId?: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    if (!configureLemonSqueezy()) {
        throw new Error("Lemon Squeezy not configured");
    }

    // Default to the Monthly variant ID from env if not passed
    // You can have multiple variants (Monthly, Yearly)
    const activeVariantId = variantId || process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!activeVariantId) {
        throw new Error("No variant ID provided or configured");
    }

    if (!LEMONSQUEEZY_CONFIG.storeId) {
        throw new Error("Store ID not configured");
    }

    try {
        const result = await createCheckout(
            LEMONSQUEEZY_CONFIG.storeId,
            activeVariantId,
            {
                checkoutData: {
                    email: session.user.email,
                    custom: {
                        user_id: session.user.id
                    }
                },
                productOptions: {
                    redirectUrl: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
                    receiptButtonText: 'Go to Dashboard',
                    receiptThankYouNote: 'Thanks for upgrading to Pro!'
                }
            }
        );

        if (result.error) {
            console.error(result.error);
            throw new Error(result.error.message);
        }

        const checkoutUrl = result.data?.data.attributes.url;
        return checkoutUrl; // Return URL for client to redirect

    } catch (error: any) {
        console.error(error);
        throw new Error(error.message || "Failed to create checkout");
    }
}
