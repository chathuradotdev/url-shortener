"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center space-x-2 group">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                    ShortLink
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link href="/features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            Features
                        </Link>
                        <Link href="/analytics" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            Analytics
                        </Link>
                        <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            Contact
                        </Link>
                        {session ? (
                            <>
                                <div className="flex items-center space-x-2 mr-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                                    {/* @ts-ignore */}
                                    {session.user.plan === 'premium' ? (
                                        <div className="flex items-center space-x-1.5" title="Premium User">
                                            <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider">Premium</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-1.5" title="Freemium User">
                                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Free</span>
                                        </div>
                                    )}
                                    <div className="w-px h-4 bg-gray-300 mx-2"></div>
                                    <span className="text-sm font-medium text-gray-700">{session.user?.name}</span>
                                </div>
                                <Link href="/tools/utm-builder" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    UTM Builder
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-600 hover:text-gray-900 px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="text-gray-600 hover:text-red-600 px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-600 hover:text-gray-900 px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
