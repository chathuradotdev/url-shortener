import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check system setting
    const isEnabled = await db.getBrandedDomainsEnabled();
    if (!isEnabled) {
        return NextResponse.json({ message: "Feature is currently disabled" }, { status: 503 });
    }

    // @ts-ignore
    const user = await db.findUserById(session.user.id);
    if (!user || user.plan !== 'premium') {
        // Optionally restrict to premium
        return NextResponse.json({ message: "Feature requires Premium plan" }, { status: 403 });
    }

    // @ts-ignore
    const domains = await db.getAccessibleCustomDomains(session.user.id);
    return NextResponse.json(domains);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check system setting
    const isEnabled = await db.getBrandedDomainsEnabled();
    if (!isEnabled) {
        return NextResponse.json({ message: "Feature is currently disabled" }, { status: 503 });
    }

    // @ts-ignore
    const user = await db.findUserById(session.user.id);
    if (!user || user.plan !== 'premium') {
        return NextResponse.json({ message: "Upgrade to Premium to add custom domains" }, { status: 403 });
    }

    const { domain, teamId } = await req.json();

    if (!domain) {
        return NextResponse.json({ message: "Domain is required" }, { status: 400 });
    }

    // Basic domain validation regex
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
        return NextResponse.json({ message: "Invalid domain format" }, { status: 400 });
    }

    // Check if domain exists globally? 
    // Usually domains are exclusive. If User A adds "go.com", User B can't.
    // So we need unique constraint on DB, or check manually.
    // The DB create table has `domain VARCHAR(255) NOT NULL UNIQUE`.
    // So `addCustomDomain` will throw/fail if duplicate.

    try {
        // @ts-ignore
        const newDomain = await db.addCustomDomain(session.user.id, domain, teamId);
        return NextResponse.json(newDomain);
    } catch (e: any) {
        if (e.code === '23505') { // Postgres unique violation
            return NextResponse.json({ message: "Domain is already registered by another user" }, { status: 409 });
        }
        console.error("Add domain error:", e);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
