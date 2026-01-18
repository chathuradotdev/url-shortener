import { Metadata } from "next";
import PricingPageContent from "@/components/PricingContent";

export const metadata: Metadata = {
    title: "Pricing - Powerful URL Shortening Tools",
    description: "Explore our pricing plans with premium features: Smart Targeting, Link Rotation (A/B Testing), Burn After Reading, Custom Social Previews, Deep Links, Branded Domains, and more.",
    alternates: {
        canonical: "/pricing",
    },
};

export default function PricingPage() {
    return <PricingPageContent />;
}
