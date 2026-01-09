import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const teams = await db.getTeams(session.user.id);
        return NextResponse.json(teams);
    } catch (error) {
        console.error("Failed to fetch teams:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name } = await req.json();
        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Team name is required" }, { status: 400 });
        }

        const team = await db.createTeam(name, session.user.id);
        if (!team) {
            return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
        }

        return NextResponse.json(team);
    } catch (error) {
        console.error("Failed to create team:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
