import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProUpgradeBanner from "@/components/ProUpgradeBanner";
import SystemAlertBanner from "@/components/SystemAlertBanner";
import { db } from "@/lib/db";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    title: {
        default: "URL Shortener - Shorten Your Links Instantly",
        template: "%s | URL Shortener",
    },
    description: "The complete link platform. Smart Targeting, Bio Pages, Custom Social Previews, and Advanced Analytics.",
    keywords: ["url shortener", "link shortener", "qr code generator", "link management", "analytics", "free url shortener", "smart targeting", "bio pages", "custom social preview"],
    authors: [{ name: "URL Shortener Team" }],
    creator: "URL Shortener Team",
    publisher: "URL Shortener",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "URL Shortener - Shorten Your Links Instantly",
        description: "The complete link platform. Smart Targeting, Bio Pages, Custom Social Previews, and Advanced Analytics.",
        siteName: "URL Shortener",
    },
    twitter: {
        card: "summary_large_image",
        title: "URL Shortener - Shorten Your Links Instantly",
        description: "The complete link platform. Smart Targeting, Bio Pages, Custom Social Previews, and Advanced Analytics.",
        creator: "@urlshortener",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const audience = session?.user ? 'user' : 'guest';
    const alerts = await db.getSystemAlerts(true, audience);
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased`}>
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <SystemAlertBanner alerts={alerts} />
                        <ProUpgradeBanner />
                        <Navbar />
                        <div className="flex-grow">
                            {children}
                        </div>
                        <Footer />
                    </div>
                    <Toaster />
                </Providers>
                <SpeedInsights />
            </body>
        </html>
    );
}
