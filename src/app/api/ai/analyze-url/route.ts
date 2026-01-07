import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ message: "URL is required" }, { status: 400 });
        }

        // Add protocol if missing
        let targetUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            targetUrl = 'https://' + url;
        }

        // Validate URL
        try {
            new URL(targetUrl);
        } catch (e) {
            return NextResponse.json({ message: "Invalid URL" }, { status: 400 });
        }

        // Fetch URL content
        const res = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            return NextResponse.json({ message: "Failed to fetch URL" }, { status: 400 });
        }

        const html = await res.text();

        // Extract Title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : "";

        // Extract Description
        let description = "";
        const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
        if (descMatch) {
            description = descMatch[1].trim();
        } else {
            const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i);
            if (ogDescMatch) description = ogDescMatch[1].trim();
        }

        // Extract Image
        let image = "";
        const imgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i);
        if (imgMatch) {
            image = imgMatch[1].trim();
        }

        // Generate Tags (Basic keyword extraction from title)
        const tags = title.split(/[\s-]+/)
            .filter(w => w.length > 4 && /^[a-zA-Z]+$/.test(w))
            .slice(0, 5);

        return NextResponse.json({
            title,
            description,
            image,
            tags
        });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json({ message: "Failed to analyze URL" }, { status: 500 });
    }
}
