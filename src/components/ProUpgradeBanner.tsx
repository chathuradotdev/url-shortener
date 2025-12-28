"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ProUpgradeBanner() {
    const { data: session, status } = useSession();
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if previously dismissed in this session
        const dismissed = sessionStorage.getItem("pro-banner-dismissed");
        if (!dismissed) {
            // Small delay to allow nice entrance
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!isMounted || status === 'loading' || !session) return null;

    // Check if user is already pro
    // @ts-ignore
    if (session.user?.plan === "pro" || session.user?.plan === "premium") return null;

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem("pro-banner-dismissed", "true");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white overflow-hidden z-50"
                >
                    {/* Animated background noise/texture */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 relative z-10 text-center sm:text-left">
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                            <div className="hidden sm:flex p-1.5 bg-white/20 rounded-full backdrop-blur-sm shadow-inner">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                            </div>
                            <p className="text-sm font-medium leading-tight">
                                <span className="opacity-90">Unlock limitless power!</span>
                                <span className="mx-2 hidden sm:inline opacity-50">|</span>
                                <span className="block sm:inline mt-0.5 sm:mt-0 font-semibold group cursor-pointer" onClick={() => window.location.href = '/features'}>
                                    Upgrade to <span className="text-yellow-300 underline decoration-yellow-300/50 underline-offset-4 decoration-2 transition-all hover:decoration-yellow-300">Pro level</span> for just <span className="text-white bg-white/20 px-1.5 py-0.5 rounded text-xs ml-1">$5/month</span>
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/30 backdrop-blur-md h-8 text-xs font-semibold px-4 rounded-full transition-all duration-300 shadow-lg shadow-purple-900/20 group"
                                asChild
                            >
                                <Link href="/features">
                                    Upgrade Now
                                    <ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </Button>
                            <button
                                onClick={handleDismiss}
                                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                                aria-label="Dismiss notification"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
