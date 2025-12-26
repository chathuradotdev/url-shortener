import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";

export default async function ShortCodePage({
    params,
}: {
    params: Promise<{ shortCode: string }>;
}) {
    const { shortCode } = await params;
    const url = await db.findUrlByShortCode(shortCode);

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

    await db.incrementUrlClicks(shortCode);
    await db.trackUrlVisit(shortCode, {
        user_agent: userAgent,
        referrer: referer,
        ip: ip,
        browser,
        device,
        os,
        country: "Unknown",
        city: "Unknown"
    });

    // Deep Linking Logic
    if (device === "Mobile" || device === "Tablet") {
        let deepLink = null;
        if (os === "Android" && url.android_deep_link) {
            deepLink = url.android_deep_link;
        } else if (os === "iOS" && url.ios_deep_link) {
            deepLink = url.ios_deep_link;
        }

        if (deepLink) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
                    <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-sm mx-4">
                        <div className="mb-4">
                            <svg className="w-12 h-12 mx-auto text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Opening App...</h2>
                        <p className="text-gray-500 text-sm mb-6">If the app doesn't open automatically, you will be redirected to the website shortly.</p>

                        <a
                            href={deepLink}
                            className="block w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-3"
                        >
                            Open App
                        </a>
                        <a
                            href={url.original_url}
                            className="block w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Continue to Website
                        </a>
                    </div>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        window.location.href = "${deepLink}"; 
                        setTimeout(function() { 
                            window.location.href = "${url.original_url}"; 
                        }, 2500);
                    `}} />
                </div>
            );
        }
    }

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
