"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
    text: string;
    className?: string;
    cursorClassName?: string;
}

export default function TypewriterText({ text, className, cursorClassName }: TypewriterTextProps) {
    const [displayText, setDisplayText] = useState("");
    // 0: Typing 1st time
    // 1: Deleting 1st time
    // 2: Typing 2nd time
    // 3: Finished
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (phase === 3) return; // Done

        const typeSpeed = 100; // ms per char
        const deleteSpeed = 50; // ms per char
        const pauseTime = 2000; // time to wait before deleting

        if (phase === 0) {
            // Typing 1st pass
            if (displayText.length < text.length) {
                timeout = setTimeout(() => {
                    setDisplayText(text.slice(0, displayText.length + 1));
                }, typeSpeed);
            } else {
                // Determine next phase: wait then delete
                timeout = setTimeout(() => setPhase(1), pauseTime);
            }
        } else if (phase === 1) {
            // Deleting 1st pass
            if (displayText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(text.slice(0, displayText.length - 1));
                }, deleteSpeed);
            } else {
                // Done deleting, start 2nd pass
                setPhase(2);
            }
        } else if (phase === 2) {
            // Typing 2nd pass
            if (displayText.length < text.length) {
                timeout = setTimeout(() => {
                    setDisplayText(text.slice(0, displayText.length + 1));
                }, typeSpeed);
            } else {
                // Done typing 2nd pass, finish
                setPhase(3);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayText, phase, text]);

    return (
        <span className={cn("inline-flex items-center", className)}>
            <span>{displayText}</span>
            <span
                className={cn(
                    "ml-[1px] w-[3px] h-[1em] bg-blue-600 animate-pulse",
                    cursorClassName
                )}
            />
        </span>
    );
}
