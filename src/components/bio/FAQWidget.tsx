"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQWidgetProps {
    link: {
        id: string;
        title?: string;
        settings?: {
            faqItems?: FAQItem[];
        };
    };
    theme?: {
        buttonBgColor?: string;
        buttonTextColor?: string;
        glassEffect?: boolean;
    };
}

export default function FAQWidget({ link, theme }: FAQWidgetProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Get FAQ items from settings
    const faqItems: FAQItem[] = link.settings?.faqItems || [];

    if (faqItems.length === 0) {
        return null;
    }

    const bgColor = theme?.buttonBgColor || '#ffffff';
    const textColor = theme?.buttonTextColor || '#000000';
    const glassEffect = theme?.glassEffect || false;

    return (
        <div className="w-full space-y-2">
            {link.title && (
                <h3
                    className="text-sm font-bold mb-3 px-1"
                    style={{ color: textColor }}
                >
                    {link.title}
                </h3>
            )}

            {faqItems.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                    <div
                        key={index}
                        className={`rounded-xl overflow-hidden transition-all ${glassEffect
                            ? 'backdrop-blur-xl border border-white/20'
                            : 'border border-gray-200 dark:border-gray-700'
                            }`}
                        style={{
                            backgroundColor: glassEffect ? 'rgba(255, 255, 255, 0.1)' : bgColor,
                        }}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left transition-colors hover:opacity-80"
                            style={{ color: glassEffect ? '#ffffff' : textColor }}
                        >
                            <span className="text-sm font-semibold pr-4">{item.question}</span>
                            <ChevronDown
                                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div
                                className="px-4 pb-4 text-xs leading-relaxed opacity-80"
                                style={{ color: glassEffect ? '#ffffff' : textColor }}
                            >
                                {item.answer}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
