"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LayoutTemplate, Palette, Share2, PlusCircle, Globe, Smartphone, BarChart3, Rocket, CheckCircle2, ArrowRight, Zap, Target, Sparkles, Wand2, MousePointer2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const features = [
    {
        title: "Fully Customizable",
        description: "Match your brand with deep customization—colors, fonts, buttons, and high-quality textures.",
        icon: Palette,
        color: "blue"
    },
    {
        title: "Advanced Analytics",
        description: "Understand your audience with real-time data on clicks, devices, and geographic locations.",
        icon: BarChart3,
        color: "purple"
    },
    {
        title: "Social Integration",
        description: "Connect all your social profiles in one place with beautiful, high-click icons and links.",
        icon: Share2,
        color: "pink"
    },
    {
        title: "Smart Targeting",
        description: "Use conditional logic to send users to different content based on their location or device.",
        icon: Target,
        color: "green"
    }
];

const EXAMPLES = [
    {
        name: "Artisan",
        bg: "bg-[#fdfbf7]",
        accent: "bg-[#4a1d4a]",
        btn: "bg-white border-[#4a1d4a]/10",
        text: "text-[#4a1d4a]",
        img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400",
        font: "font-serif"
    },
    {
        name: "Gamer",
        bg: "bg-[#0f172a]",
        accent: "bg-[#8b5cf6]",
        btn: "bg-[#8b5cf6]",
        text: "text-white",
        img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400",
        font: "font-mono"
    },
    {
        name: "Boho",
        bg: "bg-[#f1e8e0]",
        accent: "bg-[#a67c52]",
        btn: "bg-[#a67c52]",
        text: "text-[#4a3728]",
        img: "https://images.unsplash.com/photo-1544070078-a212eda27b49?q=80&w=400",
        font: "font-sans"
    },
    {
        name: "Organic",
        bg: "bg-[#d1e2c4]",
        accent: "bg-[#1a3c34]",
        btn: "bg-white/40 backdrop-blur-md",
        text: "text-[#1a3c34]",
        img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400",
        font: "font-sans"
    }
];

