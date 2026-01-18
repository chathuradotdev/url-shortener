import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
        return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
    }

    try {
        const user = await db.findUserByEmail(session.user.email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify ownership
        const bioPage = await db.getBioPageById(pageId);
        if (!bioPage) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        if (bioPage.user_id !== user.id) {
            // Check team access if applicable
            if (bioPage.team_id) {
                const hasAccess = await db.checkTeamAccess(bioPage.team_id, user.id);
                if (!hasAccess) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
            } else {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        const leads = await db.getBioLeads(pageId);
        return NextResponse.json(leads);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { bioPageId, name, email, message } = body;

        if (!bioPageId || !email) {
            return NextResponse.json({ error: 'Bio Page ID and Email are required' }, { status: 400 });
        }

        // Get Bio Page to find the owner
        const bioPage = await db.getBioPageById(bioPageId);
        if (!bioPage) {
            return NextResponse.json({ error: 'Bio Page not found' }, { status: 404 });
        }

        // Create Lead
        const lead = await db.createBioLead({
            bio_page_id: bioPageId,
            user_id: bioPage.user_id,
            name,
            email,
            message,
            status: 'unread'
        });

        return NextResponse.json({ success: true, lead });
    } catch (error) {
        console.error("Error creating bio lead:", error);
        return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
        return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    try {
        const user = await db.findUserByEmail(session.user.email);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        await db.deleteBioLead(leadId, user.id);

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
