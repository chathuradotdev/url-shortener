import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { getVerificationEmailHtml } from "@/lib/email-templates";
import crypto from "crypto";

import { limiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        // 5 requests per minute (prevents automated account creation spam)
        if (!limiter.check(5, ip + "_register")) {
            return NextResponse.json(
                { message: "Rate limit exceeded" },
                { status: 429 }
            );
        }

        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await db.findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 7 Day Free Trial
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 7);

        const user = await db.createUser({
            username,
            email,
            password_hash: hashedPassword,
            trial_ends_at: trialEndsAt.toISOString(),
        });

        // Generate Verification Code
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const verificationExpires = new Date();
        verificationExpires.setMinutes(verificationExpires.getMinutes() + 30); // 30 mins

        await db.setUserVerificationCode(user.id, verificationCode, verificationExpires.toISOString());

        // Send Email
        await sendEmail({
            to: email,
            subject: "Verify your LinkJet account",
            html: getVerificationEmailHtml(verificationCode),
        });

        return NextResponse.json(
            { message: "User created successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
