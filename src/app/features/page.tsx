import { Metadata } from "next";
import FeaturesPageContent from "@/components/FeaturesPageContent";

export const metadata: Metadata = {
    title: "Features - Powerful URL Shortening Tools",
    description: "Explore our powerful features including QR code generation, advanced analytics, and link management for free.",
    alternates: {
        canonical: "/features",
    },
};

export default function FeaturesPage() {
    return <FeaturesPageContent />;
}
