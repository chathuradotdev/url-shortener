import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;

    try {
        // Verify user is in the team
        const role = await db.getUserTeamRole(teamId, session.user.id);
        if (!role) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const members = await db.getTeamMembers(teamId);
        return NextResponse.json(members);
    } catch (error) {
        console.error("Failed to fetch team members:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 410 });
    }

    const { id: teamId } = await params;

    try {
        // Only owner or admin can add members
        const userRole = await db.getUserTeamRole(teamId, session.user.id);
        if (userRole !== 'owner' && userRole !== 'admin') {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        const { email, role = 'member' } = await req.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const targetUser = await db.findUserByEmail(email);
        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        try {
            await db.addTeamMember(teamId, targetUser.id, role);
            return NextResponse.json({ success: true });
        } catch (e) {
            return NextResponse.json({ error: "User already in team or error occurred" }, { status: 400 });
        }
    } catch (error) {
        console.error("Failed to add team member:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
