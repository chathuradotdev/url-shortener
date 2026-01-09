import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";
import { hash } from "bcryptjs";
import { limiter } from "@/lib/rate-limit";

function generateShortCode(length = 6) {
    return crypto.randomBytes(length).toString("base64url").substring(0, length);
}

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        // 20 requests per minute limit
        if (!limiter.check(20, ip + "_shorten")) {
            return NextResponse.json(
                { message: "Rate limit exceeded" },
                { status: 429 }
            );
        }

        const session = await getServerSession(authOptions);
        const { originalUrl, customAlias, expiresAt, tags, password, cloaked, androidDeepLink, iosDeepLink, permanentRedirect, burnAfterReading, burnVisitLimit, socialTitle, socialDescription, socialImage, domain, teamId } = await req.json();

        if (!originalUrl) {
            return NextResponse.json(
                { message: "URL is required" },
                { status: 400 }
            );
        }

        // Basic URL validation
        try {
            new URL(originalUrl);
        } catch (e) {
            return NextResponse.json(
                { message: "Invalid URL format" },
                { status: 400 }
            );
        }

        // @ts-ignore
        const userId = session?.user?.id || null;
        let userPlan = 'freemium';

        // Domain Validation (Pre-check)
        if (domain) {
            if (!userId) {
                return NextResponse.json({ message: "Custom domains require an account" }, { status: 401 });
            }
            // Check ownership (Personal or Team)
            const userDomains = await db.getAccessibleCustomDomains(userId);
            const hasDomain = userDomains.some(d => d.domain === domain);

            if (!hasDomain) {
                return NextResponse.json({ message: "You must add and verify this domain first" }, { status: 403 });
            }
        }

        // Team Membership verification
        if (teamId && userId) {
            const isMember = await db.isUserInTeam(userId, teamId);
            if (!isMember) {
                return NextResponse.json({ message: "Unauthorized team access" }, { status: 403 });
            }
        }

        if (userId) {
            const user = await db.findUserById(userId);
            if (user) {
                userPlan = user.plan;
                if (userPlan === 'freemium' && user.trial_ends_at) {
                    const trialEnd = new Date(user.trial_ends_at);
                    if (trialEnd > new Date()) userPlan = 'premium';
                }
            }
        }

        // Branded domains allow custom aliases usually

        let shortCode;

        if (customAlias) {
            if (!/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
                return NextResponse.json(
                    { message: "Invalid alias format. Use letters, numbers, hyphens, and underscores only." },
                    { status: 400 }
                );
            }

            // Check uniqueness SC scoped to DOMAIN
            // If domain is null, scoped to system.
            const existingUrl = await db.findUrlByShortCode(customAlias, domain || null);
            if (existingUrl) {
                return NextResponse.json(
                    { message: "Alias already taken" + (domain ? " on this domain" : "") },
                    { status: 409 }
                );
            }
            shortCode = customAlias;
        } else {
            shortCode = generateShortCode();
            // Collision check with domain scope
            while (await db.findUrlByShortCode(shortCode, domain || null)) {
                shortCode = generateShortCode();
            }
        }

        // Only allow expiration, tags, and password for registered users
        const expirationDate = userId && expiresAt ? expiresAt : null;
        const urlTags = userId && tags ? tags : [];
        const passwordHash = userId && password ? await hash(password, 10) : undefined;
        const isCloaked = userId && cloaked ? true : false;

        // Deep linking and Permanent Redirect only for premium users
        // Also domain usage is premium? Or at least "Pro" feature? 
        // Logic above checked ownership, ownership implies they have the feature.

        const androidLink = userId && userPlan === 'premium' && androidDeepLink ? androidDeepLink : null;
        const iosLink = userId && userPlan === 'premium' && iosDeepLink ? iosDeepLink : null;
        const isPermanentRedirect = userId && userPlan === 'premium' && permanentRedirect ? true : false;

        const newUrl = await db.createUrl({
            short_code: shortCode,
            original_url: originalUrl,
            user_id: userId,
            expires_at: expirationDate,
            tags: urlTags,
            password: passwordHash,
            cloaked: isCloaked,
            android_deep_link: androidLink,
            ios_deep_link: iosLink,
            permanent_redirect: isPermanentRedirect,
            burn_after_reading: userId && userPlan === 'premium' && burnAfterReading ? true : false,
            burn_visit_limit: userId && userPlan === 'premium' && burnVisitLimit ? burnVisitLimit : 1,
            social_title: userId && userPlan === 'premium' ? socialTitle : null,
            social_description: userId && userPlan === 'premium' ? socialDescription : null,
            social_image: userId && userPlan === 'premium' ? socialImage : null,
            domain: domain || null,
            team_id: teamId || null
        });

        // Construct the full short URL
        const baseUrl = domain ? `https://${domain}` : (process.env.NEXTAUTH_URL || "http://localhost:3000");
        const shortUrl = `${baseUrl}/${shortCode}`;

        return NextResponse.json({
            shortCode,
            shortUrl,
            originalUrl,
        });
    } catch (error) {
        console.error("Shorten error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
