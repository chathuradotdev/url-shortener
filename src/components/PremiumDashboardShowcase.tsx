"use client";

import { motion } from "framer-motion";
import { Upload, BarChart3, PieChart, FileSpreadsheet, Zap, ArrowUpRight, Download, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PremiumDashboardShowcase() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-950 text-sm font-bold mb-4 shadow-sm">
                        <Zap className="w-4 h-4 mr-2 fill-yellow-950" />
                        Premium Power
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
                        Command Center for Power Users
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Scale your operations with bulk management and gain actionable insights with granular analytics.
                    </p>
                </div>

                <div className="relative">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-50 -z-10 rounded-full"></div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">

                        {/* Main Dashboard Mockup (Center/Left) */}
                        <div className="lg:col-span-12 xl:col-span-8 relative group">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                            >
                                {/* Dashboard Header */}
                                <div className="border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900">
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                            <div className="w-3 h-3 rounded-full bg-green-400" />
                                        </div>
                                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                                        <span className="text-xs font-medium text-gray-500">Analytics Overview</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs text-gray-500 flex items-center">
                                            Last 30 Days <ArrowUpRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Dashboard Content */}
                                <div className="p-6 grid gap-6">
                                    {/* Stats Row */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: "Total Clicks", val: "124.5k", change: "+12%", color: "text-blue-500" },
                                            { label: "Active Links", val: "1,892", change: "+4%", color: "text-purple-500" },
                                            { label: "Avg. Engagement", val: "2.4s", change: "+8%", color: "text-green-500" }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                                <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.val}</div>
                                                <div className={cn("text-xs font-medium inline-flex items-center", stat.color)}>
                                                    <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.change}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chart Area */}
                                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 h-64 flex items-end gap-2 relative overflow-hidden group-hover:bg-gray-50/30 transition-colors">
                                        <div className="absolute inset-x-0 bottom-0 h-px bg-gray-100 dark:bg-gray-800" />
                                        {/* Fake bars */}
                                        {[40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 85, 95, 60, 70, 50, 65, 80, 90, 75, 60].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                whileInView={{ height: `${h}%` }}
                                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                                className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 opacity-60 hover:opacity-100 transition-opacity rounded-t-sm"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Bulk Upload Card (Overlapping) */}
                            <motion.div
                                initial={{ x: 20, y: 20, opacity: 0 }}
                                whileInView={{ x: 0, y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="absolute -right-4 -bottom-8 md:-right-12 md:bottom-12 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-5 z-20"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                                            <FileSpreadsheet className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Bulk Upload</h4>
                                            <p className="text-xs text-gray-500">Processing marketing_campaign.csv</p>
                                        </div>
                                    </div>
                                    <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <span>Progress</span>
                                            <span>84%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "84%" }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-green-500 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="h-8 flex-1 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                                        <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center text-white">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Feature Highlights (Right/Bottom Side) */}
                        <div className="lg:col-span-12 xl:col-span-4 space-y-6 pt-8 xl:pt-0">
                            {[
                                {
                                    icon: Upload,
                                    color: "bg-blue-100 text-blue-600",
                                    title: "Bulk Creation",
                                    desc: "Upload CSV files to create thousands of branded links in seconds. Auto-tagging included."
                                },
                                {
                                    icon: BarChart3,
                                    color: "bg-purple-100 text-purple-600",
                                    title: "Deep Analytics",
                                    desc: "Track geolocation, device types, referrers, and peak traffic times in real-time."
                                },
                                {
                                    icon: Download,
                                    color: "bg-orange-100 text-orange-600",
                                    title: "Data Export",
                                    desc: "Export your data to CSV or PDF for reports and further analysis."
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: 20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className={cn("p-3 rounded-lg shrink-0", feature.color)}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{feature.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
