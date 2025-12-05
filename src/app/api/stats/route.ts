import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const shortCode = searchParams.get("code");

    if (!shortCode) {
        return NextResponse.json({ message: "Short code is required" }, { status: 400 });
    }

    const url = db.findUrlByShortCode(shortCode);

    if (!url) {
        return NextResponse.json({ message: "URL not found" }, { status: 404 });
    }

    return NextResponse.json({
        clicks: url.clicks,
        originalUrl: url.original_url,
        shortCode: url.short_code,
        createdAt: url.created_at
    });
}