export default function BioFeaturesPage() {
    const [mockLinks, setMockLinks] = useState<{ id: number; title: string; color: string }[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    const addMockLink = () => {
        if (isAdding || mockLinks.length >= 5) return;
        setIsAdding(true);
        const newLink = {
            id: Date.now(),
            title: ["My Portfolio", "Latest Video", "New Collection", "Store", "Contact"][mockLinks.length],
            color: ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-green-500"][mockLinks.length]
        };
        setMockLinks(prev => [...prev, newLink]);
        setTimeout(() => setIsAdding(false), 500);
    };

    const clearMockLinks = () => setMockLinks([]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden pt-20">
            {/* Hero Section */}
            <section className="relative px-6 pt-12 pb-32 max-w-7xl mx-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none -z-10 blur-3xl"></div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-black uppercase tracking-widest mb-6">
                            <Sparkles className="w-3 h-3" /> More than just a link
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
                            Build Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
                                Digital Universe
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-xl">
                            One elegant interface for everything you create. Transform your bio into a high-converting hub with colorful designs and interactive links.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/register">
                                <button className="px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black transition-all hover:scale-105 shadow-2xl active:scale-95 flex items-center gap-2">
                                    Claim Your Link <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Interactive "Link Builder" Demo */}
                    <div className="relative flex flex-col items-center">
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={addMockLink}
                                disabled={mockLinks.length >= 5}
                                className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border-2 border-slate-100 dark:border-gray-800 rounded-2xl font-bold shadow-xl hover:border-blue-500 transition-all active:scale-95"
                            >
                                <PlusCircle className="w-5 h-5 text-blue-500 group-hover:rotate-90 transition-transform" />
                                Add Link
                            </button>
                            <button
                                onClick={clearMockLinks}
                                className="px-6 py-3 bg-slate-100 dark:bg-gray-800 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Reset
                            </button>
                        </div>

                        <motion.div
                            className="relative z-10 w-[300px] h-[600px] bg-gray-900 rounded-[3.5rem] border-8 border-gray-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden ring-4 ring-white/5"
                        >
                            {/* Inner Screen Mockup */}
                            <div className="w-full h-full bg-slate-50 p-6 flex flex-col pt-16">
                                <motion.div
                                    className="w-20 h-20 rounded-full bg-white mx-auto mb-6 shadow-xl relative"
                                    layout
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-10 animate-pulse"></div>
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full p-2" alt="Avatar" />
                                </motion.div>

                                <div className="text-center mb-8">
                                    <h4 className="font-black text-gray-900 text-lg">Alex Dev</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Influencer & Creator</p>
                                </div>

                                <div className="space-y-3 flex-grow overflow-y-auto no-scrollbar pb-10">
                                    {mockLinks.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-48 text-gray-300 gap-2">
                                            <MousePointer2 className="w-8 h-8 opacity-20 animate-bounce" />
                                            <p className="text-xs font-bold uppercase opacity-20">Click Add Link</p>
                                        </div>
                                    )}
                                    <AnimatePresence>
                                        {mockLinks.map((link) => (
                                            <motion.div
                                                key={link.id}
                                                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                className={cn("w-full py-4 px-6 rounded-2xl flex items-center justify-center font-black text-white shadow-lg", link.color)}
                                            >
                                                {link.title}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
                        </motion.div>

                        {/* Decorative dynamic glows */}
                        <div className="absolute -z-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Template Gallery - MORE COLORFUL */}
            <section className="py-24 bg-slate-50 dark:bg-gray-900/30 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Stunning Styles</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">Presets that fit your vibe perfectly. One click to change everything.</p>
                        </div>
                        <Link href="/register">
                            <div className="inline-flex items-center gap-2 group cursor-pointer font-bold text-blue-600">
                                Browse all themes <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {EXAMPLES.map((ex, i) => (
                            <motion.div
                                key={ex.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative"
                            >
                                <div className={cn("aspect-[4/5] rounded-[2.5rem] p-6 flex flex-col items-center relative overflow-hidden shadow-xl border border-black/5 group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2", ex.bg)}>
                                    <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity">
                                        <div className="w-full h-full" style={{ backgroundImage: `url(${ex.img})`, backgroundSize: 'cover' }}></div>
                                    </div>

                                    <div className="w-16 h-16 rounded-full bg-gray-200 mb-6 overflow-hidden border-2 border-white shadow-lg relative z-10">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ex.name}`} alt="avatar" />
                                    </div>

                                    <div className={cn("text-center mb-10 relative z-10", ex.text)}>
                                        <h5 className={cn("font-bold text-lg mb-1", ex.font)}>{ex.name}</h5>
                                        <div className="h-1 w-12 bg-current opacity-20 mx-auto rounded-full"></div>
                                    </div>

                                    <div className="space-y-3 w-full relative z-10">
                                        <div className={cn("h-10 w-full rounded-xl shadow-sm border", ex.btn)}></div>
                                        <div className={cn("h-10 w-full rounded-xl shadow-sm border opacity-80", ex.btn)}></div>
                                        <div className={cn("h-10 w-full rounded-xl shadow-sm border opacity-60", ex.btn)}></div>
                                    </div>

                                    <div className="mt-auto relative z-10 pt-6">
                                        <div className={cn("w-10 h-1 rounded-full", ex.accent)}></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Bento Section - High Energy */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">Powered for <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Engagement</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all">
                            <BarChart3 className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 max-w-md">
                            <h3 className="text-3xl font-black mb-6 leading-tight">Elite Analytics <br />Dashboard</h3>
                            <p className="text-blue-100/80 mb-8 font-medium">Track every click, visit, and device with surgical precision. Understand exactly where your growth is coming from.</p>
                            <div className="flex gap-2">
                                <div className="h-2 w-12 bg-white rounded-full"></div>
                                <div className="h-2 w-4 bg-white/30 rounded-full"></div>
                                <div className="h-2 w-4 bg-white/30 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-purple-500 rounded-[3rem] text-white overflow-hidden relative group">
                        <div className="absolute -bottom-10 -right-10 opacity-30 group-hover:scale-125 transition-transform duration-700">
                            <Share2 className="w-40 h-40" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Global Reach</h3>
                        <p className="text-purple-100/80 text-sm font-medium pr-10">Integration with 20+ social platforms and custom icon sets.</p>
                    </div>

                    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3rem] text-white relative group">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] pointer-events-none group-hover:bg-blue-500/40 transition-all"></div>
                        <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                            <Wand2 className="w-6 h-6 text-blue-400" /> Smart Flow
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">Redirect users based on their country, time of day, or device automatically.</p>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="text-[10px] text-slate-500 uppercase font-black mb-3">Targeting Active</div>
                            <div className="flex justify-between items-center text-xs">
                                <span>US Visitors</span>
                                <span className="text-blue-400 font-bold">Store A</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 p-10 bg-pink-500 rounded-[3rem] text-white relative overflow-hidden group">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-3xl font-black mb-4 leading-tight">The Aesthetic Standard</h3>
                                <p className="text-pink-100/90 font-medium">Glassmorphism, high-res backgrounds, and smooth transitions built-in.</p>
                            </div>
                            <div className="relative">
                                <div className="w-full h-32 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20"></div>
                                <div className="absolute top-4 left-4 h-4 w-24 bg-white rounded-full"></div>
                                <div className="absolute bottom-4 left-4 h-2 w-12 bg-white/40 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-gradient-to-b from-white to-slate-100 dark:from-gray-950 dark:to-black text-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-block p-4 mb-8 bg-blue-600/10 text-blue-600 rounded-full">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-5xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">Make it <span className="underline decoration-blue-500 decoration-8 underline-offset-4">yours</span> today.</h2>
                    <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">Free forever for personal use. Level up for advanced branding and insights.</p>
                    <Link href="/register">
                        <button className="px-16 py-8 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95">
                            Get Your Bio Link
                        </button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
