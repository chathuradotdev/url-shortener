import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import UrlList from "@/components/UrlList";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    console.log("Dashboard Server Session:", JSON.stringify(session, null, 2));

    if (!session) {
        console.log("No session found on dashboard, redirecting to login");
        redirect("/login");
    }

    // @ts-ignore
    let urls: any[] = [];
    // @ts-ignore
    let userPlan = session.user?.plan || 'freemium';

    try {
        // @ts-ignore
        if (session?.user?.id) {
            // Fetch fresh user data to ensure plan is up to date
            // @ts-ignore
            const dbUser = await db.findUserById(session.user.id);
            if (dbUser) {
                userPlan = dbUser.plan;
            }

            // @ts-ignore
            // @ts-ignore
            const rawUrls = await db.getUserUrls(session.user.id);
            console.log(`Dashboard: Found ${rawUrls.length} URLs for user ${session?.user?.email}`);

            urls = rawUrls.map(url => ({
                ...url,
                hasPassword: !!url.password,
                password: undefined // Don't send hash to client
            }));
        }
    } catch (e) {
        console.error("Dashboard: Error fetching URLs:", e);
    }

    if (!Array.isArray(urls)) {
        console.error("Dashboard: urls is not an array:", urls);
        urls = [];
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center">
                                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">{session.user?.name}</span>
                                {/* @ts-ignore */}
                                {userPlan === 'premium' ? (
                                    <span title="Premium User" className="ml-2 flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full shadow-sm border border-yellow-200">
                                        <svg className="w-3.5 h-3.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </span>
                                ) : (
                                    <span title="Freemium User" className="ml-2 flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full shadow-sm border border-gray-200">
                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </span>
                                )}
                            </h1>
                            {/* @ts-ignore */}
                            {session?.user?.last_login && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {/* @ts-ignore */}
                                    Last login: {new Date(session.user.last_login).toLocaleString("en-US", {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* @ts-ignore */}
                            {session.user.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                >
                                    Admin Dashboard
                                </Link>
                            )}

                            {userPlan === 'premium' ? (
                                <Link
                                    href="/dashboard/bulk-upload"
                                    className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2"
                                    title="Bulk Upload URLs"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    <span>Bulk Upload</span>
                                </Link>
                            ) : (
                                <div className="group relative">
                                    <button
                                        disabled
                                        className="bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-semibold border border-gray-200 cursor-not-allowed flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <span>Bulk Upload</span>
                                        <svg className="w-4 h-4 text-yellow-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center z-10">
                                        Upgrade to Premium to unlock Bulk Upload
                                    </div>
                                </div>
                            )}

                            <Link
                                href="/"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Create New Link</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Links</p>
                                <p className="text-3xl font-bold text-gray-900">{urls.length}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Clicks</p>
                                <p className="text-3xl font-bold text-gray-900">{urls.reduce((sum, url) => sum + url.clicks, 0)}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Avg Clicks/Link</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {urls.length > 0 ? Math.round(urls.reduce((sum, url) => sum + url.clicks, 0) / urls.length) : 0}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* URLs List */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <h2 className="text-xl font-bold text-gray-900">Your Links</h2>
                    </div>

                    <UrlList urls={urls} baseUrl={process.env.NEXTAUTH_URL || "http://localhost:3000"} userPlan={userPlan} />
                </div>
            </div>
        </div>
    );
}
