
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

// Make sure to set these in your .env.local file
// LEMONSQUEEZY_API_KEY=...
// LEMONSQUEEZY_STORE_ID=...
// LEMONSQUEEZY_WEBHOOK_SECRET=...

const apiKey = process.env.LEMONSQUEEZY_API_KEY;
const storeId = process.env.LEMONSQUEEZY_STORE_ID;
const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

export function configureLemonSqueezy() {
    if (!apiKey) {
        console.warn("LEMONSQUEEZY_API_KEY is not set. Payment features will not work.");
        return false;
    }

    lemonSqueezySetup({
        apiKey: apiKey,
        onError: (error) => console.error("Lemon Squeezy Error:", error),
    });

    return true;
}

export const LEMONSQUEEZY_CONFIG = {
    apiKey,
    storeId,
    webhookSecret,
};
