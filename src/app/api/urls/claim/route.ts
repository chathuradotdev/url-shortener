
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/db";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { shortCodes } = body;

    if (!Array.isArray(shortCodes) || shortCodes.length === 0) {
        return NextResponse.json({ message: "No links provided" }, { status: 400 });
    }

    try {
        // Update urls where short_code is in list AND user_id is null
        // This ensures users can't claim other users' links
        const { data, error } = await supabase
            .from('urls')
            .update({ user_id: session.user.id })
            .in('short_code', shortCodes)
            .is('user_id', null)
            .select();

        if (error) throw error;

        return NextResponse.json({
            message: "Links claimed successfully",
            count: data?.length || 0
        });

    } catch (error: any) {
        console.error("Error claiming links:", error);
        return NextResponse.json({ message: error.message || "Failed to claim links" }, { status: 500 });
    }
}
