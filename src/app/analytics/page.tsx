"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    BarChart,
    Globe,
    Smartphone,
    Search,
    MousePointer2,
    Calendar,
    Share2,
    ExternalLink,
    Clock,
    Monitor,
    Map,
    Link as LinkIcon
} from "lucide-react";
import VisitorsMap from "@/components/VisitorsMap";

interface AnalyticsData {
    clicks: number;
    uniqueClicks: number;
    originalUrl: string;
    shortCode: string;
    createdAt: string;
    analytics: {
        daily: { date: string; count: number }[];
        os: { name: string; value: number }[];
        browsers: { name: string; value: number }[];
        countries: { name: string; value: number }[];
        referrers: { name: string; value: number }[];
    };
}

function StatCard({ title, value, subtext, icon: Icon, colorClass }: { title: string, value: string | number, subtext?: string, icon: any, colorClass: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}

function ProgressBarList({ title, data, total, icon: Icon }: { title: string, data: { name: string; value: number }[], total: number, icon: any }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-6">
                <Icon className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="space-y-4">
                {data.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No data available</p>
                ) : (
                    data.slice(0, 5).map((item, i) => {
                        const percent = total > 0 ? (item.value / total) * 100 : 0;
                        return (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 truncate max-w-[180px]" title={item.name}>
                                        {item.name === "Unknown" ? "Direct / Unknown" : item.name}
                                    </span>
                                    <span className="text-gray-500">
                                        {item.value} <span className="text-gray-300 text-xs">({Math.round(percent)}%)</span>
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function DailyActivityChart({ data }: { data: { date: string; count: number }[] }) {
    const max = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <BarChart className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Activity (Last 7 Days)</h3>
            </div>

            <div className="flex items-end justify-between h-48 gap-2">
                {data.map((day) => {
                    const heightPercent = (day.count / max) * 100;
                    const dateLabel = new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' });

                    return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full flex justify-center items-end h-full">
                                <div
                                    className="w-full max-w-[40px] bg-blue-100 hover:bg-blue-200 transition-all rounded-t-lg group-hover:scale-y-105 origin-bottom relative"
                                    style={{ height: `${heightPercent}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">
                                        {day.count} clicks
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{dateLabel}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function AnalyticsContent() {
    const searchParams = useSearchParams();
    const initialCode = searchParams.get("code") || "";
    const [code, setCode] = useState(initialCode);
    const [stats, setStats] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.host); // Just host looks cleaner usually
    }, []);

    const fetchStats = async (shortCode: string) => {
        if (!shortCode) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/stats?code=${shortCode}`);
            const data = await res.json();

            if (res.ok) {
                setStats(data);
            } else {
                setError(data.message || "Failed to fetch stats");
                setStats(null);
            }
        } catch (err) {
            setError("Failed to connect to server");
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
        let cleanCode = code;
        try {
            if (code.includes('http')) {
                const urlObj = new URL(code);
                const path = urlObj.pathname.split('/').pop();
                if (path) cleanCode = path;
            } else if (code.includes('/')) {
                cleanCode = code.split('/').pop() || code;
            }
        } catch (e) { }

        fetchStats(cleanCode);
        // Update URL without reload
        window.history.pushState({}, '', `/analytics?code=${cleanCode}`);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-500 mt-1">Real-time insights for your links</p>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Paste short URL..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Track"}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3 border border-red-100">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <span className="text-xl">⚠️</span>
                    </div>
                    <div>
                        <p className="font-semibold">Error Loading Stats</p>
                        <p className="text-sm opacity-90">{error}</p>
                    </div>
                </div>
            )}

            {!stats && !loading && !error && (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter a URL to track</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Paste any short URL created with our service to see detailed analytics, traffic sources, and more.
                    </p>
                </div>
            )}

            {stats && (
                <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                    {/* Header Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <LinkIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    /{stats.shortCode}
                                    <a href={`/${stats.shortCode}`} target="_blank" className="text-gray-400 hover:text-blue-600">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </h2>
                                <p className="text-sm text-gray-500 truncate max-w-md">{stats.originalUrl}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(stats.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(stats.createdAt).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Clicks"
                            value={stats.clicks}
                            subtext="All time visits"
                            icon={MousePointer2}
                            colorClass="bg-blue-500"
                        />
                        <StatCard
                            title="Unique Visitors"
                            value={stats.uniqueClicks}
                            subtext="Estimated unique IPs"
                            icon={Share2}
                            colorClass="bg-purple-500"
                        />
                        <StatCard
                            title="Top Country"
                            value={stats.analytics.countries[0]?.name || "N/A"}
                            subtext={stats.analytics.countries[0] ? `${stats.analytics.countries[0].value} visits` : "No data"}
                            icon={Globe}
                            colorClass="bg-green-500"
                        />
                        <StatCard
                            title="Top Referrer"
                            value={stats.analytics.referrers[0]?.name === "Unknown" ? "Direct" : (stats.analytics.referrers[0]?.name || "N/A")}
                            subtext={stats.analytics.referrers[0] ? `${stats.analytics.referrers[0].value} visits` : "No data"}
                            icon={Search}
                            colorClass="bg-orange-500"
                        />
                    </div>



                    {/* Main Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <DailyActivityChart data={stats.analytics.daily} />
                        </div>
                        <div>
                            <ProgressBarList
                                title="Top Locations"
                                data={stats.analytics.countries}
                                total={stats.clicks}
                                icon={Map}
                            />
                        </div>
                    </div>

                    {/* World Map */}
                    <VisitorsMap data={stats.analytics.countries} />

                    {/* Secondary Grids */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ProgressBarList
                            title="Traffic Sources"
                            data={stats.analytics.referrers}
                            total={stats.clicks}
                            icon={Globe}
                        />
                        <ProgressBarList
                            title="Browsers"
                            data={stats.analytics.browsers}
                            total={stats.clicks}
                            icon={Monitor}
                        />
                        <ProgressBarList
                            title="Operating Systems"
                            data={stats.analytics.os}
                            total={stats.clicks}
                            icon={Smartphone}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            }>
                <AnalyticsContent />
            </Suspense>
        </div>
    );
}
