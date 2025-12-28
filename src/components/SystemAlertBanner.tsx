"use client";

import { SystemAlert } from "@/lib/db";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SystemAlertBanner({ alerts }: { alerts: SystemAlert[] }) {
    // Show the most recent active alert
    const activeAlert = alerts && alerts.length > 0 ? alerts[0] : null;
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (activeAlert) {
            const dismissed = sessionStorage.getItem(`alert-dismissed-${activeAlert.id}`);
            if (!dismissed) {
                const timer = setTimeout(() => setIsVisible(true), 100);
                return () => clearTimeout(timer);
            }
        }
    }, [activeAlert]);

    if (!isMounted || !activeAlert) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem(`alert-dismissed-${activeAlert.id}`, "true");
    };

    const getStyles = (type: SystemAlert['type']) => {
        switch (type) {
            case 'promo':
                return {
                    bg: "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600",
                    text: "text-white",
                    icon: <Sparkles className="w-4 h-4 text-yellow-300" />,
                    dismiss: "text-white/70 hover:text-white hover:bg-white/10"
                };
            case 'warning':
                return {
                    bg: "bg-amber-500",
                    text: "text-white",
                    icon: <AlertTriangle className="w-4 h-4 text-white" />,
                    dismiss: "text-white/70 hover:text-white hover:bg-white/10"
                };
            case 'error':
                return {
                    bg: "bg-red-600",
                    text: "text-white",
                    icon: <AlertTriangle className="w-4 h-4 text-white" />,
                    dismiss: "text-white/70 hover:text-white hover:bg-white/10"
                };
            case 'success':
                return {
                    bg: "bg-emerald-600",
                    text: "text-white",
                    icon: <CheckCircle className="w-4 h-4 text-white" />,
                    dismiss: "text-white/70 hover:text-white hover:bg-white/10"
                };
            default: // info
                return {
                    bg: "bg-blue-600",
                    text: "text-white",
                    icon: <Info className="w-4 h-4 text-white" />,
                    dismiss: "text-white/70 hover:text-white hover:bg-white/10"
                };
        }
    };

    const styles = getStyles(activeAlert.type);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={cn("relative overflow-hidden z-50", styles.bg, styles.text)}
                >
                    {activeAlert.type === 'promo' && (
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse" />
                    )}

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 relative z-10">
                        <div className="flex items-center gap-3 justify-center w-full sm:justify-center text-center sm:text-left">
                            <div className="hidden sm:flex p-1.5 bg-white/20 rounded-full backdrop-blur-sm shadow-inner shrink-0">
                                {styles.icon}
                            </div>
                            <p className="text-sm font-medium leading-tight">
                                {activeAlert.message}
                            </p>

                            {activeAlert.action_label && activeAlert.action_url && (
                                <Link
                                    href={activeAlert.action_url}
                                    className="ml-2 hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors backdrop-blur-sm"
                                >
                                    {activeAlert.action_label}
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Mobile only button */}
                            {activeAlert.action_label && activeAlert.action_url && (
                                <Link
                                    href={activeAlert.action_url}
                                    className="sm:hidden inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors backdrop-blur-sm whitespace-nowrap"
                                >
                                    {activeAlert.action_label}
                                </Link>
                            )}

                            <button
                                onClick={handleDismiss}
                                className={cn("rounded-full p-1 transition-colors shrink-0", styles.dismiss)}
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
