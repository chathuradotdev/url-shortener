import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const shortCode = searchParams.get("code");

    if (!shortCode) {
        return NextResponse.json({ message: "Short code is required" }, { status: 400 });
    }

    const url = await db.findUrlByShortCode(shortCode);

    if (!url) {
        return NextResponse.json({ message: "URL not found" }, { status: 404 });
    }

    // Fetch analytics events
    const events = await db.getUrlAnalytics(shortCode);

    // Helper to count occurrences
    const countBy = (arr: any[], key: string) => {
        return arr.reduce((acc, curr) => {
            const val = curr[key] || "Unknown";
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    };

    // 1. Daily Clicks (Last 7 Days)
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const dailyClicks = last7Days.map(date => {
        const count = events.filter(e => e.timestamp.startsWith(date)).length;
        return { date, count };
    });

    // 2. Aggregations
    const os = countBy(events, 'os');
    const browsers = countBy(events, 'browser');
    const countries = countBy(events, 'country');
    const referrers = countBy(events, 'referrer');

    return NextResponse.json({
        clicks: url.clicks, // Total from counter
        uniqueClicks: new Set(events.map(e => e.ip)).size, // Rudimentary unique visit count
        originalUrl: url.original_url,
        shortCode: url.short_code,
        createdAt: url.created_at,
        analytics: {
            daily: dailyClicks,
            os: (Object.entries(os) as [string, number][]).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
            browsers: (Object.entries(browsers) as [string, number][]).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
            countries: (Object.entries(countries) as [string, number][]).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
            referrers: (Object.entries(referrers) as [string, number][]).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
        }
    });
}
