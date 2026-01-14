import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { linkId } = body;

        if (!linkId) {
            return NextResponse.json({ error: "Missing linkId" }, { status: 400 });
        }

        await db.incrementBioLinkClicks(linkId);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Failed to track click", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
