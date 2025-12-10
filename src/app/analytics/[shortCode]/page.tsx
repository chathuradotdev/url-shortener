import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage({ params }: { params: { shortCode: string } }) {
    const shortCode = params.shortCode;
    const url = await db.findUrlByShortCode(shortCode);

    if (!url) {
        notFound();
    }

    const analytics = await db.getUrlAnalytics(shortCode);

    // Process Data
    const totalClicks = analytics.length;

    // Daily Clicks (Last 30 Days)
    const dailyClicks = new Map<string, number>();
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
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

    // Device Stats
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

    // Referrer Stats
    const referrerStats = analytics.reduce((acc, curr) => {
        let ref = curr.referrer || "Direct";
        if (ref.startsWith("http")) {
            try {
                ref = new URL(ref).hostname;
            } catch (e) { }
        }
        acc[ref] = (acc[ref] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const getPercent = (val: number) => Math.round((val / totalClicks) * 100) || 0;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                        <p className="text-gray-600 mt-1">
                            For <span className="font-mono text-blue-600 font-semibold">{process.env.NEXTAUTH_URL}/{shortCode}</span>
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{totalClicks}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Top Device</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {Object.entries(deviceStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Top Browser</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {Object.entries(browserStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Top Referrer</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2 truncate">
                            {Object.entries(referrerStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"}
                        </p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Daily Clicks Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Clicks over last 30 days</h3>
                        <div className="h-64 flex items-end space-x-2 overflow-x-auto pb-2">
                            {Array.from(dailyClicks.entries()).map(([date, count]) => (
                                <div key={date} className="flex-1 flex flex-col items-center min-w-[30px] group relative">
                                    <div
                                        className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-sm transition-all duration-300 relative"
                                        style={{ height: `${(count / maxDailyClicks) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                            {count} clicks on {date}
                                        </div>
                                    </div>
                                    {/* Only show date for every 5th item or first/last to avoid clutter */}
                                    {/* Actually, let's show all but rotate text if needed, or just show tooltips */}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2 border-t pt-2">
                            <span>{Array.from(dailyClicks.keys())[0]}</span>
                            <span>{Array.from(dailyClicks.keys())[Array.from(dailyClicks.keys()).length - 1]}</span>
                        </div>
                    </div>

                    {/* Device Stats */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices</h3>
                        <div className="space-y-4">
                            {Object.entries(deviceStats)
                                .sort((a, b) => b[1] - a[1])
                                .map(([device, count]) => (
                                    <div key={device}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{device}</span>
                                            <span className="text-gray-500">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className="bg-purple-500 h-2.5 rounded-full"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Browser Stats */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
                        <div className="space-y-4">
                            {Object.entries(browserStats)
                                .sort((a, b) => b[1] - a[1])
                                .map(([browser, count]) => (
                                    <div key={browser}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{browser}</span>
                                            <span className="text-gray-500">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-500 h-2.5 rounded-full"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* OS Stats */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
                        <div className="space-y-4">
                            {Object.entries(osStats)
                                .sort((a, b) => b[1] - a[1])
                                .map(([os, count]) => (
                                    <div key={os}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{os}</span>
                                            <span className="text-gray-500">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className="bg-green-500 h-2.5 rounded-full"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Referrer Stats */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Referrers</h3>
                        <div className="space-y-4">
                            {Object.entries(referrerStats)
                                .sort((a, b) => b[1] - a[1])
                                .map(([ref, count]) => (
                                    <div key={ref}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{ref}</span>
                                            <span className="text-gray-500">{count} ({getPercent(count)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className="bg-orange-500 h-2.5 rounded-full"
                                                style={{ width: `${getPercent(count)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analytics.slice().reverse().slice(0, 20).map((event) => (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {event.ip?.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, '$1.$2.***.***') || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {event.device}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {event.browser}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {event.os}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                                            {event.referrer}
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
