import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Features - Powerful URL Shortening Tools",
    description: "Explore our powerful features including QR code generation, advanced analytics, and link management for free.",
    alternates: {
        canonical: "/features",
    },
};

export default function FeaturesPage() {

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        Powerful Features for Everyone
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Whether you're a casual user or a power user, we have the right tools for you.
                        Compare our Guest and Registered plans below.
                    </p>
                </div>
            </div>

            {/* Comparison Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Guest Plan */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="p-8 bg-gray-50 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest User</h2>
                            <p className="text-gray-600">Perfect for quick, one-off links.</p>
                            <div className="mt-4">
                                <span className="text-4xl font-extrabold text-gray-900">Free</span>
                                <span className="text-gray-500 ml-2">/ forever</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">Instant URL Shortening</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">Unlimited Redirects</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700">QR Code Generation</span>
                                </li>
                                <li className="flex items-start opacity-50">
                                    <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-gray-500">Link Management Dashboard</span>
                                </li>
                                <li className="flex items-start opacity-50">
                                    <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-gray-500">Detailed Analytics</span>
                                </li>
                                <li className="flex items-start opacity-50">
                                    <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-gray-500">Edit/Delete Links</span>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/" className="block w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl text-center hover:bg-gray-50 transition-colors">
                                    Start Shortening Now
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Registered Plan */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden hover:border-blue-500 transition-colors duration-300">
                        <div className="p-8 bg-blue-50 border-b border-blue-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registered User</h2>
                            <p className="text-gray-600">Unlock the full potential of your links.</p>
                            <div className="mt-4">
                                <span className="text-4xl font-extrabold text-gray-900">Free</span>
                                <span className="text-gray-500 ml-2">/ forever</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Everything in Guest</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Comprehensive Dashboard</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Advanced Analytics</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Link Management</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Persistent History</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">UTM Builder</span>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/register" className="block w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl text-center hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                                    Create Free Account
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Premium User Plan */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-500 overflow-hidden transform md:scale-105 z-10 transition-transform duration-300 relative">
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                            Best Value
                        </div>
                        <div className="p-8 bg-amber-50 border-b border-amber-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium User</h2>
                            <p className="text-gray-600">Power tools for advanced users.</p>
                            <div className="mt-4">
                                <span className="text-4xl font-extrabold text-gray-900">$1</span>
                                <span className="text-gray-500 ml-2">/ month</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Everything in Registered</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Bulk URL Upload</span>
                                    <p className="text-sm text-gray-500 ml-auto pl-4">Upload CSV for bulk shortening</p>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Email Notifications</span>
                                    <p className="text-sm text-gray-500 ml-auto pl-4">Alerts when uploads complete</p>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Priority Support</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-900 font-medium">Ad-free Experience</span>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/register?plan=premium" className="block w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-4 rounded-xl text-center hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                                    Get Premium
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Details */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why Create an Account?</h2>
                        <p className="mt-4 text-lg text-gray-600">Take control of your links with our powerful tools.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Deep Analytics</h3>
                            <p className="text-gray-600">
                                Gain insights into your audience. See where your clicks are coming from, what devices they use, and when they are most active.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Link Management</h3>
                            <p className="text-gray-600">
                                Made a mistake? Need to update a destination? Edit your short links anytime without changing the short URL.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Centralized Dashboard</h3>
                            <p className="text-gray-600">
                                Keep all your links organized in one place. Search, sort, and filter to find exactly what you need in seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
