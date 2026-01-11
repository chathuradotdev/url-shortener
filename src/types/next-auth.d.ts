import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            id: string;
            role?: 'admin' | 'user';
            plan?: 'freemium' | 'premium';
            subscription_id?: string | null;
            subscription_status?: string | null;
            subscription_renews_at?: string | null;
            subscription_ends_at?: string | null;
            subscription_amount?: number | null;
            subscription_currency?: string | null;
            card_brand?: string | null;
            card_last_four?: string | null;
            billing_country?: string | null;
            last_login?: string | null;
            trial_ends_at?: string | null;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        role?: 'admin' | 'user';
        plan?: 'freemium' | 'premium';
        subscription_id?: string | null;
        subscription_status?: string | null;
        subscription_renews_at?: string | null;
        subscription_ends_at?: string | null;
        subscription_amount?: number | null;
        subscription_currency?: string | null;
        card_brand?: string | null;
        card_last_four?: string | null;
        billing_country?: string | null;
        last_login?: string | null;
        trial_ends_at?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: 'admin' | 'user';
        plan?: 'freemium' | 'premium';
        subscription_id?: string | null;
        subscription_status?: string | null;
        subscription_renews_at?: string | null;
        subscription_ends_at?: string | null;
        subscription_amount?: number | null;
        subscription_currency?: string | null;
        card_brand?: string | null;
        card_last_four?: string | null;
        billing_country?: string | null;
        last_login?: string | null;
        trial_ends_at?: string | null;
    }
}
