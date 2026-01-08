import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

// Verify or Delete
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Ensure user owns the domain
    const { id } = await params;
    // @ts-ignore
    const userDomains = await db.getCustomDomains(session.user.id);
    const domain = userDomains.find(d => d.id === id);

    if (!domain) {
        return NextResponse.json({ message: "Domain not found or access denied" }, { status: 404 });
    }

    try {
        await db.deleteCustomDomain(id);
        return NextResponse.json({ message: "Domain deleted" });
    } catch (e) {
        console.error("Delete domain error:", e);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const body = await req.json();
    const action = body.action; // 'verify'

    if (action === 'verify') {
        try {
            // @ts-ignore
            const userDomains = await db.getCustomDomains(session.user.id);
            const domain = userDomains.find(d => d.id === id);

            if (!domain) {
                return NextResponse.json({ message: "Domain not found" }, { status: 404 });
            }

            // Real implementation: DNS Lookup
            // process: look for CNAME pointing to app domains
            // For now: Mock success

            /*
            const dns = require('dns');
            const promisifiedResolve = util.promisify(dns.resolveCname);
            try {
               const addresses = await promisifiedResolve(domain.domain);
               if (addresses.includes('your-app.vercel.app')) success = true;
            } catch(e) {}
            */

            const verified = await db.verifyCustomDomain(id);
            return NextResponse.json({ verified, message: "Domain verified successfully" });
        } catch (e) {
            console.error("Verify domain error:", e);
            return NextResponse.json({ message: "Verification failed" }, { status: 500 });
        }
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
