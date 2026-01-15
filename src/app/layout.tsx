import { Providers } from "@/components/Providers";
import "./globals.css";
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
