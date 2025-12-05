import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { getPasswordResetEmailHtml } from "@/lib/email-templates";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const user = db.findUserByEmail(email);
        if (!user) {
            // Return 200 even if user not found to prevent enumeration
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
        }

        const token = randomUUID();
        // Token expires in 1 hour
        const expiry = new Date(Date.now() + 3600000).toISOString();

        db.setUserResetToken(user.id, token, expiry);

        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
        const emailHtml = getPasswordResetEmailHtml(resetLink);

        // In a real app, use environment variables for SMTP
        // For dev, we'll log it or try to use a test account if configured
        console.log("---------------------------------------------------");
        console.log(`Password Reset Link for ${email}: ${resetLink}`);
        console.log("---------------------------------------------------");
        // console.log("Generated Email HTML:", emailHtml); // Uncomment to see HTML

        // Attempt to send email if configured (mocking for now as we don't have creds)
        // const transporter = nodemailer.createTransport({ ... });
        // await transporter.sendMail({ ... });

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
