"use client";

import Link from "next/link";
import { useState } from "react";
import QrCodeDisplay from "./QrCodeDisplay";
import { UrlDataTable } from "./UrlDataTable";

interface Url {
    id: string;
    short_code: string;
    original_url: string;
    clicks: number;
    created_at: string;
    tags?: string[];
    expires_at?: string | null;
    hasPassword?: boolean;
    cloaked?: boolean;
}

interface UrlListProps {
    urls: Url[];
    baseUrl: string;
    userPlan?: string;
}

export default function UrlList({ urls, baseUrl, userPlan }: UrlListProps) {
    const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
    const [qrColor, setQrColor] = useState("#000000");
    const [qrBgColor, setQrBgColor] = useState("#ffffff");
    const [qrWidth, setQrWidth] = useState(400);

    if (urls.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No links yet</h3>
                <p className="text-gray-600 mb-6">
                    You haven't shortened any URLs yet.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m8-8H4" />
                    </svg>
                    <span>Create your first link</span>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                <UrlDataTable
                    data={urls}
                    baseUrl={baseUrl}
                    onShowQrCode={(url) => {
                        setQrModalUrl(url);
                        // Reset colors and size when opening modal
                        setQrColor("#000000");
                        setQrBgColor("#ffffff");
                        setQrWidth(400);
                    }}
                />
            </div>

            {/* QR Modal */}
            {qrModalUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setQrModalUrl(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">QR Code</h3>
                            <button
                                onClick={() => setQrModalUrl(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {userPlan === 'premium' && (
                            <div className="mb-4 space-y-3">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Customize Colors</div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="qrColor" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Foreground</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                id="qrColor"
                                                value={qrColor}
                                                onChange={(e) => setQrColor(e.target.value)}
                                                className="w-8 h-8 p-0 border-0 rounded-full cursor-pointer"
                                            />
                                            <span className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase">{qrColor}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="qrBgColor" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Background</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                id="qrBgColor"
                                                value={qrBgColor}
                                                onChange={(e) => setQrBgColor(e.target.value)}
                                                className="w-8 h-8 p-0 border-0 rounded-full cursor-pointer"
                                            />
                                            <span className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase">{qrBgColor}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex justify-between mb-1">
                                        <label htmlFor="qrWidth" className="text-xs text-gray-500 dark:text-gray-400">Size (px)</label>
                                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{qrWidth}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        id="qrWidth"
                                        min="200"
                                        max="2000"
                                        step="50"
                                        value={qrWidth}
                                        onChange={(e) => setQrWidth(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <QrCodeDisplay
                                url={qrModalUrl}
                                options={{
                                    width: qrWidth,
                                    color: {
                                        dark: qrColor,
                                        light: qrBgColor
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
