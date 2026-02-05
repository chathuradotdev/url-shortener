import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

console.log("Auth options loaded. Secret length:", process.env.NEXTAUTH_SECRET?.length);

if (!process.env.NEXTAUTH_SECRET) {
    console.warn("NEXTAUTH_SECRET is missing. This will cause authentication failures.");
}

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev",  // Prevents hard crash but warns
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                let user;
                try {
                    user = await db.findUserByEmail(credentials.email);
                } catch (e) {
                    console.error("Auth Error (findUserByEmail):", e);
                    return null;
                }

                if (!user || !user.password_hash) {
                    return null;
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );

                if (!isValid) {
                    return null;
                }

                if (user.status === 'banned') {
                    throw new Error("Your account has been suspended.");
                }

                if (!user.email_verified) {
                    throw new Error("Please verify your email address.");
                }

                return {
                    id: user.id,
                    name: user.username,
                    email: user.email,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-ignore
                session.user.id = token.sub;
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.plan = token.plan;
                // @ts-ignore
                session.user.subscription_id = token.subscription_id;
                // @ts-ignore
                session.user.subscription_status = token.subscription_status;
                // @ts-ignore
                session.user.subscription_renews_at = token.subscription_renews_at;
                // @ts-ignore
                session.user.subscription_ends_at = token.subscription_ends_at;
                // @ts-ignore
                session.user.subscription_amount = token.subscription_amount;
                // @ts-ignore
                session.user.subscription_currency = token.subscription_currency;
                // @ts-ignore
                session.user.card_brand = token.card_brand;
                // @ts-ignore
                session.user.card_last_four = token.card_last_four;
                // @ts-ignore
                session.user.billing_country = token.billing_country;
                // @ts-ignore
                session.user.last_login = token.last_login;
                // @ts-ignore
                session.user.trial_ends_at = token.trial_ends_at;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                let dbUser;

                if (account?.provider === 'google') {
                    // For Google, we must lookup by email as user.id is Google's ID
                    try {
                        dbUser = await db.findUserByEmail(user.email!);
                    } catch (e) {
                        console.error("JWT Error (findUserByEmail):", e);
                        dbUser = null;
                    }

                    if (!dbUser) {
                        try {
                            dbUser = await db.createUser({
                                username: user.name || user.email!.split('@')[0],
                                email: user.email!,
                                image: user.image || undefined,
                            });
                            // Auto-verify Google users
                            if (dbUser) await db.verifyUser(dbUser.id);
                        } catch (e) {
                            console.error("Error creating user from Google:", e);
                        }
                    } else if (!dbUser.email_verified) {
                        // Trust Google means verified
                        await db.verifyUser(dbUser.id);
                        dbUser.email_verified = true;
                    }
                } else {
                    // For Credentials, user.id is already our DB UUID (from authorize)
                    try {
                        dbUser = await db.findUserById(user.id);
                    } catch (e) {
                        console.error("JWT Error (findUserById):", e);
                        dbUser = null;
                    }
                }

                if (dbUser) {
                    token.sub = dbUser.id;
                    // @ts-ignore
                    token.role = dbUser.role;

                    // Check for active trial
                    let effectivePlan = dbUser.plan;
                    if (dbUser.plan === 'freemium' && dbUser.trial_ends_at) {
                        const trialEnd = new Date(dbUser.trial_ends_at);
                        if (trialEnd > new Date()) {
                            effectivePlan = 'premium';
                        }
                    }

                    // @ts-ignore
                    token.plan = effectivePlan;
                    // @ts-ignore
                    token.subscription_id = dbUser.subscription_id;
                    // @ts-ignore
                    token.subscription_status = dbUser.subscription_status;
                    // @ts-ignore
                    token.subscription_renews_at = dbUser.subscription_renews_at;
                    // @ts-ignore
                    token.subscription_ends_at = dbUser.subscription_ends_at;
                    // @ts-ignore
                    token.subscription_amount = dbUser.subscription_amount;
                    // @ts-ignore
                    token.subscription_currency = dbUser.subscription_currency;
                    // @ts-ignore
                    token.card_brand = dbUser.card_brand;
                    // @ts-ignore
                    token.card_last_four = dbUser.card_last_four;
                    // @ts-ignore
                    token.billing_country = dbUser.billing_country;
                    // @ts-ignore
                    token.last_login = dbUser.last_login;
                    // @ts-ignore
                    token.trial_ends_at = dbUser.trial_ends_at;
                }
            }
            return token;
        },
    },
    events: {
        async signIn({ user }) {
            if (user?.id) {
                // user.id might be the Google ID or the DB ID depending on flow
                // But in 'signIn' event, 'user' object is what returns from 'authorize' or 'profile'
                // If credentials provider, user is what 'authorize' returns (contains DB ID)
                // If google provider, user contains profile info. We need to handle this.

                // However, the `jwt` callback runs before this or in parallel?
                // Actually `signIn` event receives the user object.

                // Let's rely on finding the user by email if ID lookup fails or is ambiguous.
                // Or safely, just look up by email.
                if (user.email) {
                    let dbUser;
                    try {
                        dbUser = await db.findUserByEmail(user.email);
                    } catch (e) {
                        console.error("SignIn Event Error:", e);
                    }
                    if (dbUser) {
                        try {
                            const { headers } = await import("next/headers");
                            const headerList = await headers();
                            const ip = headerList.get("x-forwarded-for") || undefined;
                            const userAgent = headerList.get("user-agent") || undefined;
                            await db.updateLastLogin(dbUser.id, ip, userAgent);
                        } catch (e) {
                            console.error("Failed to fetch headers in signIn event:", e);
                            await db.updateLastLogin(dbUser.id);
                        }
                    }
                }
            }
        }
    },
    pages: {
        signIn: "/login",
    },
};
