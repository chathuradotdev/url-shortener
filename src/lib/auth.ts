import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

console.log("Auth options loaded. Secret length:", process.env.NEXTAUTH_SECRET?.length);

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
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
                }
            }
            return token;
        },
    },
    pages: {
        signIn: "/login",
    },
};
