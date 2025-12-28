"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, EyeOff, Shuffle, ShieldCheck, Tag, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        id: "deeplink",
        icon: Smartphone,
        title: "Mobile Deep Linking",
        description: "Direct mobile users straight to your app with Android and iOS deep links.",
        highlightClass: "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-blue-50/50 dark:bg-blue-900/20"
    },
    {
        id: "cloak",
        icon: EyeOff,
        title: "Link Cloaking",
        description: "Mask the destination URL to keep your branded links clean and professional.",
        highlightClass: "ring-2 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-purple-50/50 dark:bg-purple-900/20"
    },
    {
        id: "tags",
        icon: Tag,
        title: "Smart Tagging",
        description: "Organize your links with custom tags for better analytics and management.",
        highlightClass: "ring-2 ring-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] bg-yellow-50/50 dark:bg-yellow-900/20"
    },
    {
        id: "password",
        icon: ShieldCheck,
        title: "Password Protection",
        description: "Secure your confidential links with password access control.",
        highlightClass: "ring-2 ring-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] bg-yellow-50/50 dark:bg-yellow-900/20"
    },
    {
        id: "redirect",
        icon: Shuffle,
        title: "301 Permanent Redirects",
        description: "Pass maximum SEO authority (link juice) to your destination URL.",
        highlightClass: "ring-2 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] bg-pink-50/50 dark:bg-pink-900/20"
    }
];

const secondaryFeatures = [
    { id: "alias", label: "Custom Aliases" },
    { id: "tags", label: "Tagging" },
    { id: "expiry", label: "Expiration" },
    { id: "password", label: "Password Protection" }
];

export default function AdvancedFeaturesSection() {
    const [activeFeature, setActiveFeature] = useState<string | null>(null);

    return (
        <section className="py-12 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl mb-3">
                        Professional Grade Features
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Upgrade to unlock the full potential of your links. Comprehensive tools for marketers and developers.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Interactive Feature List (Left Side) */}
                    <div className="space-y-3 order-2 lg:order-1">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.id}
                                className={cn(
                                    "p-3 rounded-xl cursor-pointer transition-all duration-300 border-2",
                                    activeFeature === feature.id
                                        ? "bg-white dark:bg-gray-800 border-blue-500 shadow-lg scale-[1.02]"
                                        : "bg-white/50 dark:bg-gray-800/50 border-transparent hover:bg-white hover:shadow-md"
                                )}
                                onClick={() => setActiveFeature(feature.id === activeFeature ? null : feature.id)}
                                onHoverStart={() => setActiveFeature(feature.id)}
                                onHoverEnd={() => setActiveFeature(null)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={cn(
                                        "p-2 rounded-lg transition-colors shrink-0",
                                        activeFeature === feature.id ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600" : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                                    )}>
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            "font-bold text-base mb-0.5",
                                            activeFeature === feature.id ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
                                        )}>
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed line-clamp-1">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mockup Form (Right Side) */}
                    <div className="relative order-1 lg:order-2">
                        {/* Background blobs */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-5 shadow-xl border border-gray-200 dark:border-gray-700 scale-95">
                            {/* Fake Header */}
                            <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <div className="ml-4 text-xs text-gray-400 font-mono">Premium Link Configuration</div>
                            </div>

                            <div className="space-y-4 pointer-events-none select-none">
                                {/* URL Input */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 opacity-50">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                </div>

                                {/* Row 1 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={cn("p-2 rounded-lg transition-all duration-300", activeFeature === 'alias' && "bg-yellow-50 dark:bg-yellow-900/20 ring-1 ring-yellow-400")}>
                                        <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700/50 rounded mb-2"></div>
                                        <div className="h-8 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"></div>
                                    </div>
                                    <div className={cn("p-2 rounded-lg transition-all duration-300", activeFeature === 'expiry' && "bg-yellow-50 dark:bg-yellow-900/20 ring-1 ring-yellow-400")}>
                                        <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700/50 rounded mb-2"></div>
                                        <div className="h-8 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"></div>
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={cn("p-2 rounded-lg transition-all duration-300", activeFeature === 'tags' && "bg-yellow-50 dark:bg-yellow-900/20 ring-1 ring-yellow-400")}>
                                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700/50 rounded mb-2"></div>
                                        <div className="h-8 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"></div>
                                    </div>
                                    <div className={cn("p-2 rounded-lg transition-all duration-300", activeFeature === 'password' && "bg-yellow-50 dark:bg-yellow-900/20 ring-1 ring-yellow-400")}>
                                        <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700/50 rounded mb-2"></div>
                                        <div className="h-8 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"></div>
                                    </div>
                                </div>

                                {/* Deep Links */}
                                <motion.div
                                    className={cn(
                                        "grid grid-cols-2 gap-4 p-3 rounded-xl transition-all duration-300",
                                        activeFeature === 'deeplink' ? features.find(f => f.id === 'deeplink')?.highlightClass : ""
                                    )}
                                >
                                    <div>
                                        <div className="h-2 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                                        <div className="h-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 flex items-center px-3">
                                            <span className="text-gray-300 text-xs">android-app://...</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="h-2 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                                        <div className="h-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 flex items-center px-3">
                                            <span className="text-gray-300 text-xs">ios-app://...</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Toggles */}
                                <div className="space-y-4 pt-2">
                                    {/* Cloak */}
                                    <motion.div
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-xl transition-all duration-300",
                                            activeFeature === 'cloak' ? features.find(f => f.id === 'cloak')?.highlightClass : ""
                                        )}
                                    >
                                        <div>
                                            <div className="h-3 w-24 bg-gray-800 dark:bg-gray-200 rounded mb-1"></div>
                                            <div className="h-2 w-32 bg-gray-400 dark:bg-gray-500 rounded"></div>
                                        </div>
                                        <div className={cn(
                                            "w-12 h-6 rounded-full relative transition-colors",
                                            activeFeature === 'cloak' ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"
                                        )}>
                                            <div className={cn(
                                                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all",
                                                activeFeature === 'cloak' ? "translate-x-6" : ""
                                            )}></div>
                                        </div>
                                    </motion.div>

                                    {/* Redirect */}
                                    <motion.div
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-xl transition-all duration-300",
                                            activeFeature === 'redirect' ? features.find(f => f.id === 'redirect')?.highlightClass : ""
                                        )}
                                    >
                                        <div>
                                            <div className="h-3 w-40 bg-gray-800 dark:bg-gray-200 rounded mb-1"></div>
                                            <div className="h-2 w-28 bg-gray-400 dark:bg-gray-500 rounded"></div>
                                        </div>
                                        <div className={cn(
                                            "w-12 h-6 rounded-full relative transition-colors",
                                            activeFeature === 'redirect' ? "bg-pink-500" : "bg-gray-200 dark:bg-gray-700"
                                        )}>
                                            <div className={cn(
                                                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all",
                                                activeFeature === 'redirect' ? "translate-x-6" : ""
                                            )}></div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <div className="h-10 w-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                                </div>
                            </div>

                            {/* Floating Badges */}
                            <AnimatePresence>
                                {activeFeature && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-1 px-4 rounded-full shadow-lg z-10"
                                    >
                                        Unlocked!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
