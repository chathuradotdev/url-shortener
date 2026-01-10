import { Metadata } from "next";
import PricingPageContent from "@/components/PricingPageContent";

export const metadata: Metadata = {
    title: "Pricing - Powerful URL Shortening Tools",
    description: "Explore our powerful pricing plans including QR code generation, advanced analytics, and link management for free.",
    alternates: {
        canonical: "/pricing",
    },
};

export default function PricingPage() {
    return <PricingPageContent />;
}
