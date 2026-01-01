import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { id, original_url, expires_at, interim_page_enabled, interim_message, interim_duration, interim_visit_limit, targeting_enabled, geo_targeting } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "URL ID is required" }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabase
            .from("urls")
            .update({
                original_url,
                expires_at: expires_at ? new Date(expires_at).toISOString() : null,
                interim_page_enabled,
                interim_message,
                interim_duration: interim_duration ? parseInt(interim_duration) : 5,
                interim_visit_limit: interim_visit_limit ? parseInt(interim_visit_limit) : 0,
                targeting_enabled,
                geo_targeting
            })
            .eq("id", id);

        if (error) {
            console.error("Supabase update error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Update failed:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
