import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { username } = await req.json();

        if (!username || username.trim().length < 3) {
            return NextResponse.json({ error: "Username must be at least 3 characters long" }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Check if username is taken by another user
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("username", username)
            // @ts-ignore
            .neq("id", session.user.id)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        const { error } = await supabase
            .from("users")
            .update({ username })
            // @ts-ignore
            .eq("id", session.user.id);

        if (error) {
            console.error("Error updating profile:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Profile update failed:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
