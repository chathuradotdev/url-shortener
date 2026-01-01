"use client";

import Link from "next/link";
import { knowledgeBase } from "@/data/knowledgebase";
import { ArrowRight, Book, Star, Search, Zap, Code, User, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { KnowledgeBaseSearch } from "@/components/KnowledgeBaseSearch";

export default function HelpPage() {
    const [searchOpen, setSearchOpen] = useState(false);

    // Group Top Articles
    const popularArticles = knowledgeBase.filter(a => ['getting-started', 'smart-targeting', 'analytics-guide'].includes(a.slug));

    const categories = [
        { name: "Basics", icon: <Star className="w-5 h-5 text-yellow-500" />, desc: "Start shortening links" },
        { name: "Advanced Features", icon: <Sparkles className="w-5 h-5 text-purple-500" />, desc: "Geo-targeting, interim pages" },
        { name: "Reporting", icon: <Zap className="w-5 h-5 text-blue-500" />, desc: "Analytics & Insights" },
        { name: "Developers", icon: <Code className="w-5 h-5 text-green-500" />, desc: "API & Integrations" },
    ];

    return (
        <div className="space-y-16">
            <KnowledgeBaseSearch open={searchOpen} onOpenChange={setSearchOpen} />

            {/* Hero Section */}
            <section className="text-center space-y-6 pt-8 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                        How can we help you?
                    </h1>
                    <p className="text-xl text-gray-500">
                        Search for answers, browse guides, or contact support.
                    </p>
                </motion.div>

                {/* Big Search Trigger */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    onClick={() => setSearchOpen(true)}
                    className="relative max-w-lg mx-auto group cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex items-center gap-3 group-hover:border-blue-300 group-hover:shadow-md transition-all">
                        <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-gray-400 text-lg flex-1 text-left">Search the knowledge base...</span>
                        <span className="text-xs text-gray-400 border border-gray-100 bg-gray-50 px-2 py-1 rounded">⌘K</span>
                    </div>
                </motion.div>
            </section>

            {/* Categories */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Browse by Category</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                            <div className="h-full p-6 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm hover:translate-y-[-2px] transition-all cursor-default">
                                <div className="mb-4 bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center">
                                    {cat.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                                <p className="text-sm text-gray-500">{cat.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Popular Articles */}
            <section className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Star className="w-4 h-4 text-gray-400" /> Popular Articles
                    </h2>
                    <div className="grid gap-4">
                        {popularArticles.map((article, i) => (
                            <Link
                                key={article.id}
                                href={`/help/${article.slug}`}
                                className="group block"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 + (i * 0.1) }}
                                    className="p-5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-start gap-4"
                                >
                                    <span className="text-3xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
                                        {article.icon}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {article.description}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all self-center" />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Support Card */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-gray-900 text-white rounded-2xl p-8 relative overflow-hidden h-full flex flex-col justify-center text-center"
                    >
                        <div className="absolute top-0 right-0 p-12 bg-blue-500 rounded-full blur-[60px] opacity-20" />
                        <div className="absolute bottom-0 left-0 p-12 bg-purple-500 rounded-full blur-[60px] opacity-20" />

                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Still stuck?</h3>
                                <p className="text-gray-300 text-sm">
                                    Our team is here to help you get the most out of Pixel.
                                </p>
                            </div>
                            <Link
                                href="/dashboard"
                                className="inline-block w-full py-3 px-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

