"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface InterimRedirectProps {
    originalUrl: string;
    message?: string;
    delay?: number; // seconds
}
//
export function InterimRedirect({ originalUrl, message, delay = 5 }: InterimRedirectProps) {
    const [seconds, setSeconds] = useState(delay);

    useEffect(() => {
        if (seconds <= 0) {
            window.location.href = originalUrl;
            return;
        }

        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds, originalUrl]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center space-y-6 border border-gray-100">

                {/* Greeting / Message Section */}
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {message || "Welcome! You are being redirected..."}
                    </h2>
                    <p className="text-gray-500">
                        Please wait while we take you to your destination.
                    </p>
                </div>

                {/* Countdown Loader */}
                <div className="relative pt-4">
                    <div className="flex items-center justify-center mb-2">
                        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            {seconds}
                        </span>
                        <span className="text-gray-400 ml-2 mt-2">seconds</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${(seconds / delay) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Continue Button */}
                <div className="mt-8">
                    <Button
                        onClick={() => window.location.href = originalUrl}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                    >
                        Continue Immediately
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">
                        Destination: <span className="font-mono text-gray-500 truncate inline-block max-w-[200px] align-bottom">{originalUrl}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
