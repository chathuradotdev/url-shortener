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

                const user = await db.findUserByEmail(credentials.email);

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
                session.user.last_login = token.last_login;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                let dbUser;

                if (account?.provider === 'google') {
                    // For Google, we must lookup by email as user.id is Google's ID
                    dbUser = await db.findUserByEmail(user.email!);

                    if (!dbUser) {
                        try {
                            dbUser = await db.createUser({
                                username: user.name || user.email!.split('@')[0],
                                email: user.email!,
                                image: user.image || undefined,
                            });
                        } catch (e) {
                            console.error("Error creating user from Google:", e);
                        }
                    }
                } else {
                    // For Credentials, user.id is already our DB UUID (from authorize)
                    dbUser = await db.findUserById(user.id);
                }

                if (dbUser) {
                    token.sub = dbUser.id;
                    // @ts-ignore
                    token.role = dbUser.role;
                    // @ts-ignore
                    token.plan = dbUser.plan;
                    // @ts-ignore
                    token.last_login = dbUser.last_login;
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
                    const dbUser = await db.findUserByEmail(user.email);
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
