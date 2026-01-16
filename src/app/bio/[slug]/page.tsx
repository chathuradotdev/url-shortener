import BioRenderer from "@/components/bio/BioRenderer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const bioPage = await db.getBioPageBySlug(slug);
    if (!bioPage) return { title: "Page Not Found" };

    const displayTitle = bioPage.title || bioPage.slug;
    return {
        title: `${displayTitle} | Link in Bio`,
        description: bioPage.description || `Check out my links at ${displayTitle}`,
        openGraph: bioPage.avatar_url ? {
            images: [bioPage.avatar_url]
        } : undefined
    };
}

export default async function BioPage({ params }: Props) {
    const slug = (await params).slug;
    const bioPage = await db.getBioPageBySlug(slug);

    if (!bioPage) {
        notFound();
    }

    const links = await db.getBioLinks(bioPage.id);

    // Fetch user branding settings
    const user = await db.findUserById(bioPage.user_id);

    // Track View (Fire and forget, don't await)
    db.incrementBioPageViews(bioPage.id).catch(console.error);

    return (
        <main className="min-h-screen">
            <BioRenderer
                bioPage={bioPage}
                links={links}
                userBranding={{
                    type: user?.company_branding_type || 'default',
                    text: user?.company_branding_text,
                    image: user?.company_branding_image
                }}
            />
        </main>
    );
}
