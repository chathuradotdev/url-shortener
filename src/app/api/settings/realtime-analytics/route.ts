
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const enabled = await db.getRealtimeAnalyticsEnabled();
        return NextResponse.json({ enabled });
    } catch (error) {
        return NextResponse.json({ enabled: true }, { status: 500 });
    }
}
