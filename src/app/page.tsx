import ShortenerForm from "@/components/ShortenerForm";
import AdvancedFeaturesSection from "@/components/AdvancedFeaturesSection";
import BioLinkShowcase from "@/components/BioLinkShowcase";
import PremiumDashboardShowcase from "@/components/PremiumDashboardShowcase";
import SocialProof from "@/components/SocialProof";
import TypewriterText from "@/components/TypewriterText";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
    const session = await getServerSession(authOptions);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "URL Shortener",
        "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "description": "The complete link platform. Smart Targeting, Bio Pages, Custom Social Previews, and Advanced Analytics.",
        "applicationCategory": "Utilities",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
        },
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black relative overflow-hidden transition-colors duration-300">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {!session ? (
                    <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4">
                        {/* <div className="inline-block mb-4">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                ✨ Free URL Shortener
                            </span>
                        </div> */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6">
                            Shorten Your Links{" "}
                            <TypewriterText
                                text="Instantly"
                                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                                cursorClassName="bg-pink-500"
                            />
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                            The complete link platform. <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors hover:text-blue-600">Smart Targeting</span>, <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors hover:text-purple-600">Bio Pages</span>, <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors hover:text-pink-600">Custom Social Previews</span>, and{" "}
                            <span className="relative inline-block font-bold text-gray-900 dark:text-white cursor-help group">
                                Advanced Analytics
                                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></span>
                                <span className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></span>
                            </span>.
                        </p>
                    </div>
                ) : (
                    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-blue-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Organize with Tags</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            Add tags like <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">marketing</span> or <span className="inline-block px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-medium border border-purple-100">social</span> to group your links. Easily filter and find them later in your dashboard.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Set Expiration Dates</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            Create temporary links for limited-time offers or events. Links will automatically expire and become inaccessible after the date you choose.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <ShortenerForm />

                {/* Features section */}
                {!session && (
                    <>
                        <SocialProof />

                        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Generate short links in milliseconds</p>
                            </div>

                            <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">QR Codes</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Auto-generate QR codes for every link</p>
                            </div>

                            <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Track clicks and monitor performance</p>
                            </div>
                        </div>

                        {/* Why Create an Account Section */}
                        <div className="mt-16 md:mt-24 mb-12">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Create an Account?</h2>
                                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Take control of your links with our powerful tools.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Deep Analytics</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Gain insights into your audience. See where your clicks are coming from, what devices they use, and when they are most active.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Link Management</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Made a mistake? Need to update a destination? Edit your short links anytime without changing the short URL.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Centralized Dashboard</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Keep all your links organized in one place. Search, sort, and filter to find exactly what you need in seconds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Feature Showcase */}
                        <AdvancedFeaturesSection />

                        {/* Bio Link Showcase */}
                        <BioLinkShowcase />

                        {/* Premium Dashboard Showcase */}
                        <PremiumDashboardShowcase />
                    </>
                )}
            </div>
        </main>
    );
}
