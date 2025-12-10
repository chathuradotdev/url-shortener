import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";
import { hash } from "bcryptjs";
import { limiter } from "@/lib/rate-limit";

function generateShortCode(length = 6) {
    return crypto.randomBytes(length).toString("base64url").substring(0, length);
}

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        // 20 requests per minute limit
        if (!limiter.check(20, ip + "_shorten")) {
            return NextResponse.json(
                { message: "Rate limit exceeded" },
                { status: 429 }
            );
        }

        const session = await getServerSession(authOptions);
        const { originalUrl, customAlias, expiresAt, tags, password, cloaked } = await req.json();

        if (!originalUrl) {
            return NextResponse.json(
                { message: "URL is required" },
                { status: 400 }
            );
        }

        // Basic URL validation
        try {
            new URL(originalUrl);
        } catch (e) {
            return NextResponse.json(
                { message: "Invalid URL format" },
                { status: 400 }
            );
        }

        let shortCode;

        if (customAlias) {
            // Validate alias format (alphanumeric, hyphens, underscores)
            if (!/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
                return NextResponse.json(
                    { message: "Invalid alias format. Use letters, numbers, hyphens, and underscores only." },
                    { status: 400 }
                );
            }

            // Check if alias exists
            const existingUrl = await db.findUrlByShortCode(customAlias);
            if (existingUrl) {
                return NextResponse.json(
                    { message: "Alias already taken" },
                    { status: 409 }
                );
            }
            shortCode = customAlias;
        } else {
            shortCode = generateShortCode();
            // Ensure generated code is unique (simple retry logic could be added here)
            while (await db.findUrlByShortCode(shortCode)) {
                shortCode = generateShortCode();
            }
        }

        // @ts-ignore
        const userId = session?.user?.id || null;

        // Only allow expiration, tags, and password for registered users
        const expirationDate = userId && expiresAt ? expiresAt : null;
        const urlTags = userId && tags ? tags : [];
        const passwordHash = userId && password ? await hash(password, 10) : undefined;
        const isCloaked = userId && cloaked ? true : false;

        const newUrl = await db.createUrl({
            short_code: shortCode,
            original_url: originalUrl,
            user_id: userId,
            expires_at: expirationDate,
            tags: urlTags,
            password: passwordHash,
            cloaked: isCloaked,
        });

        // Construct the full short URL (assuming localhost for now, or use req.headers.host)
        // In production, use an environment variable for BASE_URL
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const shortUrl = `${baseUrl}/${shortCode}`;

        return NextResponse.json({
            shortCode,
            shortUrl,
            originalUrl,
        });
    } catch (error) {
        console.error("Shorten error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
