import { NextResponse } from "next/server";
import { getContactFormEmailHtml } from "@/lib/email-templates";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const emailHtml = getContactFormEmailHtml(name, email, message);

        // In a real app, use environment variables for SMTP
        // For dev, we'll log it
        console.log("---------------------------------------------------");
        console.log(`New Contact Form Submission`);
        console.log(`To: ${adminEmail}`);
        console.log(`From: ${name} <${email}>`);
        console.log(`Message: ${message}`);
        console.log("---------------------------------------------------");

        // Attempt to send email if configured (mocking for now)
        // const transporter = nodemailer.createTransport({ ... });
        // await transporter.sendMail({
        //     to: adminEmail,
        //     subject: `New Contact Message from ${name}`,
        //     html: emailHtml
        // });

        return NextResponse.json({ message: "Message sent successfully" });

    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
