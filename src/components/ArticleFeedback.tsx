"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ArticleFeedback() {
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    const handleFeedback = (type: 'up' | 'down') => {
        // Here we would send analytics
        setStatus('success');
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="text-center sm:text-left">
                <h4 className="font-semibold text-gray-900">Was this article helpful?</h4>
                <p className="text-sm text-gray-500">Your feedback helps us improve.</p>
            </div>

            <div className="h-10 min-w-[140px] flex items-center justify-end">
                <AnimatePresence mode="wait">
                    {status === 'idle' ? (
                        <motion.div
                            key="buttons"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex gap-2"
                        >
                            <button
                                onClick={() => handleFeedback('up')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all text-sm font-medium text-gray-700 shadow-sm"
                            >
                                <ThumbsUp className="w-4 h-4" />
                                Yes
                            </button>
                            <button
                                onClick={() => handleFeedback('down')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all text-sm font-medium text-gray-700 shadow-sm"
                            >
                                <ThumbsDown className="w-4 h-4" />
                                No
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 text-green-600 font-medium"
                        >
                            <CheckCircle className="w-5 h-5" />
                            <span>Thanks for voting!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
