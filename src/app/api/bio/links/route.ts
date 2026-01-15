import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamId = req.nextUrl.searchParams.get("teamId");

    try {
        let bioPage = null;
        if (teamId) {
            // Check if user is in team
            const role = await db.getUserTeamRole(teamId, session.user.id);
            if (!role) return NextResponse.json({ error: "Access denied" }, { status: 403 });
            bioPage = await db.getTeamBioPage(teamId);
        } else {
            bioPage = await db.getBioPageByUserId(session.user.id);
        }

        if (!bioPage) return NextResponse.json({ error: "Bio page not found" }, { status: 404 });

        const links = await db.getBioLinks(bioPage.id);
        return NextResponse.json(links);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, url, icon, position, teamId, type, animation } = body;

        let bioPage = null;
        if (teamId) {
            // Check if user has permission (admin/owner to add links?)
            const role = await db.getUserTeamRole(teamId, session.user.id);
            if (role !== 'owner' && role !== 'admin' && role !== 'member') {
                return NextResponse.json({ error: "Permission denied" }, { status: 403 });
            }
            bioPage = await db.getTeamBioPage(teamId);
        } else {
            bioPage = await db.getBioPageByUserId(session.user.id);
        }

        if (!bioPage) return NextResponse.json({ error: "Bio page not found" }, { status: 404 });

        // Check premium
        if (session.user.plan !== 'premium' && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Premium required" }, { status: 403 });
        }

        const currentLinks = await db.getBioLinks(bioPage.id);
        const nextPosition = position ?? (currentLinks.length > 0 ? Math.max(...currentLinks.map(l => l.position)) + 1 : 0);

        const newLink = await db.addBioLink({
            bio_page_id: bioPage.id,
            title,
            url,
            icon,
            position: nextPosition,
            is_active: true,
            type,
            animation
        });

        return NextResponse.json(newLink);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// Reorder links
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { items, teamId } = body; // Array of { id, position }

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid items" }, { status: 400 });
        }

        let bioPage = null;
        if (teamId) {
            const role = await db.getUserTeamRole(teamId, session.user.id);
            if (role !== 'owner' && role !== 'admin' && role !== 'member') {
                return NextResponse.json({ error: "Permission denied" }, { status: 403 });
            }
            bioPage = await db.getTeamBioPage(teamId);
        } else {
            bioPage = await db.getBioPageByUserId(session.user.id);
        }

        if (!bioPage) return NextResponse.json({ error: "Bio page not found" }, { status: 404 });

        const updatePromises = items.map(async (item: any) => {
            await db.updateBioLink(item.id, { position: item.position });
        });

        await Promise.all(updatePromises);

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
