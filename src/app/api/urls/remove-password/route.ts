import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { urlId } = await req.json();

        if (!urlId) {
            return NextResponse.json(
                { message: "URL ID is required" },
                { status: 400 }
            );
        }

        // @ts-ignore
        const urls = await db.getUserUrls(session.user.id);
        const url = urls.find(u => u.id === urlId);

        if (!url) {
            return NextResponse.json(
                { message: "URL not found or unauthorized" },
                { status: 404 }
            );
        }

        await db.removeUrlPassword(urlId);

        return NextResponse.json({ message: "Password removed" });

    } catch (error) {
        console.error("Remove password error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
