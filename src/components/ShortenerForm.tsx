"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import QrCodeDisplay from "./QrCodeDisplay";

export default function ShortenerForm() {
    const { data: session } = useSession();
    const [originalUrl, setOriginalUrl] = useState("");
    const [customAlias, setCustomAlias] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [tags, setTags] = useState("");
    const [password, setPassword] = useState("");
    const [cloaked, setCloaked] = useState(false);
    const [shortUrl, setShortUrl] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailStatus, setEmailStatus] = useState("");
    const [copied, setCopied] = useState(false);
    const [androidDeepLink, setAndroidDeepLink] = useState("");
    const [iosDeepLink, setIosDeepLink] = useState("");
    const [permanentRedirect, setPermanentRedirect] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setShortUrl("");
        setEmailStatus("");
        setCopied(false);

        // Parse tags
        const parsedTags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

        try {
            const res = await fetch("/api/shorten", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalUrl,
                    customAlias,
                    expiresAt: expiresAt || null,
                    tags: parsedTags,
                    password: password || null,
                    cloaked,
                    androidDeepLink,
                    iosDeepLink,
                    permanentRedirect,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setShortUrl(data.shortUrl);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendEmail = async () => {
        if (!email) return;
        setEmailStatus("Sending...");
        try {
            const res = await fetch("/api/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, shortUrl }),
            });

            if (res.ok) {
                setEmailStatus("Sent!");
                setTimeout(() => setEmailStatus(""), 3000);
            } else {
                setEmailStatus("Failed");
                setTimeout(() => setEmailStatus(""), 3000);
            }
        } catch (e) {
            setEmailStatus("Error");
            setTimeout(() => setEmailStatus(""), 3000);
        }
    };

    return (
        <div className={`mx-auto ${session ? 'max-w-full' : 'max-w-5xl'}`}>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-shadow duration-300">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        {session ? (
                            <div className="relative group mb-4">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-xl p-2 ring-1 ring-gray-900/5 dark:ring-white/10">
                                    <div className="pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <input
                                        type="url"
                                        id="url"
                                        required
                                        placeholder="Paste your long URL here..."
                                        value={originalUrl}
                                        onChange={(e) => setOriginalUrl(e.target.value)}
                                        className="flex-1 w-full px-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none text-lg font-medium"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="relative group mb-4">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-xl p-2 ring-1 ring-gray-900/5 dark:ring-white/10">
                                    <div className="pl-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <input
                                        type="url"
                                        id="url"
                                        required
                                        placeholder="Paste your long URL here..."
                                        value={originalUrl}
                                        onChange={(e) => setOriginalUrl(e.target.value)}
                                        className="flex-1 w-full px-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none text-lg font-medium"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-bold text-base shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Shortening...</span>
                                            </>
                                        ) : (
                                            <span>Shorten</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={`grid grid-cols-1 ${session ? 'md:grid-cols-2' : ''} gap-4`}>
                            <div className="flex items-center space-x-2">
                                <div className="relative flex-1 group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-md p-1.5 ring-1 ring-gray-900/5 dark:ring-white/10">
                                        <div className="pl-3 text-gray-400 font-mono text-sm">
                                            /
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Custom alias (optional)"
                                            value={customAlias}
                                            onChange={(e) => setCustomAlias(e.target.value)}
                                            className="flex-1 w-full px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {session && (
                                <div className="flex items-center space-x-2">
                                    <div className="relative flex-1 group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-md p-1.5 ring-1 ring-gray-900/5 dark:ring-white/10">
                                            <div className="pl-3 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="datetime-local"
                                                value={expiresAt}
                                                onChange={(e) => setExpiresAt(e.target.value)}
                                                className="flex-1 w-full px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium"
                                                title="Set expiration date (optional)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {session && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-md p-1.5 ring-1 ring-gray-900/5 dark:ring-white/10">
                                        <div className="pl-3 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Tags (comma separated)"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            className="flex-1 w-full px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-md p-1.5 ring-1 ring-gray-900/5 dark:ring-white/10">
                                        <div className="pl-3 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Password (optional)"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex-1 w-full px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {session && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-md p-1.5 ring-1 ring-gray-900/5 dark:ring-white/10">
                                        <div className="pl-3 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Android Deep Link (e.g. myapp://path)"
                                            value={androidDeepLink}
                                            onChange={(e) => setAndroidDeepLink(e.target.value)}
                                            className="flex-1 w-full px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl shadow-md p-1.5 ring-1 ring-gray-900/5 dark:ring-white/10">
                                        <div className="pl-3 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="iOS Deep Link (e.g. myapp://path)"
                                            value={iosDeepLink}
                                            onChange={(e) => setIosDeepLink(e.target.value)}
                                            className="flex-1 w-full px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {session && (
                            <div className="mt-4 flex flex-col space-y-4">
                                <div className="flex flex-col space-y-3">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={cloaked}
                                                onChange={(e) => setCloaked(e.target.checked)}
                                            />
                                            <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors block">
                                                Cloak Link
                                            </span>
                                            <span className="text-xs text-gray-500">Hide original URL destination</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={permanentRedirect}
                                                onChange={(e) => setPermanentRedirect(e.target.checked)}
                                            />
                                            <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors block">
                                                Permanent Redirect (301)
                                            </span>
                                            <span className="text-xs text-gray-500">For SEO transfer (Premium only)</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-bold text-base shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Shortening...</span>
                                            </>
                                        ) : (
                                            <span>Shorten</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )
                        }

                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2 mt-1">
                            <span>e.g. my-campaign</span>
                            {session && <span>Expiration, Tags & Password (optional)</span>}
                        </div>
                    </div >
                </form >

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-in fade-in">
                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                {
                    shortUrl && (
                        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-900 animate-in fade-in slide-in-from-bottom-4">
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Your shortened URL is ready!
                                </p>
                                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <a
                                        href={shortUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 break-all transition-colors"
                                    >
                                        {shortUrl}
                                    </a>
                                    <button
                                        onClick={handleCopy}
                                        className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 shadow-sm hover:shadow"
                                    >
                                        {copied ? (
                                            <>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                    <Link
                                        href={`/analytics?code=${shortUrl.split('/').pop()}`}
                                        className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow"
                                        title="View Analytics"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        QR Code
                                    </p>
                                    <QrCodeDisplay url={shortUrl} />
                                </div>

                                {session ? (
                                    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Share via Email
                                        </p>
                                        <div className="space-y-2">
                                            <input
                                                type="email"
                                                placeholder="friend@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-400"
                                            />
                                            <button
                                                onClick={handleSendEmail}
                                                disabled={!email || emailStatus === "Sending..."}
                                                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center space-x-2"
                                            >
                                                {emailStatus === "Sending..." ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Sending...</span>
                                                    </>
                                                ) : emailStatus === "Sent!" ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Sent!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                        <span>{emailStatus || "Send Email"}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

                                        <h3 className="text-xl font-bold mb-4 flex items-center">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                                Why Upgrade onto Pro?
                                            </span>
                                            <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">PRO</span>
                                        </h3>

                                        <ul className="space-y-3 mb-6">
                                            {[
                                                { icon: "🎨", text: "Custom QR Colors & Sizes" },
                                                { icon: "🔗", text: "Premium Bio Pages" },
                                                { icon: "🚀", text: "Bulk URL Upload" },
                                                { icon: "📊", text: "Advanced Analytics" },
                                                { icon: "✨", text: "Custom Aliases" },
                                                { icon: "🔒", text: "Password Protection" },
                                            ].map((feature, i) => (
                                                <li key={i} className="flex items-center text-sm text-gray-300">
                                                    <span className="mr-2 text-lg">{feature.icon}</span>
                                                    {feature.text}
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            href="/register"
                                            className="block w-full text-center bg-white text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                                        >
                                            Upgrade - Only $1/Month
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
}
