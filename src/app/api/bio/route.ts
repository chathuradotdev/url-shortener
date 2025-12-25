import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await db.findUserByEmail(session.user.email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const bioPage = await db.getBioPageByUserId(user.id);
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

        if (user.plan !== 'premium' && user.role !== 'admin') {
            return NextResponse.json({ error: "Premium required" }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, avatar_url, theme, slug } = body;

        // Check if updating or creating
        const existingBioPage = await db.getBioPageByUserId(user.id);

        let bioPage;
        if (existingBioPage) {
            bioPage = await db.updateBioPage(user.id, {
                title,
                description,
                avatar_url,
                theme,
                slug // Validating slug uniqueness is tricky here if changed.
            });
        } else {
            // Default slug to username if not provided
            const finalSlug = slug || user.username;

            // Check slug uniqueness
            const slugTaken = await db.getBioPageBySlug(finalSlug);
            if (slugTaken) {
                return NextResponse.json({ error: "Slug already taken" }, { status: 400 });
            }

            bioPage = await db.createBioPage({
                user_id: user.id,
                slug: finalSlug,
                title: title || user.username,
                description,
                avatar_url,
                theme
            });
        }

        return NextResponse.json(bioPage);
    } catch (e: any) {
        console.error("Bio Page API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
