"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCheckoutSession } from "@/app/actions/billing";

function BioSampleModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-transparent w-full max-w-sm h-full max-h-[800px] flex items-center justify-center relative" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 w-[320px] h-[640px] overflow-hidden">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>
                    <div className="bg-gradient-to-b from-indigo-100 to-purple-100 h-full w-full rounded-[2.2rem] overflow-y-auto hide-scrollbar relative">
                        <div className="pt-12 pb-6 px-6 text-center">
                            <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-lg mb-4">
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-400 to-orange-300 flex items-center justify-center text-3xl text-white font-bold">SA</div>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-1">
                                Sarah Anderson
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">Digital Creator & Photographer 📸</p>
                            <div className="flex justify-center gap-4 mt-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-gray-700 hover:bg-white transition-colors cursor-pointer">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-5 space-y-3 pb-8">
                            {["My Portfolio Website", "Latest YouTube Video", "Book a Photography Session", "Follow on Instagram", "My Gear Recommendations"].map((text, i) => (
                                <div key={i} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm text-center font-medium text-gray-800 transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/50">{text}</div>
                            ))}
                        </div>
                        <div className="pb-6 text-center">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                Shortener
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="absolute -top-12 md:top-4 md:-right-12 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
}

export default function PricingPageContent() {
    const { data: session } = useSession();
    const router = useRouter();
    const [showBioSample, setShowBioSample] = useState(false);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!session) {
            router.push('/register?plan=premium');
            return;
        }
        setIsLoading(true);
        try {
            const url = await createCheckoutSession();
            if (url) {
                window.location.href = url;
            } else {
                toast.error("Failed to start checkout");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Powerful Plans for Everyone</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">Whether you're a casual user or a power user, we have the right plan for you. Compare our Guest and Registered plans below.</p>
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                        <button onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')} className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-blue-600" role="switch" aria-checked={billingCycle === 'annual'}>
                            <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>Annual <span className="text-green-600 font-bold ml-1">(10% OFF)</span></span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="p-8 bg-gray-50 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest User</h2>
                            <p className="text-gray-600">Perfect for quick, one-off links.</p>
                            <div className="mt-4"><span className="text-4xl font-extrabold text-gray-900">Free</span><span className="text-gray-500 ml-2">/ forever</span></div>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4">
                                <li className="flex items-start"><svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-700">Instant URL Shortening</span></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-700">Unlimited Redirects</span></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-700">QR Code Generation</span></li>
                                <li className="flex items-start opacity-50"><svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg><span className="text-gray-500">Link Management Dashboard</span></li>
                                <li className="flex items-start opacity-50"><svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg><span className="text-gray-500">Detailed Analytics</span></li>
                                <li className="flex items-start opacity-50"><svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg><span className="text-gray-500">Edit/Delete Links</span></li>
                            </ul>
                            <div className="mt-8"><Link href="/" className="block w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl text-center hover:bg-gray-50 transition-colors">Start Shortening Now</Link></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden hover:border-blue-500 transition-colors duration-300">
                        <div className="p-8 bg-blue-50 border-b border-blue-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registered User</h2>
                            <p className="text-gray-600">Unlock the full potential of your links.</p>
                            <div className="mt-4"><span className="text-4xl font-extrabold text-gray-900">Free</span><span className="text-gray-500 ml-2">/ forever</span></div>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4">
                                {["Everything in Guest", "Comprehensive Dashboard", "Advanced Analytics", "Link Management", "Persistent History", "UTM Builder"].map((feat, i) => (
                                    <li key={i} className="flex items-start"><svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-900 font-medium">{feat}</span></li>
                                ))}
                            </ul>
                            <div className="mt-8"><Link href="/register" className="block w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl text-center hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">Create Free Account</Link></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-500 overflow-hidden transform md:scale-105 z-10 transition-transform duration-300 relative">
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Best Value</div>
                        <div className="p-8 bg-amber-50 border-b border-amber-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium User</h2>
                            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 border border-green-200">7-Day Free Trial</span>
                            <p className="text-gray-600">Power tools for advanced users.</p>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold text-gray-900">{billingCycle === 'monthly' ? '$1' : '$10.80'}</span>
                                <span className="text-gray-500 ml-2">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                            </div>
                            {billingCycle === 'annual' && <p className="text-xs text-green-600 font-semibold mt-1">$0.90 / month (billed annually)</p>}
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4">
                                <li className="flex items-start"><svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-900 font-medium">Everything in Registered</span></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="text-gray-900 font-medium">Branded Domains</span><p className="text-sm text-gray-500 ml-auto pl-4">link.yourbrand.com</p></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-900 font-medium">Bulk URL Upload</span><p className="text-sm text-gray-500 ml-auto pl-4">CSV Upload</p></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="text-gray-900 font-medium">Smart Targeting</span><p className="text-sm text-gray-500 ml-auto pl-4">Geo & Time</p></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-gray-900 font-medium">Social Previews</span><p className="text-sm text-gray-500 ml-auto pl-4">Custom Metadata</p></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg><span className="text-gray-900 font-medium">Mobile Deep Linking</span><p className="text-sm text-gray-500 ml-auto pl-4">iOS & Android</p></li>
                                <li className="flex items-start group relative">
                                    <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-900 font-medium">Custom Bio Pages</span>
                                            <button onClick={() => setShowBioSample(true)} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md hover:bg-amber-200 transition-colors font-semibold">See Sample</button>
                                        </div>
                                        <p className="text-sm text-gray-500">Link-in-Bio</p>
                                    </div>
                                </li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-900 font-medium">Permanent Redirect (301)</span></li>
                            </ul>
                            <div className="mt-8">
                                <button onClick={handleUpgrade} disabled={isLoading} className="block w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-4 rounded-xl text-center hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isLoading ? 'Processing...' : session ? 'Upgrade to Premium' : 'Start 7-Day Free Trial'}
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-3">No credit card required. Cancel anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why Create an Account?</h2>
                        <p className="mt-4 text-lg text-gray-600">Take control of your links with our powerful tools.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Deep Analytics", desc: "Gain insights into your audience. See where your clicks are coming from, what devices they use, and when they are most active.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "blue" },
                            { title: "Link Management", desc: "Made a mistake? Need to update a destination? Edit your short links anytime without changing the short URL.", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: "purple" },
                            { title: "Centralized Dashboard", desc: "Keep all your links organized in one place. Search, sort, and filter to find exactly what you need in seconds.", icon: "M12 4v16m8-8H4", color: "green" }
                        ].map((f, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className={`w-12 h-12 bg-${f.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                                    <svg className={`w-6 h-6 text-${f.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showBioSample && <BioSampleModal onClose={() => setShowBioSample(false)} />}
        </div>
    );
}
