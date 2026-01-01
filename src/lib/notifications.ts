
import nodemailer from 'nodemailer';
import { db } from './db';
import { getErrorNotificationEmailHtml } from './email-templates';

// Reuse the transporter logic if it exists elsewhere, or define here. 
// Assuming standard env vars for now.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // Default or check env
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendErrorNotification(error: any, context: string) {
    try {
        const emails = await db.getAdminNotificationEmails();

        if (!emails || emails.length === 0) {
            console.log("No admin notification emails configured. Skipping alert.");
            return;
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        const stackTrace = error instanceof Error ? error.stack : undefined;

        const html = getErrorNotificationEmailHtml(context, errorMessage, stackTrace);

        // Send to all configured recipients
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"System Alert" <no-reply@url-shortener.com>',
            to: emails.join(', '), // Send to list
            subject: `[ALERT] System Error in ${context}`,
            html: html,
        });

        console.log(`Error notification sent to ${emails.length} recipients.`);

    } catch (notificationError) {
        // Fallback logging if notification itself fails
        console.error("Failed to send error notification email:", notificationError);
    }
}
