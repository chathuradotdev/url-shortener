"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCheckoutSession } from "@/app/actions/billing";

interface BioLinkClaimModalProps {
    defaultSlug?: string;
    onClose: () => void;
    forced?: boolean;
}

export function BioLinkClaimModal({ defaultSlug = "", onClose, forced = false }: BioLinkClaimModalProps) {
    const [slug, setSlug] = useState(defaultSlug);
    const [step, setStep] = useState<'slug' | 'plan'>(defaultSlug ? 'plan' : 'slug');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const checkSlug = async () => {
        if (!slug) return;
        setLoading(true);
        try {
            const res = await fetch('/api/bio/check-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug })
            });
            const data = await res.json();
            if (data.available) {
                setStep('plan');
            } else {
                toast.error(data.message || "Slug unavailable");
            }
        } catch (error) {
            toast.error("Failed to check slug availability");
        } finally {
            setLoading(false);
        }
    };

    const handlePayNow = async () => {
        setLoading(true);
        try {
            // Create Bio Page via API first 
            const res = await fetch('/api/bio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, title: slug })
            });

            if (!res.ok) {
                const data = await res.json();
                if (res.status !== 409 && res.status !== 500) {
                    throw new Error(data.error || "Failed to create page");
                }
                if (res.status === 500) {
                    throw new Error("Server error creating page");
                }
            }

            // VARIANT ID for 1 Year $3/mo ($36/year). 
            const ANNUAL_VARIANT_ID = process.env.LEMONSQUEEZY_VARIANT_ID_ANNUAL || "365384";

            const url = await createCheckoutSession(
                ANNUAL_VARIANT_ID,
                `${window.location.origin}/${slug}`, // Redirect URL
                { bio_slug: slug } // Custom Data
            );

            // Clear pending claim
            if (typeof window !== 'undefined') {
                localStorage.removeItem('pending_bio_claim');
            }

            if (url) {
                window.location.href = url;
            }
        } catch (error: any) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    // In return block:

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200"
            // Prevent close on background click if forced
            onClick={(e) => {
                if (!forced && e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative border border-gray-100 dark:border-gray-800">
                {!forced && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                )}

                {step === 'slug' ? (
                    <>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Claim Your Link</h2>
                        <p className="text-sm text-gray-500 mb-6">Enter your unique handle to get started.</p>

                        <div className="flex items-center border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-6 focus-within:ring-2 ring-blue-500 transition-all">
                            <span className="text-gray-500 font-medium pl-1 select-none">linkjet.co/</span>
                            <input
                                value={slug}
                                onChange={e => {
                                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
                                    setSlug(val);
                                }}
                                className="flex-1 outline-none ml-1 bg-transparent font-bold text-lg text-gray-900 dark:text-white placeholder-gray-400"
                                placeholder="name"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && checkSlug()}
                            />
                        </div>
                        <button
                            onClick={checkSlug}
                            disabled={!slug || loading}
                            className="w-full bg-blue-600 text-white rounded-xl py-3.5 font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                        >
                            {loading ? "Checking..." : "Continue"}
                        </button>
                    </>
                ) : (
                    <div className="animate-in slide-in-from-right-8 duration-300">
                        <div className="text-center mb-8">
                            <div className="inline-block p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">"{slug}" is available!</h2>
                            <p className="text-gray-500 text-sm">Secure this handle immediately before someone else claims it.</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-100 dark:border-blue-800 rounded-2xl p-6 mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                Save 40%
                            </div>

                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Pro Year Plan</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-gray-900 dark:text-white">$36</span>
                                        <span className="text-gray-400 line-through font-medium">$60</span>
                                        <span className="text-sm text-gray-500">/year</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">$3<span className="text-sm text-gray-500 font-medium">/mo</span></p>
                                </div>
                            </div>

                            <ul className="space-y-2 mb-0">
                                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>Instant ownership of <b>linkjet.co/{slug}</b></span>
                                </li>
                                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>Removes "LinkJet" branding</span>
                                </li>
                                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>Advanced Analytics & Custom Domains</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={handlePayNow}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-4 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 group"
                        >
                            <span className="font-bold text-lg">Secure & Pay $36</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            30-day money-back guarantee • Secure payment via LemonSqueezy
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
