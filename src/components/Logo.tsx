import React from "react";

export const Logo = ({ className = "", showText = true }: { className?: string, showText?: boolean }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
            >
                <defs>
                    <linearGradient id="linkjet-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#2563EB" /> {/* Blue-600 */}
                        <stop offset="100%" stopColor="#4F46E5" /> {/* Indigo-600 */}
                    </linearGradient>
                    <filter id="glow" x="-4" y="-4" width="40" height="40" filterUnits="userSpaceOnUse">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Paper Plane / Jet Shape */}
                <path
                    d="M4 16L28 4L16 28L13 19L4 16Z"
                    fill="url(#linkjet-gradient)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    className="drop-shadow-sm"
                />

                {/* Motion Line / Trail */}
                <path
                    d="M13 19L27 5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="opacity-50"
                />
            </svg>

            {showText && (
                <span className="font-bold text-xl tracking-tight">
                    <span className="text-gray-900 dark:text-white">Link</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Jet
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 font-normal">.co</span>
                </span>
            )}
        </div>
    );
};
