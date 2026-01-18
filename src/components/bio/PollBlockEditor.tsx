"use client";
import { useEffect, useState } from "react";
import { BioLink } from "@/lib/db";
import { Trash2, PlusCircle, BarChart3 } from "lucide-react";

interface PollBlockEditorProps {
    link: BioLink;
    updateLink: (id: string, data: Partial<BioLink>) => void;
}

export default function PollBlockEditor({ link, updateLink }: PollBlockEditorProps) {
    const [counts, setCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        // Fetch current vote counts
        fetch(`/api/bio/vote?linkId=${link.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.counts) setCounts(data.counts);
            })
            .catch(err => console.error("Failed to load poll stats", err));
    }, [link.id]);

    const options = link.settings?.options || [];
    const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="mt-3 space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase font-bold text-gray-400">Poll Options</div>
                {totalVotes > 0 && (
                    <div className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" /> {totalVotes} Votes
                    </div>
                )}
            </div>

            {options.map((opt: any, idx: number) => {
                const voteCount = counts[opt.id] || 0;
                const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

                return (
                    <div key={idx} className="flex items-center gap-2">
                        <div className="w-5 flex justify-center text-[10px] font-bold text-gray-400">{idx + 1}</div>
                        <div className="flex-1 flex items-center gap-2">
                            <input
                                value={opt.text}
                                onChange={e => {
                                    const newOpts = [...options];
                                    newOpts[idx].text = e.target.value;
                                    updateLink(link.id, { settings: { ...link.settings, options: newOpts } });
                                }}
                                className="flex-1 text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded p-1.5 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder={`Option ${idx + 1}`}
                            />
                            {totalVotes > 0 && (
                                <div className="text-[10px] min-w-[40px] text-right font-medium text-gray-500" title={`${voteCount} votes`}>
                                    {percent}%
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                const newOpts = options.filter((_: any, i: number) => i !== idx);
                                updateLink(link.id, { settings: { ...link.settings, options: newOpts } });
                            }}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                );
            })}
            <button
                onClick={() => {
                    const newOpts = [...options, { id: `opt${Date.now()}`, text: "" }];
                    updateLink(link.id, { settings: { ...link.settings, options: newOpts } });
                }}
                className="text-[10px] text-blue-500 font-bold flex items-center gap-1 hover:underline mt-1 ml-7 opacity-80 hover:opacity-100"
            >
                <PlusCircle className="w-3 h-3" /> Add Option
            </button>
        </div>
    );
}
