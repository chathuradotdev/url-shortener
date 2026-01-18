import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const linkId = searchParams.get('linkId');

        if (!linkId) {
            return NextResponse.json({ error: "Missing linkId" }, { status: 400 });
        }

        const counts = await db.getPollVotes(linkId);
        return NextResponse.json({ counts });
    } catch (error: any) {
        console.error("Get Poll error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { linkId, optionId } = await req.json();

        if (!linkId || !optionId) {
            return NextResponse.json({ error: "Missing linkId or optionId" }, { status: 400 });
        }

        const headerList = await headers();
        const ip = headerList.get("x-forwarded-for") || "unknown";

        // If multiple IPs (proxy), take the first one
        const realIp = ip.split(',')[0].trim();

        const result = await db.votePoll(linkId, optionId, realIp);

        if (!result.success) {
            if (result.error === 'already_voted') {
                return NextResponse.json({ error: "You have already voted on this poll" }, { status: 409 });
            }
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Vote error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
