"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutTemplate, Palette, Share2, PlusCircle, Instagram, Twitter, Globe, Github } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
    {
        id: "minimal",
        name: "Minimal",
        bg: "bg-white dark:bg-gray-900",
        text: "text-gray-900 dark:text-gray-100",
        button: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100",
        accent: "bg-black dark:bg-white"
    },
    {
        id: "gradient",
        name: "Vibrant",
        bg: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
        text: "text-white",
        button: "bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20",
        accent: "bg-white"
    },
    {
        id: "professional",
        name: "Pro",
        bg: "bg-slate-900",
        text: "text-white",
        button: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg",
        accent: "bg-blue-500"
    }
];

const socialLinks = [
    { icon: Instagram, label: "Instagram" },
    { icon: Twitter, label: "Twitter" },
    { icon: Globe, label: "Website" },
    { icon: Github, label: "GitHub" }
];

export default function BioLinkShowcase() {
    const [activeTheme, setActiveTheme] = useState(themes[1]);

    return (
        <section className="py-20 relative overflow-hidden bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Content & Controls */}
                    <div className="order-2 lg:order-1 space-y-8">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm font-medium mb-4">
                                <LayoutTemplate className="w-4 h-4 mr-2" />
                                Available Now
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
                                One Link to Rule Them All
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                Create a beautiful, customizable Bio Page to house all your important links. Perfect for social media profiles.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                                Choose a Style
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setActiveTheme(theme)}
                                        className={cn(
                                            "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2",
                                            activeTheme.id === theme.id
                                                ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                                : "border-transparent bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        <div className={cn("w-3 h-3 rounded-full mr-2",
                                            theme.id === 'gradient' ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                                                theme.id === 'professional' ? "bg-slate-900" : "bg-gray-200 border border-gray-400"
                                        )} />
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ul className="space-y-4 pt-4">
                            {[
                                { icon: Palette, text: "Fully customizable themes & colors" },
                                { icon: Share2, text: "Centralize your digital presence" },
                                { icon: PlusCircle, text: "Unlimited links & social icons" }
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center text-gray-700 dark:text-gray-300"
                                >
                                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 text-purple-600 dark:text-purple-400">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    {item.text}
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Side: Phone Mockup */}
                    <div className="order-1 lg:order-2 flex justify-center perspective-1000">
                        <motion.div
                            animate={{
                                rotateY: -10,
                                rotateX: 5
                            }}
                            className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden ring-1 ring-gray-800/50"
                        >
                            {/* Dynamic Content Container */}
                            <motion.div
                                className={cn("w-full h-full p-6 flex flex-col relative transition-colors duration-500", activeTheme.bg)}
                                layoutId="phone-bg"
                            >
                                {/* Profile Header */}
                                <div className="flex flex-col items-center mb-8 pt-8">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-4 border-white/20 shadow-lg relative">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className={cn("text-xl font-bold mb-1 transition-colors duration-300", activeTheme.text)}>
                                        Alex Developer
                                    </h3>
                                    <p className={cn("text-sm opacity-80 text-center transition-colors duration-300", activeTheme.text)}>
                                        Full Stack Dev | Content Creator
                                    </p>
                                </div>

                                {/* Links */}
                                <div className="space-y-3 flex-1">
                                    {socialLinks.map((link, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className={cn(
                                                "w-full py-3 px-4 rounded-xl flex items-center justify-between group cursor-pointer transition-all duration-300 shadow-sm hover:scale-[1.02]",
                                                activeTheme.button
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <link.icon className="w-5 h-5 mr-3 opacity-80" />
                                                <span className="font-medium text-sm">{link.label}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Generic Footer branding */}
                                <div className="mt-auto pt-6 flex justify-center">
                                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase opacity-60 tracking-widest", activeTheme.text)}>
                                        Via URL Shortener
                                    </div>
                                </div>
                            </motion.div>

                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>

                            {/* Dynamic Status Bar Items for realism */}
                            <div className="absolute top-1.5 right-5 w-3 h-3 rounded-full bg-gray-800 z-20"></div>
                            <div className="absolute top-1.5 left-5 text-[10px] font-bold text-gray-500 z-20">9:41</div>

                        </motion.div>

                        {/* Floating Emojis or Elements behind phone */}
                        <div className="absolute top-20 -right-4 w-16 h-16 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-20 -left-4 w-20 h-20 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
