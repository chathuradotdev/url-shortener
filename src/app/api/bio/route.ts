import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const getAll = req.nextUrl.searchParams.get("all") === "true";
    const teamId = req.nextUrl.searchParams.get("teamId");

    try {
        const user = await db.findUserByEmail(session.user.email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (getAll) {
            const bioPages = await db.getBioPages(user.id, teamId);
            return NextResponse.json(bioPages);
        }

        const bioPage = await db.getBioPageByUserId(user.id, teamId);
        if (!bioPage) {
            return NextResponse.json({ exists: false }, { status: 200 });
        }

        return NextResponse.json(bioPage);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await db.findUserByEmail(session.user.email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let isPremium = user.plan === 'premium';
        if (user.plan === 'freemium' && user.trial_ends_at) {
            if (new Date(user.trial_ends_at) > new Date()) {
                isPremium = true;
            }
        }

        if (!isPremium && user.role !== 'admin') {
            return NextResponse.json({ error: "Premium required" }, { status: 403 });
        }

        const body = await req.json();
        const { id, title, description, avatar_url, theme, slug, team_id } = body;

        let bioPage;
        if (id) {
            // Update existing page by ID
            bioPage = await db.updateBioPageById(id, {
                title,
                description,
                avatar_url,
                theme,
                slug,
                team_id: team_id || null
            });
        } else {
            // Create new page
            // Default slug to username + random if not provided or if already exists
            const baseSlug = (slug || user.username || user.email?.split('@')[0] || 'page').toLowerCase().replace(/[^a-z0-9]/g, '-');
            let finalSlug = baseSlug;

            // Check slug uniqueness
            const slugTaken = await db.getBioPageBySlug(finalSlug);
            if (slugTaken || !finalSlug) {
                finalSlug = `${baseSlug || 'page'}-${Math.random().toString(36).slice(2, 6)}`;
            }

            console.log("Creating bio page with slug:", finalSlug);

            bioPage = await db.createBioPage({
                user_id: user.id,
                slug: finalSlug,
                title: title || user.username || "My Page",
                description: description || "Welcome to my page!",
                avatar_url: avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${finalSlug}`,
                theme: theme || {
                    backgroundColor: "#ffffff",
                    textColor: "#000000",
                    buttonBgColor: "#f3f4f6",
                    buttonTextColor: "#1f2937",
                    shadowType: 'soft'
                },
                team_id: team_id || null
            });
        }

        return NextResponse.json(bioPage);
    } catch (e: any) {
        console.error("Bio Page POST Error:", e);
        return NextResponse.json({ error: e.message || "Something went wrong" }, { status: 500 });
    }
}
