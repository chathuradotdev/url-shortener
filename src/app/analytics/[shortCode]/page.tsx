import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
    params: {
        shortCode: string;
    };
}

export default function AnalyticsPage({ params }: PageProps) {
    const { shortCode } = params;
    const url = db.findUrlByShortCode(shortCode);

    if (!url) {
        notFound();
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/${url.short_code}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Link Analytics
                    </h1>
                    <p className="text-gray-600">
                        Track the performance of your shortened link
                    </p>
                </div>

                <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-4 animation-delay-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-blue-700">Total Clicks</p>
                                <div className="p-2 bg-blue-200 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-5xl font-extrabold text-blue-900">{url.clicks}</span>
                                <span className="ml-2 text-sm text-blue-600 font-medium">visits</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-purple-700">Created On</p>
                                <div className="p-2 bg-purple-200 rounded-lg">
                                    <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-purple-900">
                                {new Date(url.created_at).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                            <p className="text-sm text-purple-600 mt-1">
                                {new Date(url.created_at).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Original URL</label>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 break-all text-gray-700 font-mono text-sm flex items-center">
                                <span className="flex-1">{url.original_url}</span>
                                <a href={url.original_url} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 hover:text-blue-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Shortened URL</label>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-white p-4 rounded-xl border-2 border-blue-100 text-blue-600 font-bold text-lg flex items-center justify-between">
                                    <span>{shortUrl}</span>
                                </div>
                                <Link
                                    href={`/${url.short_code}`}
                                    target="_blank"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <span>Visit Link</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
