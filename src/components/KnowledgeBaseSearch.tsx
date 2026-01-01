"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Article, knowledgeBase } from "@/data/knowledgebase";
import { Search, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeBaseSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function KnowledgeBaseSearch({ open, onOpenChange }: KnowledgeBaseSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Article[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = knowledgeBase.filter(article => {
            return (
                article.title.toLowerCase().includes(lowerQuery) ||
                article.description.toLowerCase().includes(lowerQuery) ||
                article.content.toLowerCase().includes(lowerQuery) ||
                article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
            );
        });
        setResults(filtered.slice(0, 5));
    }, [query]);

    const handleSelect = (slug: string) => {
        onOpenChange(false);
        router.push(`/help/${slug}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 overflow-hidden max-w-2xl bg-white shadow-2xl rounded-xl border border-gray-100 gap-0">
                <div className="flex items-center px-4 py-4 border-b border-gray-100">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        className="flex-1 text-lg outline-none placeholder:text-gray-400 text-gray-900 bg-transparent"
                        placeholder="Search for articles, guides..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                        ESC
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2 bg-gray-50/50">
                    <AnimatePresence>
                        {query && results.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-12 text-center text-gray-500"
                            >
                                <p>No results found for "{query}"</p>
                            </motion.div>
                        )}

                        {!query && (
                            <div className="py-4 px-4">
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Suggested Articles
                                </h4>
                                <div className="grid gap-2">
                                    {knowledgeBase.slice(0, 3).map(article => (
                                        <div
                                            key={article.id}
                                            onClick={() => handleSelect(article.slug)}
                                            className="group flex items-center p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 cursor-pointer transition-all"
                                        >
                                            <span className="text-2xl mr-4">{article.icon}</span>
                                            <div>
                                                <h5 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{article.title}</h5>
                                                <p className="text-xs text-gray-500">{article.category}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {results.length > 0 && (
                            <div className="py-2">
                                {results.map((article) => (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => handleSelect(article.slug)}
                                        className="group flex items-start p-3 mx-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                    >
                                        <div className="mt-1 mr-3 min-w-[24px]">
                                            <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-900 group-hover:text-blue-700">
                                                {article.title}
                                            </h5>
                                            <p className="text-sm text-gray-500 line-clamp-1">
                                                {article.description}
                                            </p>
                                            {article.tags && (
                                                <div className="flex gap-2 mt-1.5">
                                                    {article.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 ml-4 whitespace-nowrap self-center">
                                            Enter ↵
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                    <span>Use arrow keys to navigate</span>
                    <span>Knowledge Base</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
