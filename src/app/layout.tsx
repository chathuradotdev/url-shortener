import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "URL Shortener",
    description: "Shorten your URLs easily",
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
