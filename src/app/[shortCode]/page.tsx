import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";

export default async function ShortCodePage({
    params,
}: {
    params: Promise<{ shortCode: string }>;
}) {
    const { shortCode } = await params;
    const url = db.findUrlByShortCode(shortCode);

    if (!url) {
        notFound();
    }

    if (url.status === 'removed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Link Removed</h1>
                    <p className="text-gray-600">This URL has been removed for violating our terms of service.</p>
                </div>
            </div>
        );
    }

    if (url.expires_at && new Date(url.expires_at) < new Date()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-orange-600 mb-4">Link Expired</h1>
                    <p className="text-gray-600">This URL has expired and is no longer available.</p>
                </div>
            </div>
        );
    }

    // Check for password protection
    if (url.password) {
        redirect(`/verify/${shortCode}`);
    }

    // Analytics Tracking
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "Unknown";
    const referer = headersList.get("referer") || "Direct";
    const ip = headersList.get("x-forwarded-for") || "Unknown";

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
        country: "Unknown",
        city: "Unknown"
    });

    if (url.cloaked) {
        return (
            <div className="h-screen w-screen overflow-hidden">
                <iframe
                    src={url.original_url}
                    className="w-full h-full border-0"
                    title="Content"
                />
            </div>
        );
    }

    redirect(url.original_url);
}
