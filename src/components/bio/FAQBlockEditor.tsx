"use client";
import { BioLink } from "@/lib/db";
import { Trash2, PlusCircle, HelpCircle } from "lucide-react";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface FAQBlockEditorProps {
    link: BioLink;
    updateLink: (id: string, data: Partial<BioLink>) => void;
}

export default function FAQBlockEditor({ link, updateLink }: FAQBlockEditorProps) {
    const items: FAQItem[] = link.settings?.faqItems || [];

    const updateItem = (idx: number, field: 'question' | 'answer', value: string) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        updateLink(link.id, { settings: { ...link.settings, faqItems: newItems } });
    };

    const addItem = () => {
        const newItems = [...items, { id: `faq${Date.now()}`, question: "", answer: "" }];
        updateLink(link.id, { settings: { ...link.settings, faqItems: newItems } });
    };

    const removeItem = (idx: number) => {
        const newItems = items.filter((_, i) => i !== idx);
        updateLink(link.id, { settings: { ...link.settings, faqItems: newItems } });
    };

    return (
        <div className="mt-3 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> FAQ Items
                </div>
                <div className="text-[10px] font-medium text-gray-400">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                </div>
            </div>

            {items.map((item, idx) => (
                <div key={item.id || idx} className="space-y-1.5 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start gap-2">
                        <div className="w-5 flex justify-center text-[10px] font-bold text-gray-400 pt-2">Q{idx + 1}</div>
                        <input
                            value={item.question}
                            onChange={(e) => updateItem(idx, 'question', e.target.value)}
                            className="flex-1 text-xs border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded p-1.5 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-semibold"
                            placeholder="Enter question..."
                        />
                        <button
                            onClick={() => removeItem(idx)}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="w-5 flex justify-center text-[10px] font-bold text-blue-400 pt-2">A</div>
                        <textarea
                            value={item.answer}
                            onChange={(e) => updateItem(idx, 'answer', e.target.value)}
                            className="flex-1 text-xs border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded p-1.5 focus:ring-1 focus:ring-blue-500 outline-none transition-all min-h-[60px] resize-none"
                            placeholder="Enter answer..."
                        />
                        <div className="w-6" /> {/* Spacer to align with delete button */}
                    </div>
                </div>
            ))}

            <button
                onClick={addItem}
                className="text-[10px] text-blue-500 font-bold flex items-center gap-1 hover:underline mt-1 opacity-80 hover:opacity-100"
            >
                <PlusCircle className="w-3 h-3" /> Add Question
            </button>
        </div>
    );
}
