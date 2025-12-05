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

                const user = db.findUserByEmail(credentials.email);

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
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                const dbUser = db.findUserById(user.id);
                // @ts-ignore
                token.role = dbUser?.role || 'user';
                // @ts-ignore
                token.plan = dbUser?.plan || 'freemium';
            }
            return token;
        },
    },
    pages: {
        signIn: "/login",
    },
};
