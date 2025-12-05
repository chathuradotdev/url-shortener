import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: { shortCode: string } }
) {
    const shortCode = params.shortCode;
    const url = db.findUrlByShortCode(shortCode);

    if (url) {
        if (url.status === 'removed') {
            return NextResponse.json({ message: "This URL has been removed for violating our terms of service." }, { status: 410 });
        }

        if (url.expires_at && new Date(url.expires_at) < new Date()) {
            return NextResponse.json({ message: "This URL has expired." }, { status: 410 });
        }

        // Analytics Tracking
        const userAgent = request.headers.get("user-agent") || "Unknown";
        const referer = request.headers.get("referer") || "Direct";
        const ip = request.headers.get("x-forwarded-for") || "Unknown";

        // Simple UA Parsing
        let browser = "Other";
        if (userAgent.includes("Chrome")) browser = "Chrome";
        else if (userAgent.includes("Firefox")) browser = "Firefox";
        else if (userAgent.includes("Safari")) browser = "Safari";
        else if (userAgent.includes("Edge")) browser = "Edge";

        let device = "Desktop";
        if (userAgent.includes("Mobile") || userAgent.includes("Android") || userAgent.includes("iPhone")) {
            device = "Mobile";
        } else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
            device = "Tablet";
        }

        let os = "Unknown";
        if (userAgent.includes("Windows")) os = "Windows";
        else if (userAgent.includes("Mac OS")) os = "macOS";
        else if (userAgent.includes("Linux")) os = "Linux";
        else if (userAgent.includes("Android")) os = "Android";
        else if (userAgent.includes("iOS")) os = "iOS";

        db.incrementUrlClicks(shortCode);
        db.trackUrlVisit(shortCode, {
            user_agent: userAgent,
            referrer: referer,
            ip: ip,
            browser,
            device,
            os,
            country: "Unknown", // Placeholder as we can't use geoip-lite
            city: "Unknown"
        });

        return NextResponse.redirect(url.original_url);
    }

    return NextResponse.json({ message: "URL not found" }, { status: 404 });
}
