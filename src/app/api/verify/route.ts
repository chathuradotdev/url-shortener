import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { shortCode, password } = await req.json();

        if (!shortCode || !password) {
            return NextResponse.json(
                { message: "Missing short code or password" },
                { status: 400 }
            );
        }

        const url = db.findUrlByShortCode(shortCode);

        if (!url) {
            return NextResponse.json(
                { message: "URL not found" },
                { status: 404 }
            );
        }

        if (url.status === 'removed') {
            return NextResponse.json(
                { message: "This URL has been removed." },
                { status: 410 }
            );
        }

        // If no password set, just return success (though this route shouldn't be called ideally)
        if (!url.password) {
            return NextResponse.json({ originalUrl: url.original_url });
        }

        const isValid = await compare(password, url.password);

        if (!isValid) {
            return NextResponse.json(
                { message: "Incorrect password" },
                { status: 401 }
            );
        }

        // Log the analytics visit here since we are "redirecting" now
        // Or we rely on the client to redirect? 
        // Ideally we track it when they actually go.
        // Let's defer analytics tracking to the client side or when they access the final link logic?
        // Actually, for password protected links, the [shortCode] route redirects to /verify/[shortCode].
        // Then /verify page asks for password.
        // If correct, client redirects to original URL.
        // We should PROBABLY count a click here since they "unlocked" it.
        // But the [shortCode] route already counted a click when it redirected to /verify?
        // Let's check [shortCode] route logic later.

        return NextResponse.json({ originalUrl: url.original_url });

    } catch (error) {
        console.error("Verify error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
