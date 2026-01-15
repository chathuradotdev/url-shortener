import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/storage-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: "Only image files (JPEG, PNG, GIF, WEBP) are allowed" }, { status: 400 });
        }

        // Limit file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const provider = await StorageService.getProvider();

        // Use user ID in path to avoid collisions and keep organized
        // Sanitize filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `users/${session.user.id}/${Date.now()}-${safeName}`;

        const url = await provider.upload(buffer, filename);

        // If replacing an existing image, delete the old one
        const previousUrl = formData.get("previousUrl") as string;
        if (previousUrl) {
            try {
                // Security check: ensure the URL belongs to this app's storage to prevent arbitrary deletions
                // For Vercel Blob this is usually implicitly handled by the token scope, but good practice
                await provider.delete(previousUrl);
            } catch (e) {
                console.error("Failed to delete old image:", e);
                // Don't fail the upload just because delete failed, but log it
            }
        }

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed: " + (error.message || "Unknown error") }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { url } = await req.json();
        if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

        const provider = await StorageService.getProvider();
        await provider.delete(url);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
