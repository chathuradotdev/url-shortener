import { Providers } from "@/components/Providers";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://linkjet.co"),
    manifest: "/manifest.json",
    title: {
        default: "LinkJet - Shorten Your Links Instantly",
        template: "%s | LinkJet",
    },
    description: "The complete link platform. Smart Targeting, Bio Pages, Custom Social Previews, and Advanced Analytics.",
    keywords: ["url shortener", "link shortener", "qr code generator", "link management", "analytics", "free url shortener", "smart targeting", "bio pages", "custom social preview"],
    authors: [{ name: "LinkJet Team" }],
    creator: "LinkJet Team",
    publisher: "LinkJet",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "LinkJet - Shorten Your Links Instantly",
        description: "The complete link platform. Smart Targeting, Bio Pages, Custom Social Previews, and Advanced Analytics.",
        siteName: "LinkJet",
    },
    twitter: {
        card: "summary_large_image",
        title: "LinkJet - Shorten Your Links Instantly",
        description: "The complete link platform. Smart Targeting, Bio Pages, Custom Social Previews, and Advanced Analytics.",
        creator: "@linkjet",
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
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "LinkJet",
    },
    other: {
        "google-adsense-account": "ca-pub-7001868234911670",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} antialiased`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
