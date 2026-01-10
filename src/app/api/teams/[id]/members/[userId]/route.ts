import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string; userId: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId, userId: targetUserId } = await params;

    try {
        const userRole = await db.getUserTeamRole(teamId, session.user.id);

        // Owner can remove anyone. Admin can remove members/viewers.
        // Users can remove themselves (leave team).

        const isSelf = session.user.id === targetUserId;
        const targetRole = await db.getUserTeamRole(teamId, targetUserId);

        if (!targetRole) {
            return NextResponse.json({ error: "User is not in this team" }, { status: 404 });
        }

        let canRemove = isSelf;
        if (userRole === 'owner') canRemove = true;
        if (userRole === 'admin' && targetRole !== 'owner' && targetRole !== 'admin') canRemove = true;

        if (!canRemove) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        // Prevent removing the only owner?
        if (targetRole === 'owner') {
            const members = await db.getTeamMembers(teamId);
            const owners = members.filter(m => m.role === 'owner');
            if (owners.length === 1) {
                return NextResponse.json({ error: "Team must have at least one owner" }, { status: 400 });
            }
        }

        await db.removeTeamMember(teamId, targetUserId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to remove team member:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
