import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { company_branding_type, company_branding_text, company_branding_image } = await req.json();

        // Validate branding type
        const validTypes = ['default', 'text', 'image', null];
        if (!validTypes.includes(company_branding_type)) {
            return NextResponse.json({ error: "Invalid branding type" }, { status: 400 });
        }

        // Validate text length if text type
        if (company_branding_type === 'text' && company_branding_text) {
            if (company_branding_text.length > 50) {
                return NextResponse.json({ error: "Branding text must be 50 characters or less" }, { status: 400 });
            }
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase
            .from("users")
            .update({
                company_branding_type,
                company_branding_text,
                company_branding_image,
            })
            .eq("id", session.user.id)
            .select()
            .single();

        if (error) {
            console.error("Error updating branding:", error);
            return NextResponse.json({ error: "Failed to update branding" }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Branding update error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
