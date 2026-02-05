
import nodemailer from "nodemailer";

interface SendEmailOptions {
    to: string;
    subject: string;
    text?: string;
    html: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
    if (process.env.SMTP_HOST) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"LinkJet" <no-reply@linkjet.co>',
            to,
            subject,
            text: text || "",
            html,
        });
    } else {
        // Mock email logging for development
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
        console.log("--- Email Content ---");
        console.log(text || "HTML Content (check template logic for code if not plain text)");
        console.log(html);
        console.log("---------------------");
    }
}
