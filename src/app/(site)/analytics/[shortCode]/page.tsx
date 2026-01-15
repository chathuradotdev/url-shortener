import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Globe, Clock, MousePointer, Smartphone, Monitor, Tablet, ExternalLink } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdvancedAnalyticsPage(props: { params: Promise<{ shortCode: string }> }) {
    const params = await props.params;
    const shortCode = params.shortCode;
    const url = await db.findUrlByShortCode(shortCode);

    if (!url) {
        notFound();
    }

    const analytics = await db.getUrlAnalytics(shortCode);

    // Process Data
    const totalClicks = analytics.length;

    // Calculate time-based metrics
    const now = new Date();
    const last24h = analytics.filter(e => new Date(e.timestamp) > new Date(now.getTime() - 24 * 60 * 60 * 1000));
    const last7d = analytics.filter(e => new Date(e.timestamp) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    const last30d = analytics.filter(e => new Date(e.timestamp) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));

    // Previous period comparison
    const prev24h = analytics.filter(e => {
        const ts = new Date(e.timestamp);
        return ts > new Date(now.getTime() - 48 * 60 * 60 * 1000) && ts <= new Date(now.getTime() - 24 * 60 * 60 * 1000);
    });
    const prev7d = analytics.filter(e => {
        const ts = new Date(e.timestamp);
        return ts > new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) && ts <= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    });

    const growth24h = prev24h.length > 0 ? ((last24h.length - prev24h.length) / prev24h.length * 100) : 0;
    const growth7d = prev7d.length > 0 ? ((last7d.length - prev7d.length) / prev7d.length * 100) : 0;

    // Hourly distribution (last 24 hours)
    const hourlyClicks = new Map<number, number>();
    for (let i = 0; i < 24; i++) {
        hourlyClicks.set(i, 0);
    }
    last24h.forEach(event => {
        const hour = new Date(event.timestamp).getHours();
        hourlyClicks.set(hour, (hourlyClicks.get(hour) || 0) + 1);
    });
    const maxHourlyClicks = Math.max(...Array.from(hourlyClicks.values()), 1);

    // Daily Clicks (Last 30 Days)
    const dailyClicks = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyClicks.set(dateStr, 0);
    }
    analytics.forEach(event => {
        const dateStr = new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (dailyClicks.has(dateStr)) {
            dailyClicks.set(dateStr, (dailyClicks.get(dateStr) || 0) + 1);
        }
    });
    const maxDailyClicks = Math.max(...Array.from(dailyClicks.values()), 1);

    // Device Stats with detailed breakdown
    const deviceStats = analytics.reduce((acc, curr) => {
        const device = curr.device || "Unknown";
        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Browser Stats
    const browserStats = analytics.reduce((acc, curr) => {
        const browser = curr.browser || "Unknown";
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // OS Stats
    const osStats = analytics.reduce((acc, curr) => {
        const os = curr.os || "Unknown";
        acc[os] = (acc[os] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Country Stats
    const countryStats = analytics.reduce((acc, curr) => {
        const country = curr.country || "Unknown";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // City Stats
    const cityStats = analytics.reduce((acc, curr) => {
        const city = curr.city || "Unknown";
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Referrer Stats with better parsing
    const referrerStats = analytics.reduce((acc, curr) => {
        let ref = curr.referrer || "Direct";
        if (ref.startsWith("http")) {
            try {
                const url = new URL(ref);
                ref = url.hostname.replace('www.', '');
            } catch (e) { }
        }
        acc[ref] = (acc[ref] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Peak hour analysis
    const peakHour = Array.from(hourlyClicks.entries()).sort((a, b) => b[1] - a[1])[0];
    const peakDay = Array.from(dailyClicks.entries()).sort((a, b) => b[1] - a[1])[0];

    // Engagement metrics
    const avgClicksPerDay = totalClicks / Math.max(1, Math.ceil((now.getTime() - new Date(url.created_at).getTime()) / (24 * 60 * 60 * 1000)));
    const uniqueCountries = Object.keys(countryStats).length;
    const uniqueCities = Object.keys(cityStats).length;

    const getPercent = (val: number) => Math.round((val / totalClicks) * 100) || 0;

    const getDeviceIcon = (device: string) => {
        const d = device.toLowerCase();
        if (d.includes('mobile') || d.includes('phone')) return <Smartphone className="w-4 h-4" />;
        if (d.includes('tablet')) return <Tablet className="w-4 h-4" />;
        return <Monitor className="w-4 h-4" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                Advanced Analytics
                            </h1>
                            <div className="flex items-center gap-2 text-gray-600">
                                <span className="font-mono text-sm bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                                    {process.env.NEXTAUTH_URL}/{shortCode}
                                </span>
                                <a
                                    href={url.original_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
                                >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    View destination
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Clicks */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <MousePointer className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{totalClicks.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Since {new Date(url.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Last 24h with growth */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600">Last 24 Hours</h3>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{last24h.length.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                            {growth24h >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-xs font-medium ${growth24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(growth24h).toFixed(1)}% vs previous 24h
                            </span>
                        </div>
                    </div>

                    {/* Last 7 days with growth */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600">Last 7 Days</h3>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{last7d.length.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                            {growth7d >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-xs font-medium ${growth7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(growth7d).toFixed(1)}% vs previous week
                            </span>
                        </div>
                    </div>

                    {/* Geographic Reach */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600">Geographic Reach</h3>
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{uniqueCountries}</p>
                        <p className="text-xs text-gray-500">{uniqueCities} cities worldwide</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* 24-Hour Activity */}
                    <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">24-Hour Activity</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Peak hour: {peakHour?.[0]}:00 with {peakHour?.[1]} clicks
                                </p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end space-x-1 overflow-x-auto pb-2">
                            {Array.from(hourlyClicks.entries()).map(([hour, count]) => (
                                <div key={hour} className="flex-1 flex flex-col items-center min-w-[20px] group relative">
                                    <div
                                        className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 rounded-t transition-all duration-300 relative"
                                        style={{ height: `${(count / maxHourlyClicks) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                            {count} clicks at {hour}:00
                                        </div>
                                    </div>
                                    {hour % 3 === 0 && (
                                        <span className="text-[10px] text-gray-400 mt-1">{hour}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2 border-t pt-2">
                            <span>00:00</span>
                            <span>12:00</span>
                            <span>23:00</span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm text-gray-700">Avg. clicks/day</span>
                                <span className="text-lg font-bold text-blue-600">{avgClicksPerDay.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <span className="text-sm text-gray-700">Peak day</span>
                                <span className="text-sm font-semibold text-purple-600">{peakDay?.[0]}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <span className="text-sm text-gray-700">Peak clicks</span>
                                <span className="text-lg font-bold text-green-600">{peakDay?.[1]}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <span className="text-sm text-gray-700">Last 30 days</span>
                                <span className="text-lg font-bold text-orange-600">{last30d.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 30-Day Trend */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">30-Day Trend</h3>
                    <div className="h-64 flex items-end space-x-1 overflow-x-auto pb-2">
                        {Array.from(dailyClicks.entries()).map(([date, count]) => (
                            <div key={date} className="flex-1 flex flex-col items-center min-w-[20px] group relative">
                                <div
                                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 rounded-t transition-all duration-300 relative"
                                    style={{ height: `${(count / maxDailyClicks) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                        {count} clicks on {date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 border-t pt-2">
                        <span>{Array.from(dailyClicks.keys())[0]}</span>
                        <span>{Array.from(dailyClicks.keys())[Array.from(dailyClicks.keys()).length - 1]}</span>
                    </div>
                </div>

                {/* Detailed Breakdown Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Devices */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-purple-600" />
                            Devices
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(deviceStats)
                                .sort((a, b) => b[1] - a[1])
                                .map(([device, count]) => (
                                    <div key={device} className="group">
                                        <div className="flex justify-between text-sm mb-2">
                                            <div className="flex items-center gap-2">
                                                {getDeviceIcon(device)}
                                                <span className="font-medium text-gray-700">{device}</span>
                                            </div>
                                            <span className="text-gray-500">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 group-hover:from-purple-600 group-hover:to-purple-700"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Browsers */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
                        <div className="space-y-3">
                            {Object.entries(browserStats)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([browser, count]) => (
                                    <div key={browser} className="group">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-700">{browser}</span>
                                            <span className="text-gray-500">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-700"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Operating Systems */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
                        <div className="space-y-3">
                            {Object.entries(osStats)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([os, count]) => (
                                    <div key={os} className="group">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-700">{os}</span>
                                            <span className="text-gray-500">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500 group-hover:from-green-600 group-hover:to-green-700"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Referrers */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Referrers</h3>
                        <div className="space-y-3">
                            {Object.entries(referrerStats)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([ref, count]) => (
                                    <div key={ref} className="group">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-700 truncate">{ref}</span>
                                            <span className="text-gray-500 ml-2">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500 group-hover:from-orange-600 group-hover:to-orange-700"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Geographic Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Countries */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-600" />
                            Top Countries
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(countryStats)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 8)
                                .map(([country, count]) => (
                                    <div key={country} className="group">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-700">{country}</span>
                                            <span className="text-gray-500">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 group-hover:from-indigo-600 group-hover:to-indigo-700"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Cities */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h3>
                        <div className="space-y-3">
                            {Object.entries(cityStats)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 8)
                                .map(([city, count]) => (
                                    <div key={city} className="group">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-700">{city}</span>
                                            <span className="text-gray-500">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2.5 rounded-full transition-all duration-500 group-hover:from-teal-600 group-hover:to-teal-700"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        <p className="text-sm text-gray-600 mt-1">Last 20 clicks</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analytics.slice().reverse().slice(0, 20).map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium" suppressHydrationWarning>
                                            {new Date(event.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Globe className="w-3 h-3 text-gray-400" />
                                                {event.city || 'Unknown'}, {event.country || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                {getDeviceIcon(event.device || 'Unknown')}
                                                {event.device || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {event.browser || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {event.os || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                                            {event.referrer || 'Direct'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
