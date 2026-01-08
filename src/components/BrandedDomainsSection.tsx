'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BrandedDomainsSection() {
    const [domain, setDomain] = useState("mybrand.com");
    const [alias, setAlias] = useState("super-sale");
    const [isTyping, setIsTyping] = useState(false);

    // Auto-type effect for demo purposes (optional, but interactive is better)
    // Let's just let user type

    return (
        <div className="w-full py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 opacity-60 rounded-[100%] blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Visual Side */}
                <div className="relative transform hover:scale-[1.01] transition-transform duration-500">
                    {/* Floating Cards */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 z-10">
                        {/* Card Header */}
                        <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-4 flex-1 bg-gray-100 dark:bg-gray-700 rounded-md h-6 w-full flex items-center px-3 text-xs text-gray-500 overflow-hidden">
                                <span className="text-gray-400 mr-1">https://</span>
                                <span className="text-gray-800 dark:text-gray-200 font-semibold">{domain}</span>
                                <span className="text-gray-400">/{alias}</span>
                            </div>
                        </div>

                        {/* Card Body - Comparison */}
                        <div className="space-y-6">
                            {/* Generic */}
                            <div className="group opacity-50 hover:opacity-100 transition-opacity">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Generic Link (Boring 😴)</p>
                                <div className="flex items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border-l-4 border-gray-300">
                                    <span className="text-gray-500 line-through text-lg">shrt.lnk/Xy7z9a</span>
                                </div>
                            </div>

                            {/* Branded */}
                            <div className="group relative">
                                <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    Branded Link (Professional 🚀)
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                                        +34% Clicks
                                    </span>
                                </p>
                                <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border-l-4 border-blue-500 shadow-md">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-4h5L12 11zm0 2.5l-5-2.5L2 17l10 5 10-5-5-2.8z" /></svg>
                                    </div>
                                    <div className="flex items-center justify-between relative z-10">
                                        <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 break-all">
                                            {domain}/{alias}
                                        </span>
                                        <svg className="w-6 h-6 text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decor Elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>

                    {/* Interactive Input Panel */}
                    <div className="absolute -bottom-8 -right-4 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-xl rounded-xl p-4 border border-gray-200 dark:border-gray-600 hidden md:block">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Try it live:</label>
                        <input
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                            maxLength={20}
                            className="w-full text-sm border-b-2 border-blue-500 bg-transparent focus:outline-none py-1 mb-2 font-mono text-gray-800 dark:text-white"
                        />
                        <p className="text-xs text-blue-600">Editing alias...</p>
                    </div>
                </div>

                {/* Text Side */}
                <div>
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-6 border border-blue-100 dark:border-blue-800">
                        <span className="flex h-2 w-2 relative mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        New Feature
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                        Your Brand. <br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Links.</span>
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        Don't let generic shorteners steal your thunder. Connect your own domain (e.g., <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">go.yourbrand.com</span>) to build trust, authority, and recognition with every click.
                    </p>

                    <div className="space-y-4 mb-10">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Increase Click-Through Rates</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Branded links get up to 34% more clicks than generic ones.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mt-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Build Brand Authority</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Every link you share promotes YOUR brand, not ours.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/register?plan=premium"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-1"
                        >
                            Get Branded Domains
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <input
                            type="text"
                            placeholder="yourbrand.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value.toLowerCase())}
                            className="px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <p className="mt-3 text-xs text-gray-500">
                        Try typing your domain above to preview.
                    </p>
                </div>
            </div>
        </div>
    );
}
