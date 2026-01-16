"use client";

import { useEffect, useState } from "react";
import { Timer, Clock } from "lucide-react";

interface CountdownWidgetProps {
    targetDate: string;
    title?: string;
    theme?: any;
}

export default function CountdownWidget({ targetDate, title, theme }: CountdownWidgetProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
                setIsExpired(false);
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsExpired(true);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return null; // Prevent hydration mismatch or flash

    const buttonBgColor = theme?.buttonBgColor || '#f3f4f6';
    const buttonTextColor = theme?.buttonTextColor || '#1f2937';
    const glassEffect = theme?.glassEffect || false;

    // Helper to pad numbers
    const pad = (num: number) => num.toString().padStart(2, '0');

    return (
        <div
            className={`w-full p-6 rounded-2xl flex flex-col items-center gap-4 shadow-lg ${glassEffect ? 'backdrop-blur-xl border border-white/20' : ''}`}
            style={{
                backgroundColor: glassEffect ? 'rgba(255, 255, 255, 0.1)' : buttonBgColor,
                color: glassEffect ? '#ffffff' : buttonTextColor
            }}
        >
            {title && (
                <div className="flex items-center gap-2 opacity-80">
                    <Clock className="w-4 h-4" />
                    <h4 className="font-black text-xs uppercase tracking-wider">{title}</h4>
                </div>
            )}

            <div className="grid grid-cols-4 gap-2 w-full max-w-[320px]">
                <TimeBox value={timeLeft.days} label="DAYS" color={buttonTextColor} glass={glassEffect} />
                <TimeBox value={timeLeft.hours} label="HRS" color={buttonTextColor} glass={glassEffect} />
                <TimeBox value={timeLeft.minutes} label="MIN" color={buttonTextColor} glass={glassEffect} />
                <TimeBox value={timeLeft.seconds} label="SEC" color={buttonTextColor} glass={glassEffect} />
            </div>

            {isExpired && (
                <div className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full animate-pulse">
                    Event Started
                </div>
            )}
        </div>
    );
}

function TimeBox({ value, label, color, glass }: { value: number; label: string; color: string; glass: boolean }) {
    return (
        <div className="flex flex-col items-center p-2 rounded-xl bg-black/5 dark:bg-white/5 relative overflow-hidden group">
            <span className="text-2xl font-black font-mono leading-none z-10">{value}</span>
            <span className="text-[9px] font-bold opacity-50 z-10 mt-1">{label}</span>
        </div>
    );
}
