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

    return {
        title: bioPage.title + " | Link in Bio",
        description: bioPage.description || `Links from ${bioPage.title}`,
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

    return (
        <main className="min-h-screen">
            <BioRenderer bioPage={bioPage} links={links} />
        </main>
    );
}
