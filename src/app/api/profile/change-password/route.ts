import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fetch user to get current password hash
        const { data: user } = await supabase
            .from("users")
            .select("password_hash")
            // @ts-ignore
            .eq("id", session.user.id)
            .single();

        if (!user || !user.password_hash) {
            return NextResponse.json({ error: "You don't have a password set. Please use password reset or login with provider." }, { status: 400 });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        const { error } = await supabase
            .from("users")
            .update({ password_hash: hashedPassword })
            // @ts-ignore
            .eq("id", session.user.id);

        if (error) {
            console.error("Error updating password:", error);
            return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Change password failed:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
