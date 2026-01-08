import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { UsersTable } from "./users-table";
import { UrlsTable } from "./urls-table";
import { toggleMaintenanceMode, updateNotificationEmails, toggleChatWidget, toggleBrandedDomains } from "./settings-actions";
import { AlertsManager } from "./alerts-manager"; // Import AlertsManager
import { StorageSettings } from "./storage-settings";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user.role !== 'admin') {
        redirect("/dashboard");
    }

    const [users, urls, stats, analytics, maintenanceMode, alerts, storageConfig, notificationEmails, chatWidgetEnabled, brandedDomainsEnabled] = await Promise.all([
        db.getAllUsers(),
        db.getAllUrls(),
        db.getSystemStats(),
        db.getAllAnalytics(),
        db.getMaintenanceMode(),
        db.getSystemAlerts(false), // Fetch all alerts, including inactive
        db.getStorageConfig(),
        db.getAdminNotificationEmails(),
        db.getChatWidgetEnabled(),
        db.getBrandedDomainsEnabled()
    ]);

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
                        <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                            <span>Member: <span className="font-semibold text-gray-700">{stats.memberUrls}</span></span>
                            <span>Guest: <span className="font-semibold text-gray-700">{stats.guestUrls}</span></span>
                        </div>
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

                <div className="space-y-8">
                    {/* System Configuration */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-medium text-gray-900">System Configuration</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                                    <p className="text-sm text-gray-500">
                                        Prevent non-admin users from accessing the site.
                                    </p>
                                </div>
                                <form action={toggleMaintenanceMode.bind(null, maintenanceMode)}>
                                    <button
                                        type="submit"
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        role="switch"
                                        aria-checked={maintenanceMode}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </form>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">AI Chat Widget</h3>
                                    <p className="text-sm text-gray-500">
                                        Show the AI assistant chat bubble on the bottom right.
                                    </p>
                                </div>
                                <form action={toggleChatWidget.bind(null, chatWidgetEnabled)}>
                                    <button
                                        type="submit"
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${chatWidgetEnabled ? 'bg-purple-600' : 'bg-gray-200'}`}
                                        role="switch"
                                        aria-checked={chatWidgetEnabled}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${chatWidgetEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </form>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Branded Domains</h3>
                                    <p className="text-sm text-gray-500">
                                        Allow users to connect custom domains.
                                    </p>
                                </div>
                                <form action={toggleBrandedDomains.bind(null, brandedDomainsEnabled)}>
                                    <button
                                        type="submit"
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${brandedDomainsEnabled ? 'bg-green-600' : 'bg-gray-200'}`}
                                        role="switch"
                                        aria-checked={brandedDomainsEnabled}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${brandedDomainsEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </form>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <form action={updateNotificationEmails} className="space-y-4">
                                    <div>
                                        <label htmlFor="notification_emails" className="block text-sm font-medium text-gray-900">
                                            Error Notification Emails
                                        </label>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Comma-separated list of emails to receive system error alerts (e.g. bulk upload failures).
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 max-w-lg">
                                            <input
                                                type="text"
                                                name="notification_emails"
                                                id="notification_emails"
                                                defaultValue={notificationEmails?.join(', ') || ''}
                                                placeholder="admin@example.com, tech@example.com"
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Save Emails
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <StorageSettings initialConfig={storageConfig} />
                        </div>
                    </div>

                    {/* User Management */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-medium text-gray-900">User Management</h2>
                        </div>
                        <div className="p-6">
                            <UsersTable data={users} />
                        </div>
                    </div>


                    {/* System Alerts Manager */}
                    <AlertsManager alerts={alerts} />

                    {/* Top URLs & Moderation */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-medium text-gray-900">URLs & Moderation</h2>
                        </div>
                        <div className="p-6">
                            <UrlsTable data={urls} />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
