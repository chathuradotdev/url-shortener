import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const bioPage = await db.getBioPageById(id);
        if (!bioPage) {
            return NextResponse.json({ error: "Bio page not found" }, { status: 404 });
        }

        // Security check
        if (bioPage.user_id !== session.user.id) {
            if (bioPage.team_id) {
                const role = await db.getUserTeamRole(bioPage.team_id, session.user.id);
                if (!role) return NextResponse.json({ error: "Access denied" }, { status: 403 });
            } else {
                return NextResponse.json({ error: "Access denied" }, { status: 403 });
            }
        }

        return NextResponse.json(bioPage);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const bioPage = await db.getBioPageById(id);
        if (!bioPage) {
            return NextResponse.json({ error: "Bio page not found" }, { status: 404 });
        }

        // Only owner can delete
        if (bioPage.user_id !== session.user.id) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        await db.deleteBioPage(id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
