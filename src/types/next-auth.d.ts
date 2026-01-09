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
            last_login?: string | null;
            trial_ends_at?: string | null;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        role?: 'admin' | 'user';
        plan?: 'freemium' | 'premium';
        last_login?: string | null;
        trial_ends_at?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: 'admin' | 'user';
        plan?: 'freemium' | 'premium';
        last_login?: string | null;
        trial_ends_at?: string | null;
    }
}
