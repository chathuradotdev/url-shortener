import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: { shortCode: string } }
) {
    const shortCode = params.shortCode;
    const url = db.findUrlByShortCode(shortCode);

    if (url) {
        db.incrementUrlClicks(shortCode);
        return NextResponse.redirect(url.original_url);
    }

    return NextResponse.json({ message: "URL not found" }, { status: 404 });
}
