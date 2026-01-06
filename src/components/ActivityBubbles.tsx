"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const activities = [
    { text: "+1 Link Shortened", icon: "🚀", color: "text-blue-500" },
    { text: "New User Joined", icon: "👋", color: "text-purple-500" },
    { text: "+1 Link Shortened", icon: "🔗", color: "text-blue-500" },
    { text: "New Bio Page", icon: "✨", color: "text-pink-500" },
    { text: "Smart Target Set", icon: "🎯", color: "text-orange-500" },
    { text: "+1 Link Shortened", icon: "🚀", color: "text-blue-500" },
];

interface Bubble {
    id: number;
    text: string;
    icon: string;
    color: string;
    x: number;
    y: number;
}

export default function ActivityBubbles() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            // 50% chance to do nothing to keep it not too busy
            if (Math.random() > 0.5) return;

            setBubbles(current => {
                // Max 2 bubbles
                if (current.length >= 2) {
                    // Remove oldest
                    return current.slice(1);
                }

                // Add new bubble
                const randomActivity = activities[Math.floor(Math.random() * activities.length)];

                // Random position roughly around the center/hero area but spread out
                // We'll use viewport percentages for random positioning relative to a container
                // Restricting to "random" but usable areas
                const x = Math.random() * 80 - 40; // -40% to 40% horizontal
                const y = Math.random() * 60 - 30; // -30% to 30% vertical

                return [...current, {
                    id: Date.now(),
                    ...randomActivity,
                    x,
                    y
                }];
            });
        }, 2000); // Check every 2 seconds

        return () => clearInterval(interval);
    }, []);

    // Cleanup old bubbles automatically
    useEffect(() => {
        if (bubbles.length > 0) {
            const timer = setTimeout(() => {
                setBubbles(prev => prev.slice(1));
            }, 4000); // Disappear after 4 seconds
            return () => clearTimeout(timer);
        }
    }, [bubbles]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Container covers whole hero section usually */}
            <AnimatePresence>
                {bubbles.map((bubble) => (
                    <motion.div
                        key={bubble.id}
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            x: bubble.x * 5, // slight random offset movement
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{
                            position: "absolute",
                            left: `calc(50% + ${bubble.x}%)`,
                            top: `calc(40% + ${bubble.y}%)`,
                        }}
                        className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-700"
                    >
                        <span className="text-xl">{bubble.icon}</span>
                        <span className={`text-sm font-bold ${bubble.color}`}>{bubble.text}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
