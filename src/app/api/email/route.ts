import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { limiter } from "@/lib/rate-limit";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        // 2 requests per minute (strict anti-spam)
        if (!limiter.check(2, ip + "_email")) {
            return NextResponse.json(
                { message: "Rate limit exceeded" },
                { status: 429 }
            );
        }

        const { email, shortUrl } = await req.json();

        if (!email || !shortUrl) {
            return NextResponse.json(
                { message: "Email and Short URL are required" },
                { status: 400 }
            );
        }

        // Validate that the URL belongs to this domain and exists
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        if (!shortUrl.startsWith(baseUrl)) {
            return NextResponse.json(
                { message: "Invalid URL domain" },
                { status: 400 }
            );
        }

        const shortCode = shortUrl.split("/").pop();
        const hasUrl = shortCode ? await db.findUrlByShortCode(shortCode) : null;
        if (!shortCode || !hasUrl) {
            return NextResponse.json(
                { message: "Invalid Short URL" },
                { status: 400 }
            );
        }

        // Create a transporter
        // For demo purposes, we'll try to use Ethereal or just log if env vars are missing
        let transporter;

        if (process.env.SMTP_HOST) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        } else {
            // Mock transporter for development
            console.log(`[MOCK EMAIL] Sending email to ${email} with link: ${shortUrl}`);
            return NextResponse.json({ message: "Email sent (mocked)" });
        }

        await transporter.sendMail({
            from: '"URL Shortener" <no-reply@example.com>',
            to: email,
            subject: "Your Shortened URL",
            text: `Here is your shortened URL: ${shortUrl}`,
            html: `<p>Here is your shortened URL: <a href="${shortUrl}">${shortUrl}</a></p>`,
        });

        return NextResponse.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Email error:", error);
        return NextResponse.json(
            { message: "Failed to send email" },
            { status: 500 }
        );
    }
}
