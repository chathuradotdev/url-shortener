"use client";
import { useState, useEffect } from "react";
import { BioLink } from "@/lib/db";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

interface PollWidgetProps {
    link: BioLink;
    theme: any;
}

export default function PollWidget({ link, theme }: PollWidgetProps) {
    const [hasVoted, setHasVoted] = useState(false);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [totalVotes, setTotalVotes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const options = link.settings?.options || [];
    const question = link.title;

    // Use theme colors
    const textColor = theme.textColor || '#000000';
    const buttonBgColor = theme.buttonBgColor || '#f3f4f6';
    const buttonTextColor = theme.buttonTextColor || '#1f2937';

    useEffect(() => {
        // Check local storage
        if (typeof window !== 'undefined') {
            const storedVote = localStorage.getItem(`poll_${link.id}`);
            if (storedVote) {
                setHasVoted(true);
                setSelectedOption(storedVote);
                fetchResults();
            }
        }
    }, [link.id]);

    const fetchResults = async () => {
        try {
            const res = await fetch(`/api/bio/vote?linkId=${link.id}`);
            const data = await res.json();
            if (data.counts) {
                setCounts(data.counts);
                const total = Object.values(data.counts).reduce((a: any, b: any) => a + b, 0) as number;
                setTotalVotes(total);
            }
        } catch (e) { console.error(e); }
    };

    const handleVote = async (optionId: string) => {
        setLoading(true);
        setSelectedOption(optionId);
        try {
            const res = await fetch('/api/bio/vote', {
                method: 'POST',
                body: JSON.stringify({ linkId: link.id, optionId })
            });

            if (res.ok || res.status === 409) {
                localStorage.setItem(`poll_${link.id}`, optionId);
                setHasVoted(true);
                await fetchResults();
            }
        } finally {
            setLoading(false);
        }
    };

    if (options.length === 0) return null;

    return (
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5">
            <h3 className="text-center font-bold text-lg mb-4 leading-tight" style={{ color: textColor }}>{question}</h3>

            <div className="space-y-3">
                {options.map((opt: any) => {
                    const count = counts[opt.id] || 0;
                    const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                    const isSelected = selectedOption === opt.id;

                    return (
                        <div key={opt.id} className="relative w-full h-12">
                            {hasVoted ? (
                                // Result Bar
                                <div className="absolute inset-0 w-full h-full bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className={`h-full ${isSelected ? 'bg-blue-500/40' : 'bg-gray-400/20'}`}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-between px-4">
                                        <span className="font-bold text-sm z-10 flex items-center gap-2" style={{ color: textColor }}>
                                            {opt.text}
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                        </span>
                                        <span className="font-bold text-sm z-10 opacity-70" style={{ color: textColor }}>{percent}%</span>
                                    </div>
                                </div>
                            ) : (
                                // Vote Button
                                <button
                                    onClick={() => handleVote(opt.id)}
                                    disabled={loading}
                                    className="w-full h-full rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center relative overflow-hidden group shadow-sm"
                                    style={{
                                        backgroundColor: buttonBgColor,
                                        color: buttonTextColor,
                                    }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {loading && selectedOption === opt.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {opt.text}
                                    </span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            {hasVoted && (
                <div className="text-center mt-3 text-[10px] opacity-50 font-medium uppercase tracking-widest" style={{ color: textColor }}>
                    {totalVotes} Votes
                </div>
            )}
        </div>
    );
}
