type RateLimitStore = Map<string, { count: number; lastReset: number }>;

const rateLimitStores: Map<string, RateLimitStore> = new Map();

interface RateLimitOptions {
    interval: number; // in milliseconds
    uniqueTokenPerInterval: number; // max number of unique tokens/IPs to track
}

export function rateLimit(options: RateLimitOptions) {
    const store: RateLimitStore = new Map();

    return {
        check: (limit: number, token: string) => {
            const now = Date.now();
            const record = store.get(token);

            if (!record) {
                store.set(token, { count: 1, lastReset: now });
                return true;
            }

            if (now - record.lastReset > options.interval) {
                store.set(token, { count: 1, lastReset: now });
                return true;
            }

            if (record.count >= limit) {
                return false;
            }

            record.count += 1;
            store.set(token, record);
            return true;
        },
    };
}

export const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500,
});
