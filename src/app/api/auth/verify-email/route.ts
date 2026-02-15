
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { limiter } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { getWelcomeEmailHtml } from "@/lib/email-templates";
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        if (!limiter.check(10, ip + "_verify_email")) {
            return NextResponse.json(
                { message: "Too many attempts. Please try again later." },
                { status: 429 }
            );
        }

        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json(
                { message: "Email and code are required" },
                { status: 400 }
            );
        }

        const user = await db.findUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (user.email_verified) {
            return NextResponse.json(
                { message: "Email already verified" },
                { status: 200 }
            );
        }

        if (user.verification_code !== code) {
            return NextResponse.json(
                { message: "Invalid verification code" },
                { status: 400 }
            );
        }

        if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
            return NextResponse.json(
                { message: "Verification code has expired" },
                { status: 400 }
            );
        }

        await db.verifyUser(user.id);

        // Send Welcome Email
        try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const profileUrl = `${appUrl}/dashboard/settings`;

            await sendEmail({
                to: email,
                subject: "Welcome to LinkJet!",
                html: getWelcomeEmailHtml(user.username || "User", profileUrl),
            });
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // Don't fail the request if email fails, as verification succeeded
        }

        return NextResponse.json(
            { message: "Email verified successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
