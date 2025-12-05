import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'admin') {
        redirect("/dashboard");
    }

    const users = db.getAllUsers();
    const urls = db.getAllUrls();
    const stats = db.getSystemStats();
    const analytics = db.getAllAnalytics();

    // Sort URLs by clicks
    const topUrls = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 10);

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

    // Actions
    async function toggleUserStatus(formData: FormData) {
        "use server";
        const userId = formData.get("userId") as string;
        const currentStatus = formData.get("currentStatus") as string;
        const newStatus = currentStatus === "active" ? "banned" : "active";

        db.updateUserStatus(userId, newStatus as any);
        revalidatePath("/admin");
    }

    async function toggleUrlStatus(formData: FormData) {
        "use server";
        const urlId = formData.get("urlId") as string;
        const currentStatus = formData.get("currentStatus") as string;
        const newStatus = currentStatus === "active" ? "removed" : "active";

        db.updateUrlStatus(urlId, newStatus as any);
        revalidatePath("/admin");
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                        Back to User Dashboard
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Total Active URLs</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUrls}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Total System Clicks</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalClicks}</p>
                    </div>
                </div>

                {/* System Activity Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">System-wide Clicks (Last 30 Days)</h3>
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
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 border-t pt-2">
                        <span>{Array.from(dailyClicks.keys())[0]}</span>
                        <span>{Array.from(dailyClicks.keys())[Array.from(dailyClicks.keys()).length - 1]}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Management */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-medium text-gray-900">User Management</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <form action={toggleUserStatus}>
                                                    <input type="hidden" name="userId" value={user.id} />
                                                    <input type="hidden" name="currentStatus" value={user.status || 'active'} />
                                                    <button
                                                        type="submit"
                                                        className={`text-sm font-medium ${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                                                            }`}
                                                    >
                                                        {user.status === 'active' ? 'Ban' : 'Unban'}
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top URLs & Moderation */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-medium text-gray-900">Top URLs & Moderation</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topUrls.map((url) => (
                                        <tr key={url.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-blue-600 hover:underline">
                                                    <a href={`${process.env.NEXTAUTH_URL}/${url.short_code}`} target="_blank" rel="noreferrer">
                                                        /{url.short_code}
                                                    </a>
                                                </div>
                                                <div className="text-xs text-gray-500 truncate max-w-[150px]" title={url.original_url}>
                                                    {url.original_url}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {url.clicks}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${url.status === 'removed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {url.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <form action={toggleUrlStatus}>
                                                    <input type="hidden" name="urlId" value={url.id} />
                                                    <input type="hidden" name="currentStatus" value={url.status || 'active'} />
                                                    <button
                                                        type="submit"
                                                        className={`text-sm font-medium ${url.status !== 'removed' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                                                            }`}
                                                    >
                                                        {url.status !== 'removed' ? 'Remove' : 'Restore'}
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
