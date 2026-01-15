"use client";

import { useState, useEffect, ReactNode } from "react";
import { BioPage, BioLink } from "@/lib/db";
import BioPreview from "./BioPreview";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    LayoutTemplate, Palette, Share2, PlusCircle, Instagram, Twitter,
    Globe, Github, Youtube, Music, Link as LinkIcon, Type, X,
    ChevronRight, CheckCircle2, ChevronDown, ChevronUp, GripVertical,
    Smartphone, Monitor, Save, RotateCcw, Copy, BarChart3, TrendingUp, MousePointerClick,
    Linkedin, Facebook, Mail, Upload
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Reorder } from "framer-motion";

function TwitterIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
    );
}

const PLATFORMS = [
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4" />, placeholder: '@username' },
    { id: 'twitter', name: 'Twitter (X)', icon: <TwitterIcon />, placeholder: '@username' },
    { id: 'github', name: 'GitHub', icon: <Github className="w-4 h-4" />, placeholder: 'username' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4" />, placeholder: 'Channel URL' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, placeholder: 'Profile URL' },
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4" />, placeholder: 'Profile URL' },
    { id: 'email', name: 'Email', icon: <Mail className="w-4 h-4" />, placeholder: 'your@email.com' },
    { id: 'website', name: 'Website', icon: <Globe className="w-4 h-4" />, placeholder: 'https://...' },
    { id: 'tiktok', name: 'TikTok', icon: <Music className="w-4 h-4" />, placeholder: '@username' },
];

const FONTS = [
    { id: 'Inter', name: 'Inter (Modern)' },
    { id: 'Outfit', name: 'Outfit (Premium)' },
    { id: 'Roboto', name: 'Roboto (Classic)' },
    { id: 'Playfair Display', name: 'Playfair (Serif)' },
    { id: 'Montserrat', name: 'Montserrat (Bold)' },
    { id: 'Space Grotesk', name: 'Space (Tech)' },
    { id: 'Courier Prime', name: 'Courier (Mono)' },
];

const LINK_ANIMATIONS = [
    { id: 'none', name: 'No Animation' },
    { id: 'pulse', name: 'Pulse (Subtle)' },
    { id: 'shake', name: 'Shake (Alert)' },
    { id: 'bounce', name: 'Bounce (Playful)' },
    { id: 'glow', name: 'Glow (Highlight)' },
    { id: 'blink', name: 'Blink (Urgent)' },
];

export default function BioBuilder() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Core Data
    const [baseUrl, setBaseUrl] = useState("");
    const [bioPage, setBioPage] = useState<Partial<BioPage>>({
        title: "",
        description: "",
        theme: {
            backgroundColor: "#ffffff",
            textColor: "#4a4a4a",
            buttonBgColor: "#5b5050",
            buttonTextColor: "#ffffff",
            buttonStyle: "rounded-none",
            fontFamily: "Inter",
            shadowType: 'solid',
            profileShadow: 0,
            profileBorder: 0,
            socialSize: 28
        }
    });

    const [links, setLinks] = useState<BioLink[]>([]);

    // UI State
    const [activeSection, setActiveSection] = useState<'templates' | 'page' | 'header' | 'socials' | 'blocks'>('templates');
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [mode, setMode] = useState<'editor' | 'analytics'>('editor');
    const [saving, setSaving] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showReplaceDialog, setShowReplaceDialog] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [showPlatformSelector, setShowPlatformSelector] = useState(false);

    const TEMPLATES = [
        {
            id: 'minimal',
            name: 'Minimal',
            color: '#ffffff',
            theme: {
                backgroundColor: "#ffffff",
                textColor: "#000000",
                buttonBgColor: "#f3f4f6",
                buttonTextColor: "#1f2937",
                buttonStyle: "rounded-full",
                shadowType: 'soft',
                profileShadow: 0,
                profileBorder: 0,
                socialSize: 24,
                cardMode: false
            }
        },
        {
            id: 'academy',
            name: 'Academy',
            color: '#eff6ff',
            theme: {
                backgroundColor: "#eff6ff",
                textColor: "#1e3a8a",
                buttonBgColor: "#2563eb",
                buttonTextColor: "#ffffff",
                buttonStyle: "rounded-lg",
                shadowType: 'soft',
                profileShadow: 8,
                profileBorder: 4,
                socialSize: 24
            }
        },
        {
            id: 'professional',
            name: 'Professional',
            color: '#fff1f2',
            theme: {
                backgroundColor: '#fff1f2',
                textColor: '#881337',
                buttonBgColor: '#9f1239',
                buttonTextColor: "#ffffff",
                buttonStyle: "rounded-none",
                shadowType: 'solid',
                profileShadow: 8,
                profileBorder: 0,
                socialSize: 22,
                cardMode: true
            }
        },
        {
            id: 'boutique',
            name: 'Boutique',
            color: '#fafaf9',
            theme: {
                backgroundColor: "#fafaf9",
                textColor: "#44403c",
                buttonBgColor: "#57534e",
                buttonTextColor: "#ffffff",
                buttonStyle: "rounded-none",
                shadowType: 'soft',
                profileShadow: 0,
                profileBorder: 1,
                socialSize: 20
            }
        },
        {
            id: 'creator',
            name: 'Creator',
            color: '#0f172a',
            theme: {
                backgroundColor: "#0f172a",
                textColor: "#f8fafc",
                buttonBgColor: "#1e293b",
                buttonTextColor: "#38bdf8",
                buttonStyle: "rounded-2xl",
                shadowType: 'soft',
                profileShadow: 15,
                profileBorder: 0,
                socialSize: 26
            }
        },
        {
            id: 'forest',
            name: 'Forest',
            color: '#f0fdf4',
            theme: {
                backgroundColor: "#f0fdf4",
                textColor: "#14532d",
                buttonBgColor: "#15803d",
                buttonTextColor: "#ffffff",
                buttonStyle: "rounded-full",
                shadowType: 'soft',
                profileShadow: 5,
                profileBorder: 2,
                socialSize: 24
            }
        }
    ];

    // --- Data Fetching ---

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.origin);
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const bioRes = await fetch("/api/bio");
            if (bioRes.status === 403) {
                toast.error("Premium required");
                router.push("/dashboard");
                return;
            }

            const bioData = await bioRes.json();
            if (bioData.id) {
                const safeTheme = {
                    backgroundColor: "#ffffff",
                    textColor: "#000000",
                    buttonBgColor: "#f3f4f6",
                    buttonTextColor: "#1f2937",
                    shadowType: 'soft',
                    profileShadow: 0,
                    profileBorder: 0,
                    socialSize: 24,
                    ...(bioData.theme || {})
                };
                setBioPage({ ...bioData, theme: safeTheme });

                const linksRes = await fetch("/api/bio/links");
                if (linksRes.ok) setLinks(await linksRes.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleSave = async (silent = false) => {
        setSaving(true);
        try {
            const res = await fetch("/api/bio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bioPage)
            });
            if (!res.ok) throw new Error(await res.text());
            const updated = await res.json();
            setBioPage(updated);
            if (!silent) toast.success("Saved successfully!");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    const updateTheme = (key: string, value: any) => {
        setBioPage(prev => ({
            ...prev,
            theme: { ...prev.theme, [key]: value }
        }));
    };

    const applyTemplate = (template: any) => {
        if (confirm("Apply this template? Current style changes will be overwritten.")) {
            setBioPage(prev => ({
                ...prev,
                theme: {
                    ...prev.theme,
                    ...template.theme,
                    socials: prev.theme?.socials || {}
                }
            }));
            toast.success(`Applied ${template.name} template`);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const previousUrl = bioPage.avatar_url;

        if (previousUrl && previousUrl.includes('public.blob.vercel-storage.com')) {
            setPendingFile(file);
            setShowReplaceDialog(true);
            if (e.target) e.target.value = '';
            return;
        }

        await performUpload(file);
        if (e.target) e.target.value = '';
    };

    const confirmReplacement = async () => {
        if (pendingFile) {
            await performUpload(pendingFile, bioPage.avatar_url);
            setPendingFile(null);
            setShowReplaceDialog(false);
        }
    };

    const performUpload = async (file: File, previousUrl?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (previousUrl) {
            formData.append('previousUrl', previousUrl);
        }

        const loadingToast = toast.loading("Uploading image...");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Upload failed");
            }

            const data = await res.json();
            setBioPage(prev => ({ ...prev, avatar_url: data.url }));
            toast.success(previousUrl ? "Image replaced successfully!" : "Image uploaded!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const handleAddLink = async () => {
        if (!bioPage.id) await handleSave(true);

        const newLink = {
            title: "New Link",
            url: "https://",
            type: 'link' as const,
            position: links.length
        };

        try {
            const res = await fetch("/api/bio/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLink)
            });
            if (res.ok) {
                const saved = await res.json();
                setLinks([...links, saved]);
            }
        } catch (e) {
            toast.error("Failed to add link");
        }
    };

    const updateLink = async (id: string, updates: Partial<BioLink>) => {
        setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l));
        await fetch(`/api/bio/links/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
    };

    const deleteLink = async (id: string) => {
        if (!confirm("Delete this block?")) return;
        setLinks(links.filter(l => l.id !== id));
        await fetch(`/api/bio/links/${id}`, { method: "DELETE" });
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50 dark:bg-black">

            {/* LEFT COLUMN: Content Editor */}
            <div className="w-[380px] flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-20 shadow-xl overflow-hidden">
                <div className="h-14 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 justify-between bg-white dark:bg-gray-900 z-10">
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setMode('editor')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${mode === 'editor' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
                        >Editor</button>
                        <button
                            onClick={() => setMode('analytics')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${mode === 'analytics' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
                        >
                            Analytics
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {bioPage.slug && (
                            <>
                                <a
                                    href={`/${bioPage.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-gray-500 hover:text-blue-500 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900"
                                >
                                    <Globe className="w-3 h-3" />
                                    <span className="max-w-[120px] truncate">
                                        {baseUrl ? `${baseUrl.replace(/^https?:\/\//, '')}/${bioPage.slug}` : `/${bioPage.slug}`}
                                    </span>
                                </a>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className={`p-1.5 rounded-md transition-all border border-transparent ${showShareMenu ? 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-900/40 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-100 dark:hover:border-blue-900'}`}
                                        title="Share"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>

                                    {showShareMenu && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)}></div>
                                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 mb-1">Share via</div>

                                                <button
                                                    onClick={() => {
                                                        const url = `${baseUrl}/${bioPage.slug}`;
                                                        navigator.clipboard.writeText(url);
                                                        toast.success("Link copied!");
                                                        setShowShareMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                                                >
                                                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                        <LinkIcon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Copy Link</span>
                                                </button>

                                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

                                                <a
                                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${baseUrl}/${bioPage.slug}`)}&text=${encodeURIComponent(`Check out my page: ${bioPage.title}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                                                    onClick={() => setShowShareMenu(false)}
                                                >
                                                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                                                        <Twitter className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Twitter</span>
                                                </a>

                                                <a
                                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${baseUrl}/${bioPage.slug}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                                                    onClick={() => setShowShareMenu(false)}
                                                >
                                                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-[#0077b5] group-hover:text-white transition-colors">
                                                        <Linkedin className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">LinkedIn</span>
                                                </a>

                                                <a
                                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/${bioPage.slug}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                                                    onClick={() => setShowShareMenu(false)}
                                                >
                                                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                                                        <Facebook className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Facebook</span>
                                                </a>

                                                <a
                                                    href={`mailto:?subject=${encodeURIComponent(`Check out ${bioPage.title}`)}&body=${encodeURIComponent(`Check out my page here: ${baseUrl}/${bioPage.slug}`)}`}
                                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                                                    onClick={() => setShowShareMenu(false)}
                                                >
                                                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                        <Mail className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Email</span>
                                                </a>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 p-4 space-y-3 no-scrollbar">

                    {mode === 'analytics' ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <div className="text-blue-500 mb-2"><TrendingUp className="w-5 h-5" /></div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">{bioPage.views || 0}</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Page Views</div>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800">
                                    <div className="text-purple-500 mb-2"><MousePointerClick className="w-5 h-5" /></div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">{links.reduce((acc, l) => acc + (l.clicks || 0), 0)}</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Clicks</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-xs text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-gray-400" /> Link Performance
                                </h3>
                                <div className="space-y-2">
                                    {[...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).map((link, i) => (
                                        <div key={link.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="font-mono text-gray-300 text-[10px] font-bold">#{i + 1}</div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{link.title}</span>
                                                    <span className="text-[10px] text-gray-400 truncate">{link.url}</span>
                                                </div>
                                            </div>
                                            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono font-bold">
                                                {link.clicks || 0}
                                            </div>
                                        </div>
                                    ))}
                                    {links.length === 0 && (
                                        <div className="text-center text-xs text-gray-400 py-4">No links tracked yet.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Section
                                title="Templates"
                                isOpen={activeSection === 'templates'}
                                onToggle={() => setActiveSection(activeSection === 'templates' ? 'blocks' : 'templates')}
                                icon={<Palette className="w-4 h-4" />}
                            >
                                <div className="grid grid-cols-2 gap-3 p-3">
                                    {TEMPLATES.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => applyTemplate(t)}
                                            className="group text-left border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all bg-gray-50 dark:bg-gray-800"
                                        >
                                            <div className="h-20 w-full relative" style={{ backgroundColor: t.theme.backgroundColor }}>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-80 group-hover:scale-105 transition-transform">
                                                    <div className="w-8 h-8 rounded-full border-2 border-white/50 shadow-sm" style={{ backgroundColor: '#ddd' }}></div>
                                                    <div className="w-16 h-2 rounded-full" style={{ backgroundColor: t.theme.buttonBgColor }}></div>
                                                </div>
                                            </div>
                                            <div className="p-2 text-[10px] font-bold text-center text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                                                {t.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </Section>

                            <Section
                                title="Page: Home"
                                isOpen={activeSection === 'page'}
                                onToggle={() => setActiveSection(activeSection === 'page' ? 'blocks' : 'page')}
                                icon={<LayoutTemplate className="w-4 h-4" />}
                            >
                                <div className="space-y-3 p-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Page Title</label>
                                        <input
                                            value={bioPage.title || ''}
                                            onChange={e => setBioPage({ ...bioPage, title: e.target.value })}
                                            className="w-full text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none focus:ring-1 focus:ring-blue-500 transition-all font-bold"
                                            placeholder="My Page"
                                        />
                                    </div>
                                </div>
                            </Section>

                            <Section
                                title="Header"
                                isOpen={activeSection === 'header'}
                                onToggle={() => setActiveSection(activeSection === 'header' ? 'blocks' : 'header')}
                                icon={<div className="w-4 h-4 rounded-full bg-gray-200 overflow-hidden"><img src={bioPage.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${bioPage.slug}`} className="w-full h-full" /></div>}
                            >
                                <div className="space-y-3 p-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Profile Image</label>
                                        <div className="flex gap-2">
                                            <input
                                                value={bioPage.avatar_url || ''}
                                                onChange={e => setBioPage({ ...bioPage, avatar_url: e.target.value })}
                                                className="flex-1 text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none text-blue-500"
                                                placeholder="https://"
                                            />
                                            <label className="cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors flex items-center justify-center min-w-[32px]">
                                                <Upload className="w-4 h-4 text-gray-500" />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Headline</label>
                                        <input
                                            value={bioPage.title || ''}
                                            onChange={e => setBioPage({ ...bioPage, title: e.target.value })}
                                            className="w-full text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Bio Description</label>
                                        <textarea
                                            value={bioPage.description || ''}
                                            onChange={e => setBioPage({ ...bioPage, description: e.target.value })}
                                            className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none min-h-[80px]"
                                            placeholder="Tell your story..."
                                        />
                                    </div>
                                </div>
                            </Section>

                            <Section
                                title="Socials"
                                isOpen={activeSection === 'socials'}
                                onToggle={() => setActiveSection(activeSection === 'socials' ? 'blocks' : 'socials')}
                                icon={<Share2 className="w-4 h-4" />}
                            >
                                <div className="space-y-2 p-3">
                                    {Object.keys(bioPage.theme?.socials || {}).map(key => {
                                        const platform = PLATFORMS.find(p => p.id === key);
                                        if (!platform && !['instagram', 'twitter', 'github', 'youtube', 'email', 'linkedin', 'facebook', 'website', 'tiktok'].includes(key)) return null;

                                        return (
                                            <div key={key} className="flex items-center gap-2">
                                                <div className="w-6 flex justify-center text-gray-400">
                                                    <SocialIcon name={key} />
                                                </div>
                                                <input
                                                    value={bioPage.theme?.socials?.[key] || ''}
                                                    onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), socials: { ...(bioPage.theme?.socials || {}), [key]: e.target.value } } })}
                                                    className="flex-1 text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-none"
                                                    placeholder={platform?.placeholder || `/${key}`}
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newSocials = { ...bioPage.theme?.socials };
                                                        delete newSocials[key];
                                                        updateTheme('socials', newSocials);
                                                    }}
                                                    className="text-gray-300 hover:text-red-500 p-1"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    <button
                                        onClick={() => setShowPlatformSelector(true)}
                                        className="w-full py-2 mt-2 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-bold text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        <PlusCircle className="w-3.5 h-3.5" />
                                        Add more social media
                                    </button>
                                </div>
                            </Section>

                            <Section
                                title="Blocks"
                                isOpen={activeSection === 'blocks'}
                                onToggle={() => setActiveSection(activeSection === 'blocks' ? 'blocks' : 'blocks')}
                                icon={<div className="font-bold text-[10px] border border-current w-4 h-4 flex items-center justify-center rounded text-inherit">::</div>}
                                action={<button onClick={handleAddLink} className="text-xs font-bold bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors flex items-center gap-1">New Block <PlusCircle className="w-3 h-3" /></button>}
                            >
                                <Reorder.Group axis="y" values={links} onReorder={setLinks} className="space-y-2 p-2 list-none">
                                    {links.map((link) => (
                                        <Reorder.Item key={link.id} value={link}>
                                            <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing">
                                                <div className="text-gray-300 hover:text-gray-500">
                                                    <GripVertical className="w-4 h-4" />
                                                </div>
                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
                                                    <LinkIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        value={link.title}
                                                        onChange={(e) => updateLink(link.id, { title: e.target.value })}
                                                        className="block w-full text-xs font-bold bg-transparent border-none p-0 focus:ring-0 text-gray-900 dark:text-white mb-0.5"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-400 font-medium">URL Button</span>
                                                        <span className="text-[10px] text-gray-300">•</span>
                                                        <select
                                                            value={link.animation || 'none'}
                                                            onChange={(e) => updateLink(link.id, { animation: e.target.value })}
                                                            className="text-[10px] bg-transparent border-none p-0 focus:ring-0 text-blue-500 font-bold cursor-pointer hover:underline"
                                                        >
                                                            {LINK_ANIMATIONS.map(an => (
                                                                <option key={an.id} value={an.id} className="text-gray-900">{an.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                                    <button onClick={() => updateLink(link.id, { is_active: !link.is_active })} className={`p-1.5 rounded-md ${link.is_active ? 'text-green-500 bg-green-50' : 'text-gray-300'}`}><CheckCircle2 className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => deleteLink(link.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            </Section>
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center z-10">
                    <div className="text-[10px] text-gray-400">All changes saved</div>
                    <button onClick={() => handleSave()} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-xs font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                        <Save className="w-3 h-3" /> Save Changes
                    </button>
                </div>
            </div>

            {/* CENTER COLUMN: Live Preview */}
            <div className="flex-1 relative flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-[#000000] overflow-hidden">
                <div className="absolute top-6 flex bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-700 z-10">
                    <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-full transition-all ${previewMode === 'mobile' ? 'bg-gray-100 dark:bg-gray-600 text-blue-500' : 'text-gray-400'}`}><Smartphone className="w-4 h-4" /></button>
                    <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-full transition-all ${previewMode === 'desktop' ? 'bg-gray-100 dark:bg-gray-600 text-blue-500' : 'text-gray-400'}`}><Monitor className="w-4 h-4" /></button>
                </div>

                <div className={`transition-all duration-500 ${previewMode === 'mobile' ? 'w-[280px] h-[580px]' : 'w-[800px] h-[600px]'} relative`}>
                    <div className={`w-full h-full transition-all duration-500 transform ${previewMode === 'desktop' ? 'scale-75' : 'scale-100'}`}>
                        <BioPreview bioPage={bioPage} links={links} />
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Styles & Design */}
            <div className="w-[320px] flex-shrink-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col z-20 shadow-xl overflow-hidden">
                <div className="h-14 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 bg-white dark:bg-gray-900 z-10">
                    <span className="font-bold text-sm">Design & Style</span>
                </div>

                <div className="overflow-y-auto flex-1 p-6 space-y-8 no-scrollbar">
                    <div>
                        <h4 className="font-bold text-xs mb-4 flex items-center justify-between">
                            General Styles
                            <button title="Reset" className="transition-colors hover:text-blue-500">
                                <RotateCcw className="w-3 h-3 text-gray-400" />
                            </button>
                        </h4>
                        <div className="space-y-4">
                            <ColorPicker
                                label="Primary Text Color"
                                value={bioPage.theme?.textColor || '#000000'}
                                onChange={(c) => updateTheme('textColor', c)}
                            />
                            <ColorPicker
                                label="Background Color"
                                value={bioPage.theme?.backgroundColor || '#ffffff'}
                                onChange={(c) => updateTheme('backgroundColor', c)}
                            />
                            <ColorPicker
                                label="Button Color"
                                value={bioPage.theme?.buttonBgColor || '#f3f4f6'}
                                onChange={(c) => updateTheme('buttonBgColor', c)}
                            />
                            <ColorPicker
                                label="Button Text"
                                value={bioPage.theme?.buttonTextColor || '#1f2937'}
                                onChange={(c) => updateTheme('buttonTextColor', c)}
                            />
                            <div className="pt-2">
                                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => updateTheme('shadowType', 'soft')}
                                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${bioPage.theme?.shadowType === 'soft' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                                    >Soft Shadow</button>
                                    <button
                                        onClick={() => updateTheme('shadowType', 'solid')}
                                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${bioPage.theme?.shadowType === 'solid' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                                    >Solid Shadow</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                    <div>
                        <h4 className="font-bold text-xs mb-4">Header Styles</h4>
                        <div className="space-y-5">
                            <Slider
                                label="Profile Picture Shadow"
                                value={bioPage.theme?.profileShadow || 0}
                                max={20}
                                onChange={(v) => updateTheme('profileShadow', v)}
                            />
                            <Slider
                                label="Profile Picture Border"
                                value={bioPage.theme?.profileBorder || 0}
                                max={10}
                                onChange={(v) => updateTheme('profileBorder', v)}
                            />

                            <div className="pt-2">
                                <label className="text-[11px] font-bold text-gray-500 block mb-2">Font Family</label>
                                <div className="relative group">
                                    <select
                                        value={bioPage.theme?.fontFamily || 'Inter'}
                                        onChange={(e) => updateTheme('fontFamily', e.target.value)}
                                        className="w-full text-xs p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-100 dark:border-gray-800 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer pr-10"
                                        style={{ fontFamily: bioPage.theme?.fontFamily || 'Inter' }}
                                    >
                                        {FONTS.map(f => (
                                            <option key={f.id} value={f.id} style={{ fontFamily: f.id }}>
                                                {f.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <Slider
                                label="Social Icon Size"
                                value={bioPage.theme?.socialSize || 24}
                                min={16}
                                max={48}
                                onChange={(v) => updateTheme('socialSize', v)}
                            />

                            <Slider
                                label="Button Vertical Size"
                                value={bioPage.theme?.buttonPadding || 16}
                                min={8}
                                max={32}
                                onChange={(v) => updateTheme('buttonPadding', v)}
                            />

                            <Slider
                                label="Button Spacing"
                                value={bioPage.theme?.buttonSpacing || 12}
                                min={0}
                                max={40}
                                onChange={(v) => updateTheme('buttonSpacing', v)}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                    <div>
                        <h4 className="font-bold text-xs mb-4">Button Shape</h4>
                        <div className="flex gap-2">
                            {['rounded-lg', 'rounded-full', 'rounded-none'].map(style => (
                                <button
                                    key={style}
                                    onClick={() => updateTheme('buttonStyle', style)}
                                    className={`flex-1 h-10 border-2 transition-all ${style} ${bioPage.theme?.buttonStyle === style ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Replacement Confirmation Dialog */}
            <AlertDialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Replace profile image?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You already have a profile image. Replacing it will permanently delete the old one from storage.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setPendingFile(null); setShowReplaceDialog(false); }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmReplacement} className="bg-blue-600 hover:bg-blue-700">
                            Replace Image
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Platform Selector Dialog */}
            <AlertDialog open={showPlatformSelector} onOpenChange={setShowPlatformSelector}>
                <AlertDialogContent className="sm:max-w-[420px] rounded-[2rem] p-0 overflow-hidden">
                    <AlertDialogHeader className="p-6 pb-2">
                        <AlertDialogTitle className="text-xl font-black">Add Social</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs font-bold text-gray-400">
                            Select a platform to add to your page
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid grid-cols-3 gap-3 p-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                        {PLATFORMS.map(p => {
                            const isAdded = !!bioPage.theme?.socials?.[p.id];
                            return (
                                <button
                                    key={p.id}
                                    disabled={isAdded}
                                    onClick={() => {
                                        updateTheme('socials', { ...(bioPage.theme?.socials || {}), [p.id]: '' });
                                        setShowPlatformSelector(false);
                                    }}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${isAdded ? 'opacity-30' : 'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                                >
                                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        {p.icon}
                                    </div>
                                    <span className="text-[10px] font-bold">{p.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    <AlertDialogFooter className="p-4 bg-gray-50 dark:bg-gray-800/50">
                        <AlertDialogCancel className="w-full rounded-xl font-bold text-xs">Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// --- Sub Components ---

interface SectionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
}

function Section({ title, isOpen, onToggle, children, icon, action }: SectionProps) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div
                className={`flex items-center justify-between px-4 py-3 cursor-pointer ${isOpen ? 'bg-gray-50/50' : ''}`}
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="text-gray-500 text-xs">{icon}</div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 select-none">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    {action}
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                </div>
            </div>
            {isOpen && <div className="border-t border-gray-100 dark:border-gray-800">{children}</div>}
        </div>
    );
}

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500">{label}</span>
            <div className="relative group">
                <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm overflow-hidden relative cursor-pointer active:scale-95 transition-transform" style={{ backgroundColor: value }}>
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute -top-2 -left-2 w-16 h-16 opacity-0 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}

interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

function Slider({ label, value, onChange, min = 0, max = 100 }: SliderProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <span className="text-[11px] font-bold text-gray-500">{label}</span>
                <span className="text-[10px] font-mono text-gray-400">{value}px</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );
}

function SocialIcon({ name }: { name: string }) {
    if (name === 'instagram') return <Instagram className="w-4 h-4" />;
    if (name === 'twitter') return <TwitterIcon />;
    if (name === 'github') return <Github className="w-4 h-4" />;
    if (name === 'youtube') return <Youtube className="w-4 h-4" />;
    if (name === 'linkedin') return <Linkedin className="w-4 h-4" />;
    if (name === 'facebook') return <Facebook className="w-4 h-4" />;
    if (name === 'email') return <Mail className="w-4 h-4" />;
    if (name === 'tiktok') return <Music className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
}
