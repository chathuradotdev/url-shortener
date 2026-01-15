import BioBuilder from "@/components/bio/BioBuilder";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bio Link Builder - URL Shortener",
    description: "Create your personalized bio page.",
};

export default function BioDashboardPage() {
    return <BioBuilder />;
}
