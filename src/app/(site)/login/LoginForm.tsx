"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TESTIMONIALS = [
    {
        initials: "MK",
        color: "from-orange-400 to-red-500",
        quote: (<span>"Finally, a link shortener that actually looks good. The <span className="font-semibold text-orange-500">custom bio pages</span> are incredibly easy to set up."</span>),
        name: "Sarah Jenkins",
        role: "Social Media Manager"
    },
    {
        initials: "AS",
        color: "from-indigo-400 to-purple-600",
        quote: (<span>"LinkJet has completely streamlined my workflow. The <span className="italic text-indigo-500">API integration</span> is seamless and robust."</span>),
        name: "Anish Singh",
        role: "Software Engineer"
    },
    {
        initials: "RY",
        color: "from-blue-400 to-blue-600",
        quote: (<span>"Since switching to <span className="font-semibold text-blue-600 dark:text-blue-400">LinkJet</span>, my click-through rates have exploded. The analytics are unmatched."</span>),
        name: "Ryan Yates",
        role: "Executive Chef / Web Publisher"
    },
    {
        initials: "AB",
        color: "from-purple-400 to-pink-600",
        quote: (<span>"I can confidently say this platform is going to be <span className="underline decoration-yellow-400 decoration-2 underline-offset-2">huge</span>. It's the perfect match for my workflow."</span>),
        name: "Angie Brown",
        role: "Content Creator"
    },
    {
        initials: "AW",
        color: "from-emerald-400 to-teal-600",
        quote: (<span>"The <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-1 rounded">Smart Targeting</span> feature is a game changer. I've grown my account from zero to 100k impressions in just 90 days."</span>),
        name: "Alex Walsh",
        role: "Digital Marketer"
    }
];

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [visibleTestimonials, setVisibleTestimonials] = useState([0, 1, 2]);
    const [fadeKey, setFadeKey] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeKey(prev => prev + 1);
            setVisibleTestimonials(prevIndices => {
                // Rotate testimonials: take the last one out, add a new one in
                return prevIndices.map(i => (i + 1) % TESTIMONIALS.length);
            });
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid email or password");
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row bg-white dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
            {/* Left Side - Login Form */}
            <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white dark:bg-gray-900">
                <div className="max-w-md w-full mx-auto space-y-8 -mt-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Welcome back
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your credentials to access your account.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                setGoogleLoading(true);
                                signIn("google", { callbackUrl: "/dashboard" });
                            }}
                            disabled={googleLoading || loading}
                            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-100 dark:hover:border-blue-900/50 hover:bg-blue-50/50 dark:hover:bg-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all duration-200 group"
                        >
                            {googleLoading ? (
                                <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wide">
                            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 font-medium">Or with email</span>
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border-2 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all font-medium text-sm"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border-2 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all font-medium text-sm"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="flex justify-end mt-1">
                                    <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-500 font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:shadow-none translate-y-0 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Testimonials Showcase */}
            <div className="hidden md:flex flex-1 relative bg-white dark:bg-gray-900 flex-col justify-center items-center p-8 lg:p-12 overflow-hidden">
                <div className="w-full max-w-2xl space-y-8 relative z-10 transition-all duration-700 -mt-32">
                    {visibleTestimonials.map((index, i) => {
                        const t = TESTIMONIALS[index];
                        return (
                            <div key={`${t.initials}-${fadeKey}`} className={`flex items-start space-x-4 animate-in fade-in slide-in-from-right-8 duration-700`} style={{ animationDelay: `${i * 200}ms`, marginLeft: i === 1 ? '3rem' : '0' }}>
                                <div className="flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                        {t.initials}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl rounded-tl-none shadow-xl border border-gray-100 dark:border-gray-700 relative hover:scale-[1.02] transition-transform duration-300">
                                        {/* Speech Bubble Tail */}
                                        <div className="absolute top-0 -left-[10px] w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-100 dark:border-gray-700 transform -skew-x-[20deg]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>

                                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                            {t.quote}
                                        </p>

                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                                        </div>
                                    </div>
                                    {/* Floating Decorative Element (Only for first one to avoid clutter) */}
                                    {i === 0 && <div className="absolute -right-4 -top-4 w-8 h-8 bg-yellow-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
