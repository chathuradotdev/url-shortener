import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    description: "Free URL Shortener with advanced analytics, QR codes, and link management. Create short, memorable links not just for business but for everyone.",
    keywords: ["url shortener", "link shortener", "qr code generator", "link management", "analytics", "free url shortener"],
    authors: [{ name: "URL Shortener Team" }],
    creator: "URL Shortener Team",
    publisher: "URL Shortener",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "URL Shortener - Shorten Your Links Instantly",
        description: "Create short, manageable links, generate QR codes, and share them with ease.",
        siteName: "URL Shortener",
    },
    twitter: {
        card: "summary_large_image",
        title: "URL Shortener - Shorten Your Links Instantly",
        description: "Create short, manageable links, generate QR codes, and share them with ease.",
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
            <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased`}>
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <div className="flex-grow">
                            {children}
                        </div>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
