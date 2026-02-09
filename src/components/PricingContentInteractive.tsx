"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCheckoutSession } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BioLinkClaimModal } from "@/components/BioLinkClaimModal";

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

export default function PricingContentInteractive() {
    const { data: session } = useSession();
    const router = useRouter();
    const [showBioSample, setShowBioSample] = useState(false);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [bioSlug, setBioSlug] = useState("");
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<'individual' | 'business'>('individual');
    const [showComparison, setShowComparison] = useState(false);

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

    const handleClaimBio = () => {
        if (!bioSlug) {
            toast.error("Please enter a username");
            return;
        }

        if (session) {
            setShowClaimModal(true);
        } else {
            if (typeof window !== 'undefined') {
                localStorage.setItem('pending_bio_claim', JSON.stringify({ slug: bioSlug }));
            }
            router.push('/register');
        }
    };

    const isPaidSubscriber = session?.user?.plan === 'premium' && !!session?.user?.subscription_id;
    const isTrialUser = session?.user?.plan === 'premium' && !session?.user?.subscription_id;

    const plans = {
        individual: [
            {
                name: "Free",
                price: 0,
                annualPrice: 0,
                description: "Quick links, no signup",
                color: "gray",
                popular: false,
                trial: undefined,
                features: [
                    { name: "Instant URL Shortening", included: true },
                    { name: "QR Code Generation", included: true },
                    { name: "Basic Analytics", included: true },
                    { name: "Link Management", included: false },
                    { name: "Bio Pages", included: false },
                ],
                cta: "Start Free",
                ctaLink: "/",
            },
            {
                name: "Bio Page",
                price: 3,
                annualPrice: 28.80,
                description: "Your digital identity",
                color: "purple",
                popular: true,
                badge: "Popular",
                trial: undefined,
                features: [
                    { name: "1 Custom Bio Page", included: true, highlight: true },
                    { name: "Unlimited Links", included: true },
                    { name: "Custom Themes", included: true },
                    { name: "Social Media Icons", included: true },
                    { name: "Analytics Dashboard", included: true },
                    { name: "Lead Collection Forms", included: true },
                    { name: "Custom Widgets", included: true },
                ],
                cta: "See Sample & Subscribe",
                ctaAction: () => setShowBioSample(true),
                subtitle: "Perfect for creators & influencers",
            },
            {
                name: "Registered",
                price: 0,
                annualPrice: 0,
                description: "Full link management",
                color: "blue",
                popular: false,
                trial: undefined,
                features: [
                    { name: "Everything in Free", included: true },
                    { name: "Dashboard", included: true },
                    { name: "Advanced Analytics", included: true },
                    { name: "Link Management", included: true },
                    { name: "History", included: true },
                    { name: "UTM Builder", included: true },
                ],
                cta: session ? "Current Plan" : "Create Account",
                ctaLink: "/register",
                disabled: !!session,
            },
        ],
        business: [
            {
                name: "Professional",
                price: 19,
                annualPrice: 182.40,
                description: "For businesses & marketers",
                color: "amber",
                popular: true,
                badge: "Most Popular",
                trial: !session ? "7-Day Free Trial" : undefined,
                features: [
                    { name: "Unlimited links", included: true, highlight: true },
                    { name: "1 year data retention", included: true, highlight: true },
                    { name: "Branded Domains", included: true },
                    { name: "Smart Targeting", included: true },
                    { name: "Link Rotation (A/B Testing)", included: true },
                    { name: "Link Expiration", included: true },
                    { name: "Burn After Reading", included: true },
                    { name: "Social Previews", included: true },
                    { name: "Deep Links", included: true },
                    { name: "Interim Pages", included: true },
                    { name: "Unlimited Bio Pages", included: true },
                    { name: "Bulk CSV Upload", included: true },
                ],
                cta: isPaidSubscriber ? "Current Plan" : isTrialUser ? "Upgrade Now" : session ? "Upgrade to Pro" : "Start Free Trial",
                ctaAction: handleUpgrade,
                disabled: isPaidSubscriber,
                subtitle: isPaidSubscriber ? "You're on the Pro plan!" : isTrialUser ? "Trial active. Upgrade anytime." : "No credit card required for trial",
            },
            {
                name: "Enterprise",
                price: "Custom",
                annualPrice: "Custom",
                description: "For large organizations",
                color: "slate",
                popular: false,
                trial: undefined,
                features: [
                    { name: "Everything in Professional", included: true },
                    { name: "Multiple team members", included: true },
                    { name: "Role-based permissions", included: true },
                    { name: "Priority support", included: true },
                    { name: "Dedicated account manager", included: true },
                    { name: "Custom onboarding", included: true },
                    { name: "99.9% SLA uptime", included: true },
                    { name: "SSO & advanced security", included: true },
                ],
                cta: "Contact Sales",
                ctaLink: "/contact",
            },
        ],
    };

    const currentPlans = selectedCategory === 'individual' ? plans.individual : plans.business;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        From quick links to full digital identity - flexible pricing for everyone
                    </p>

                    {/* Category Selector */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <button
                            onClick={() => setSelectedCategory('individual')}
                            className={cn(
                                "px-6 py-3 rounded-xl font-semibold transition-all",
                                selectedCategory === 'individual'
                                    ? "bg-blue-600 text-white shadow-lg scale-105"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                            )}
                        >
                            For Individuals
                        </button>
                        <button
                            onClick={() => setSelectedCategory('business')}
                            className={cn(
                                "px-6 py-3 rounded-xl font-semibold transition-all",
                                selectedCategory === 'business'
                                    ? "bg-blue-600 text-white shadow-lg scale-105"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                            )}
                        >
                            For Businesses
                        </button>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center space-x-4">
                        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                        <button onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')} className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-blue-600" role="switch" aria-checked={billingCycle === 'annual'}>
                            <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>Annual <span className="text-green-600 font-bold ml-1">(20% OFF)</span></span>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className={cn(
                    "grid gap-6",
                    currentPlans.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" :
                        currentPlans.length === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
                            "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                )}>
                    {currentPlans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={cn(
                                "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative",
                                plan.popular && "border-2 lg:scale-105 z-10",
                                plan.color === "purple" && "border-purple-200",
                                plan.color === "amber" && "border-amber-500",
                                plan.color === "blue" && "border-blue-100",
                                !plan.popular && "border border-gray-100"
                            )}
                        >
                            {plan.badge && (
                                <div className={cn(
                                    "absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider",
                                    plan.color === "purple" && "bg-purple-500",
                                    plan.color === "amber" && "bg-gradient-to-r from-amber-500 to-orange-500"
                                )}>
                                    {plan.badge}
                                </div>
                            )}

                            <div className={cn(
                                "p-6 border-b",
                                plan.color === "purple" && "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100",
                                plan.color === "amber" && "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100",
                                plan.color === "blue" && "bg-blue-50 border-blue-100",
                                plan.color === "gray" && "bg-gray-50 border-gray-100",
                                plan.color === "slate" && "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100"
                            )}>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                                {plan.trial && <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 border border-green-200">{plan.trial}</span>}
                                <p className="text-sm text-gray-600">{plan.description}</p>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-3xl font-extrabold text-gray-900">
                                        {typeof plan.price === 'number' ? `$${billingCycle === 'monthly' ? plan.price : plan.annualPrice}` : plan.price}
                                    </span>
                                    {typeof plan.price === 'number' && (
                                        <span className="text-gray-500 ml-2 text-sm">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                                    )}
                                </div>
                                {billingCycle === 'annual' && typeof plan.price === 'number' && plan.price > 0 && typeof plan.annualPrice === 'number' && (
                                    <p className="text-xs text-green-600 font-semibold mt-1">
                                        ${(plan.annualPrice / 12).toFixed(2)}/month (save 20%)
                                    </p>
                                )}
                            </div>

                            <div className="p-6">
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className={cn(
                                            "flex items-start text-sm",
                                            !feature.included && "opacity-50"
                                        )}>
                                            <svg className={cn(
                                                "w-5 h-5 mr-2 flex-shrink-0 mt-0.5",
                                                feature.included && plan.color === "purple" && "text-purple-500",
                                                feature.included && plan.color === "amber" && "text-amber-500",
                                                feature.included && plan.color === "blue" && "text-blue-500",
                                                feature.included && plan.color === "gray" && "text-green-500",
                                                feature.included && plan.color === "slate" && "text-gray-700",
                                                !feature.included && "text-gray-400"
                                            )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.included ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                                            </svg>
                                            <span className={cn(
                                                feature.included ? "text-gray-900" : "text-gray-500",
                                                'highlight' in feature && feature.highlight && "font-semibold"
                                            )}>
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {plan.name === 'Bio Page' ? (
                                    <div className="mt-2 text-left">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Claim your link</label>
                                        <div className="flex items-center border border-purple-200 bg-white rounded-xl overflow-hidden focus-within:ring-2 ring-purple-500/50 transition-all shadow-sm mb-3">
                                            <span className="pl-3 pr-1 text-gray-400 text-sm font-medium h-full flex items-center select-none bg-gray-50/50">linkjet.co/</span>
                                            <input
                                                type="text"
                                                placeholder="yourname"
                                                className="flex-1 p-2.5 outline-none text-sm font-bold text-gray-900 placeholder-gray-300 w-full min-w-0"
                                                value={bioSlug}
                                                onChange={(e) => setBioSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleClaimBio()}
                                            />
                                        </div>
                                        <button
                                            onClick={handleClaimBio}
                                            disabled={!bioSlug}
                                            className="block w-full font-bold py-3 px-4 rounded-xl text-center text-sm shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-70 disabled:grayscale"
                                        >
                                            {bioSlug ? `Claim ${bioSlug}` : 'Enter Username'}
                                        </button>
                                        <button onClick={() => setShowBioSample(true)} className="w-full text-center text-xs text-purple-600 font-bold mt-3 hover:underline">
                                            See Sample Profile
                                        </button>
                                    </div>
                                ) : plan.ctaAction ? (
                                    <button
                                        onClick={plan.ctaAction}
                                        disabled={plan.disabled || isLoading}
                                        className={cn(
                                            "block w-full font-semibold py-2.5 px-4 rounded-xl text-center text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed",
                                            plan.color === "purple" && "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
                                            plan.color === "amber" && !plan.disabled && "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700",
                                            plan.color === "amber" && plan.disabled && "bg-gray-100 text-gray-400 border border-gray-200",
                                            plan.color === "blue" && "bg-blue-600 text-white hover:bg-blue-700",
                                            plan.color === "gray" && "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        )}
                                    >
                                        {isLoading && plan.color === "amber" ? 'Processing...' : plan.cta}
                                    </button>
                                ) : (
                                    <Link
                                        href={plan.ctaLink || "#"}
                                        className={cn(
                                            "block w-full font-semibold py-2.5 px-4 rounded-xl text-center text-sm shadow-md hover:shadow-lg transition-all",
                                            plan.color === "slate" && "bg-gray-900 text-white hover:bg-gray-800",
                                            plan.color === "blue" && plan.disabled && "bg-gray-50 text-gray-400 border border-gray-200 cursor-default",
                                            plan.color === "blue" && !plan.disabled && "bg-blue-600 text-white hover:bg-blue-700",
                                            plan.color === "gray" && "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        )}
                                    >
                                        {plan.cta}
                                    </Link>
                                )}
                                {plan.subtitle && (
                                    <p className="text-xs text-center text-gray-500 mt-2">{plan.subtitle}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison Toggle */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        {showComparison ? 'Hide' : 'Show'} Detailed Feature Comparison
                        <svg className={cn("w-5 h-5 transition-transform", showComparison && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Detailed Comparison Table */}
                {showComparison && (
                    <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 overflow-x-auto animate-in fade-in slide-in-from-top-4 duration-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Feature Comparison</h3>
                        <p className="text-gray-600 mb-8">See exactly what's included in each plan</p>
                        {/* Comparison table would go here - keeping it simple for now */}
                        <div className="text-center text-gray-500 py-8">
                            Detailed comparison table coming soon...
                        </div>
                    </div>
                )}
            </div>

            {showBioSample && <BioSampleModal onClose={() => setShowBioSample(false)} />}
            {showClaimModal && <BioLinkClaimModal defaultSlug={bioSlug} onClose={() => setShowClaimModal(false)} />}
        </div>
    );
}
