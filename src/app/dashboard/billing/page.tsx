import { Metadata } from "next";
import BillingContent from "./BillingContent";

export const metadata: Metadata = {
    title: "Billing & Subscriptions | Antigravity URL Shortener",
    description: "Manage your subscription, invoices, and billing details.",
};

export default function BillingPage() {
    return (
        <div className="p-4 md:p-8">
            <BillingContent />
        </div>
    );
}
