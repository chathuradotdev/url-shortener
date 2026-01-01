"use client";

import Link from "next/link";
import { categories, knowledgeBase } from "@/data/knowledgebase";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Book, Menu, Command, X } from "lucide-react";
import { KnowledgeBaseSearch } from "@/components/KnowledgeBaseSearch";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu on navigate
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Handle Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setSearchOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const SidebarContent = () => (
        <div className="py-6 space-y-8 min-h-full flex flex-col">
            <div className="px-4 mb-6">
                <Link href="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors group">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <div
                    onClick={() => {
                        setSearchOpen(true);
                        setMobileMenuOpen(false);
                    }}
                    className="relative cursor-pointer group"
                >
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <div className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 h-10 text-sm flex items-center text-gray-400 hover:border-blue-300 hover:shadow-sm transition-all">
                        <span>Search...</span>
                        <div className="ml-auto flex items-center gap-1">
                            <span className="text-xs bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">⌘K</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-3 flex-1 overflow-y-auto">
                {categories.map((category) => (
                    <div key={category} className="mb-8">
                        <h3 className="mb-3 px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                            {category}
                        </h3>
                        <div className="space-y-0.5">
                            {knowledgeBase
                                .filter((article) => article.category === category)
                                .map((article) => {
                                    const isActive = pathname === `/help/${article.slug}`;
                                    return (
                                        <Link
                                            key={article.id}
                                            href={`/help/${article.slug}`}
                                            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isActive
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                        >
                                            <span className="text-base leading-none">{article.icon}</span>
                                            <span className="truncate">{article.title}</span>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-4 pt-4 mt-auto pb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Need human help?</h4>
                    <p className="text-xs text-blue-700 mb-3 leading-relaxed">
                        Our support team is 24/7 ready to assist you.
                    </p>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm" asChild>
                        <Link href="mailto:support@pixel.io">Contact Support</Link>
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 flex font-sans text-gray-900">
            <KnowledgeBaseSearch open={searchOpen} onOpenChange={setSearchOpen} />

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 bg-gray-50/80 backdrop-blur-xl border-r border-gray-200 h-screen sticky top-0 overflow-hidden flex flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-14 flex items-center justify-between">
                <Link href="/help" className="font-semibold text-gray-900 flex items-center gap-2">
                    <Book className="w-5 h-5 text-blue-600" />
                    <span>Help Center</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                        <Search className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Drawer (Custom Framer Motion) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-80 bg-white z-50 md:hidden shadow-xl border-r border-gray-100 flex flex-col"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <span className="font-semibold text-lg">Menu</span>
                                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <SidebarContent />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 min-w-0 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto bg-white min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4rem)] md:rounded-2xl md:shadow-sm md:border md:border-gray-200 px-6 py-8 md:p-12 mt-14 md:mt-0 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
