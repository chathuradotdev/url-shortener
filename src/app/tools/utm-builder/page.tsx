"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UtmBuilderPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [baseUrl, setBaseUrl] = useState("");
    const [source, setSource] = useState("");
    const [medium, setMedium] = useState("");
    const [campaign, setCampaign] = useState("");
    const [term, setTerm] = useState("");
    const [content, setContent] = useState("");
    const [generatedUrl, setGeneratedUrl] = useState("");
    const [shortening, setShortening] = useState(false);

    const generateUrl = () => {
        if (!baseUrl) return;

        try {
            const url = new URL(baseUrl);
            if (source) url.searchParams.set("utm_source", source);
            if (medium) url.searchParams.set("utm_medium", medium);
            if (campaign) url.searchParams.set("utm_campaign", campaign);
            if (term) url.searchParams.set("utm_term", term);
            if (content) url.searchParams.set("utm_content", content);

            setGeneratedUrl(url.toString());
        } catch (e) {
            alert("Please enter a valid base URL (e.g., https://example.com)");
        }
    };

    const shortenUrl = async () => {
        if (!generatedUrl) return;
        setShortening(true);

        try {
            const res = await fetch("/api/shorten", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ originalUrl: generatedUrl }),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/dashboard?new=${data.shortCode}`);
            } else {
                alert("Failed to shorten URL");
            }
        } catch (e) {
            alert("Something went wrong");
        } finally {
            setShortening(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900">UTM Link Builder</h1>
                    <p className="mt-2 text-gray-600">
                        Easily add campaign parameters to your URLs to track custom campaigns in analytics.
                    </p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com"
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                onBlur={generateUrl}
                            />
                            <p className="mt-1 text-xs text-gray-500">The full website URL (e.g. https://www.example.com)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Campaign Source <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="google, newsletter"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    onBlur={generateUrl}
                                />
                                <p className="mt-1 text-xs text-gray-500">The referrer: (e.g. google, newsletter)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Campaign Medium <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="cpc, banner, email"
                                    value={medium}
                                    onChange={(e) => setMedium(e.target.value)}
                                    onBlur={generateUrl}
                                />
                                <p className="mt-1 text-xs text-gray-500">Marketing medium: (e.g. cpc, banner, email)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Campaign Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="spring_sale"
                                    value={campaign}
                                    onChange={(e) => setCampaign(e.target.value)}
                                    onBlur={generateUrl}
                                />
                                <p className="mt-1 text-xs text-gray-500">Product, promo code, or slogan (e.g. spring_sale)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Campaign Term
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="running+shoes"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    onBlur={generateUrl}
                                />
                                <p className="mt-1 text-xs text-gray-500">Identify the paid keywords</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Campaign Content
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="logolink"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onBlur={generateUrl}
                                />
                                <p className="mt-1 text-xs text-gray-500">Use to differentiate ads</p>
                            </div>
                        </div>

                        {generatedUrl && (
                            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">Generated URL</h3>
                                <div className="break-all bg-white p-3 rounded border border-blue-200 text-gray-600 font-mono text-sm mb-4">
                                    {generatedUrl}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedUrl);
                                            alert("Copied to clipboard!");
                                        }}
                                        className="flex-1 bg-white border border-blue-300 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Copy URL
                                    </button>
                                    {session && (
                                        <button
                                            onClick={shortenUrl}
                                            disabled={shortening}
                                            className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {shortening ? "Shortening..." : "Shorten URL"}
                                        </button>
                                    )}
                                </div>
                                {!session && (
                                    <p className="text-sm text-center mt-3 text-gray-500">
                                        <a href="/login" className="text-blue-600 hover:underline">Log in</a> to shorten this link.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
