"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Suspense } from "react";

function AnalyticsContent() {
    const searchParams = useSearchParams();
    const initialCode = searchParams.get("code") || "";
    const [code, setCode] = useState(initialCode);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const fetchStats = async (shortCode: string) => {
        if (!shortCode) return;
        setLoading(true);
        setError("");
        setStats(null);

        try {
            const res = await fetch(`/api/stats?code=${shortCode}`);
            const data = await res.json();

            if (res.ok) {
                setStats(data);
            } else {
                setError(data.message || "Failed to fetch stats");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialCode) {
            fetchStats(initialCode);
        }
    }, [initialCode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Extract code from URL if full URL is pasted
        let cleanCode = code;
        try {
            const urlObj = new URL(code);
            const path = urlObj.pathname.split('/').pop();
            if (path) cleanCode = path;
        } catch (e) {
            // Not a valid URL, assume it's the code
        }
        fetchStats(cleanCode);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Link Analytics
                </h1>
                <p className="text-lg text-gray-600">
                    Track the performance of your shortened links
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter short URL or code (e.g., XyZ123)"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Check Stats"}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-center border border-red-100">
                    {error}
                </div>
            )}

            {stats && (
                <div className="bg-white rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-2">
                                Total Clicks
                            </div>
                            <div className="text-4xl font-bold text-gray-900">
                                {stats.clicks}
                            </div>
                        </div>
                        <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                            <div className="text-purple-600 text-sm font-semibold uppercase tracking-wide mb-2">
                                Created
                            </div>
                            <div className="text-lg font-medium text-gray-900">
                                {new Date(stats.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                            <div className="text-green-600 text-sm font-semibold uppercase tracking-wide mb-2">
                                Status
                            </div>
                            <div className="text-lg font-medium text-gray-900">
                                Active
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                            Link Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Original URL</label>
                                <a href={stats.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                    {stats.originalUrl}
                                </a>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Short URL</label>
                                <div className="text-gray-900 font-medium flex items-center gap-2">
                                    <span>{origin}/{stats.shortCode}</span>
                                    <Link href={`/${stats.shortCode}`} target="_blank" className="text-blue-600 hover:text-blue-700">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div>Loading analytics...</div>}>
                <AnalyticsContent />
            </Suspense>
        </div>
    );
}
