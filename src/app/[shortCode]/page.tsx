import { db } from "@/lib/db";
import { redirect, notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ shortCode: string }> }) {
    const { shortCode } = await params;
    const url = await db.findUrlByShortCode(shortCode);

    if (!url || !url.social_title) {
        return {
            title: "Shortened URL",
        };
    }

    return {
        title: url.social_title,
        description: url.social_description || "Click to see more",
        openGraph: {
            title: url.social_title,
            description: url.social_description || "Click to see more",
            images: url.social_image ? [{ url: url.social_image }] : [],
            url: `https://linkjet.co/${shortCode}`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: url.social_title,
            description: url.social_description || "Click to see more",
            images: url.social_image ? [url.social_image] : [],
        },
    };
}

export default async function ShortCodePage({
    params,
}: {
    params: Promise<{ shortCode: string }>;
}) {
    const { shortCode } = await params;
    const headersList = await headers();
    const host = headersList.get("host") || "";

    // Determine if this is a custom domain
    // We compare against the system domain (e.g. from env or hardcoded default)
    // If NEXT_PUBLIC_APP_URL is "https://myapp.com", hostname is "myapp.com"

    let domain: string | null = null;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    let systemHost = "";

    try {
        if (appUrl) {
            systemHost = new URL(appUrl).host;
        }
    } catch (e) {
        // fallback if env is just a domain or invalid
        systemHost = appUrl;
    }

    // Also handle localhost in dev
    // Check if the host is a registered custom domain in our system
    // We only treat it as a custom domain if it's explicitly registered in our database.
    // Otherwise, we treat it as a request to the main system (domain = null).
    if (!host.includes("localhost") && host !== systemHost && !host.endsWith(".vercel.app") && host !== "linkjet.co") {
        try {
            const customDomain = await db.findCustomDomain(host);
            if (customDomain) {
                domain = host;
            }
        } catch (error) {
            console.error("Error ensuring custom domain:", error);
            // Fallback to null domain (system) in case of error
        }
    }

    const url = await db.findUrlByShortCode(shortCode, domain);

    if (!url) {
        // Try to find a bio page
        const bioPage = await db.getBioPageBySlug(shortCode);
        if (bioPage) {
            redirect(`/bio/${shortCode}`);
        }
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

    if (url.burn_after_reading && url.clicks >= (url.burn_visit_limit || 1)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white font-mono">
                <div className="p-8 max-w-md w-full text-center border border-red-900/50 bg-red-950/10 rounded-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>
                    <h1 className="text-4xl font-bold text-red-500 mb-6 flex items-center justify-center gap-3">
                        <span className="text-5xl">🔥</span>
                        <span>BURNT</span>
                    </h1>
                    <p className="text-red-300/80 text-lg mb-8 leading-relaxed">
                        This link has self-destructed.<br />
                        The message is gone forever.
                    </p>
                    <div className="text-xs text-red-900/50 uppercase tracking-widest">
                        System Message: 410 Gone
                    </div>
                </div>
            </div>
        );
    }

    if (url.expires_at && new Date(url.expires_at) < new Date()) {
        if (url.expiration_redirect_url) {
            redirect(url.expiration_redirect_url);
        }
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
    // headersList is already defined above
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

    // Geo Targeting Logic
    const country = headersList.get("x-vercel-ip-country") || "Unknown";
    let targetUrl = url.original_url;

    if (url.targeting_enabled && url.geo_targeting) {
        // Cast to Record<string, string> if TS complains, or rely on loose types from DB helper
        const geoRules = url.geo_targeting as Record<string, string>;
        if (country !== "Unknown" && geoRules[country]) {
            targetUrl = geoRules[country];
        }
    }

    // Time Targeting Logic
    const timezone = headersList.get("x-vercel-ip-timezone");

    if (url.time_targeting && Array.isArray(url.time_targeting) && url.time_targeting.length > 0 && timezone) {
        try {
            const now = new Date();
            // Get current time in user's timezone
            const userTimeStr = now.toLocaleTimeString("en-US", { timeZone: timezone, hour12: false, hour: '2-digit', minute: '2-digit' }); // "14:30"
            const userDay = now.toLocaleDateString("en-US", { timeZone: timezone, weekday: 'short' }); // "Mon"

            // Find a matching rule
            const matchedRule = url.time_targeting.find((rule: any) => {
                // Check Day
                if (!rule.days.includes(userDay)) return false;

                // Check Time Range
                if (userTimeStr >= rule.startTime && userTimeStr <= rule.endTime) {
                    return true;
                }
                return false;
            });

            if (matchedRule) {
                targetUrl = matchedRule.url;
            }
        } catch (e) {
            console.error("Time targeting error:", e);
        }
    }

    // --- Traffic Splitting & Link Rotation Logic ---
    if (url.rotation_enabled && url.rotation_rules && url.rotation_rules.length > 0) {
        const rules = url.rotation_rules;
        if (url.rotation_mode === 'sequential') {
            // Sequential / Round Robin
            const index = (url.clicks || 0) % rules.length;
            if (rules[index]?.url) {
                targetUrl = rules[index].url;
            }
        } else {
            // Weighted Random (Default for Split Testing)
            const totalWeight = rules.reduce((sum: number, rule: any) => sum + (rule.weight || 0), 0);

            if (totalWeight > 0) {
                let random = Math.random() * totalWeight;
                for (const rule of rules) {
                    if (random < (rule.weight || 0)) {
                        targetUrl = rule.url;
                        break;
                    }
                    random -= (rule.weight || 0);
                }
            }
        }
    }

    await db.incrementUrlClicks(shortCode);
    await db.trackUrlVisit(shortCode, {
        user_agent: userAgent,
        referrer: referer,
        ip: ip,
        browser,
        device,
        os,
        country: country !== "Unknown" ? country : "Unknown", // store the code
        city: "Unknown"
    });

    // Interim Page Logic (Greetings / Warnings)
    if (url.interim_page_enabled) {
        let showInterim = true;

        // Check visit limit if set
        if (url.interim_visit_limit && url.interim_visit_limit > 0) {
            const currentCount = url.interim_visit_count || 0;
            if (currentCount >= url.interim_visit_limit) {
                showInterim = false;
            } else {
                // Increment count if showing
                await db.incrementInterimVisitCount(url.id);
            }
        }

        if (showInterim) {
            const { InterimRedirect } = await import("@/components/InterimRedirect");
            return (
                <InterimRedirect
                    originalUrl={targetUrl}
                    message={url.interim_message}
                    delay={url.interim_duration || 5}
                />
            );
        }
    }

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
                            href={targetUrl}
                            className="block w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Continue to Website
                        </a>
                    </div>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                        window.location.href = "${deepLink}"; 
                        setTimeout(function() { 
                            window.location.href = "${targetUrl}"; 
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
                    src={targetUrl}
                    className="w-full h-full border-0"
                    title="Content"
                />
            </div>
        );
    }

    if (url.permanent_redirect) {
        permanentRedirect(targetUrl);
    }

    redirect(targetUrl);
}
