import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email, shortUrl } = await req.json();

        if (!email || !shortUrl) {
            return NextResponse.json(
                { message: "Email and Short URL are required" },
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
