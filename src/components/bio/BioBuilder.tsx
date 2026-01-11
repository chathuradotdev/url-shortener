"use client";

import { useState, useEffect } from "react";
import { BioPage, BioLink } from "@/lib/db";
import BioPreview from "./BioPreview";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutTemplate, Palette, Share2, PlusCircle, Instagram, Twitter, Globe, Github, Youtube, Music, Link as LinkIcon, Type, X, ChevronRight, CheckCircle2 } from "lucide-react";

export default function BioBuilder() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [bioPage, setBioPage] = useState<Partial<BioPage>>({
        title: "",
        description: "",
        slug: "",
        theme: {
            backgroundColor: "#ffffff",
            textColor: "#000000",
            buttonBgColor: "#f3f4f6",
            buttonTextColor: "#1f2937",
            buttonStyle: "rounded-full",
            fontFamily: "Inter"
        }
    });
    const [links, setLinks] = useState<BioLink[]>([]);
    const [saving, setSaving] = useState(false);
    const [userTeams, setUserTeams] = useState<any[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");

    const [activeTab, setActiveTab] = useState<'templates' | 'links' | 'socials' | 'profile' | 'design'>('templates');

    const TEMPLATES: any[] = [
        {
            id: 'artisan',
            name: 'Artisan',
            description: 'Professional product-focused layout.',
            theme: {
                backgroundColor: '#fdfbf7',
                textColor: '#4a1d4a',
                buttonBgColor: '#ffffff',
                buttonTextColor: '#4a1d4a',
                buttonStyle: 'rounded-lg',
                fontFamily: 'Outfit',
                headerImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800',
                isVerified: false
            }
        },
        {
            id: 'gamer',
            name: 'Gamer',
            description: 'High-energy dark mode with neon accents.',
            theme: {
                backgroundColor: '#0f172a',
                textColor: '#f8fafc',
                buttonBgColor: '#8b5cf6',
                buttonTextColor: '#ffffff',
                buttonStyle: 'rounded-none',
                fontFamily: 'Inter',
                headerColor: '#1e293b',
                isVerified: true
            }
        },
        {
            id: 'boho',
            name: 'Boho',
            description: 'Warm, natural tones and soft textures.',
            theme: {
                backgroundColor: '#f1e8e0',
                textColor: '#4a3728',
                buttonBgColor: '#a67c52',
                buttonTextColor: '#ffffff',
                buttonStyle: 'rounded-lg',
                fontFamily: 'Outfit',
                backgroundImage: 'https://images.unsplash.com/photo-1544070078-a212eda27b49?q=80&w=800'
            }
        },
        {
            id: 'cyber',
            name: 'Cyber',
            description: 'Futuristic blue-scale design.',
            theme: {
                backgroundColor: '#020617',
                textColor: '#38bdf8',
                buttonBgColor: '#0f172a',
                buttonTextColor: '#38bdf8',
                buttonStyle: 'rounded-none',
                fontFamily: 'Inter',
                headerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800'
            }
        },
        {
            id: 'luxe',
            name: 'Luxe',
            description: 'Minimalist card layout for a premium feel.',
            theme: {
                backgroundColor: '#f8fafc',
                textColor: '#0f172a',
                buttonBgColor: '#0f172a',
                buttonTextColor: '#ffffff',
                buttonStyle: 'rounded-full',
                fontFamily: 'Outfit',
                cardMode: true,
                headerColor: '#0f172a'
            }
        },
        {
            id: 'organic',
            name: 'Organic',
            description: 'Full-page natural texture and soft greens.',
            theme: {
                backgroundColor: '#d1e2c4',
                textColor: '#1a3c34',
                buttonBgColor: 'rgba(255, 255, 255, 0.4)',
                buttonTextColor: '#1a3c34',
                buttonStyle: 'rounded-lg',
                fontFamily: 'Inter',
                backgroundImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800'
            }
        },
        {
            id: 'vcard',
            name: 'Digital Card',
            description: 'Dark purple business card style.',
            theme: {
                backgroundColor: '#3b163e',
                textColor: '#ffffff',
                buttonBgColor: '#f2e8cf',
                buttonTextColor: '#3b163e',
                buttonStyle: 'rounded-lg',
                fontFamily: 'Inter',
                headerImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800',
                cardMode: false
            }
        },
        {
            id: 'influencer',
            name: 'Influencer',
            description: 'Minimalist & soft, perfect for creators.',
            theme: {
                backgroundColor: '#fdf2f8',
                textColor: '#831843',
                buttonBgColor: '#ffffff',
                buttonTextColor: '#be185d',
                buttonStyle: 'rounded-full',
                fontFamily: 'Outfit',
                isVerified: true
            }
        },
        {
            id: 'academy',
            name: 'Academy',
            description: 'Professional layout with header banner.',
            theme: {
                backgroundColor: '#f0f9ff',
                textColor: '#075985',
                buttonBgColor: '#0ea5e9',
                buttonTextColor: '#ffffff',
                buttonStyle: 'rounded-lg',
                fontFamily: 'Inter',
                headerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800'
            }
        }
    ];

    useEffect(() => {
        fetchData();
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await fetch("/api/teams");
            if (res.ok) {
                const data = await res.json();
                setUserTeams(data);
            }
        } catch (e) {
            console.error("Failed to fetch teams", e);
        }
    };

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
                setBioPage(bioData);
                const linksRes = await fetch("/api/bio/links");
                if (linksRes.ok) setLinks(await linksRes.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/bio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...bioPage, teamId: selectedTeamId || null })
            });
            if (!res.ok) throw new Error(await res.text());
            const updated = await res.json();
            setBioPage(updated);
            toast.success("Published successfully!");
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleApplyTemplate = (template: any) => {
        setBioPage({
            ...bioPage,
            theme: {
                backgroundColor: '#ffffff',
                textColor: '#000000',
                buttonBgColor: '#f3f4f6',
                buttonTextColor: '#1f2937',
                buttonStyle: 'rounded-full',
                fontFamily: 'Inter',
                headerImage: undefined,
                headerColor: undefined,
                backgroundImage: undefined,
                cardMode: false,
                isVerified: false,
                socials: bioPage.theme?.socials || {},
                ...template.theme
            }
        });
        toast.success(`Applied ${template.name} template!`);
        setActiveTab('links');
    };

    const handleAddLink = async (type: 'link' | 'youtube' | 'spotify' = 'link') => {
        setSaving(true);
        try {
            if (!bioPage.id) {
                const res = await fetch("/api/bio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...bioPage })
                });
                if (!res.ok) throw new Error("Failed");
                const updated = await res.json();
                setBioPage(updated);
            }

            const newLink = {
                title: type === 'youtube' ? 'My Video' : type === 'spotify' ? 'My Music' : 'New Link',
                url: "",
                type,
                position: links.length
            };

            const res = await fetch("/api/bio/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLink)
            });

            if (res.ok) {
                const saved = await res.json();
                setLinks([...links, saved]);
                toast.success("Link added");
            }
        } catch (e) {
            toast.error("Error adding link");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateLink = async (id: string, updates: Partial<BioLink>) => {
        setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l));
        try {
            await fetch(`/api/bio/links/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            });
        } catch (e) {
            toast.error("Update failed");
        }
    };

    const handleDeleteLink = async (id: string) => {
        if (!confirm("Delete?")) return;
        setLinks(links.filter(l => l.id !== id));
        try {
            await fetch(`/api/bio/links/${id}`, { method: "DELETE" });
        } catch (e) {
            toast.error("Delete failed");
        }
    };

    if (loading) return <div className="p-20 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
            {/* Editor Panel */}
            <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 no-scrollbar">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black">Bio Builder</h2>
                    <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20"
                    >
                        {saving ? '...' : 'Publish'}
                    </button>
                </div>

                <div className="flex space-x-1 mb-8 bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                    {['templates', 'links', 'socials', 'profile', 'design'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-none px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-500'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="min-h-0">
                    {activeTab === 'templates' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4">
                            {TEMPLATES.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => handleApplyTemplate(template)}
                                    className="group relative flex flex-col bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-5 hover:border-blue-500 transition-all text-left"
                                >
                                    <div className="w-full h-32 rounded-2xl mb-4 overflow-hidden relative border bg-gray-50" style={{ backgroundColor: template.theme.backgroundColor }}>
                                        {template.theme.headerImage && <img src={template.theme.headerImage} className="w-full h-1/2 object-cover" />}
                                        {template.theme.headerColor && <div className="w-full h-1/3" style={{ backgroundColor: template.theme.headerColor }}></div>}
                                        <div className="flex flex-col items-center pt-2 gap-1 px-4">
                                            <div className="w-6 h-6 rounded-full bg-gray-300" />
                                            <div className="w-full h-2 rounded bg-gray-200" />
                                            <div className="w-full h-2 rounded opacity-50" style={{ backgroundColor: template.theme.buttonBgColor }} />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{template.name}</h3>
                                    <p className="text-[10px] text-gray-400">{template.description}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'links' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="grid grid-cols-3 gap-3">
                                <button onClick={() => handleAddLink('link')} className="p-4 bg-white dark:bg-gray-900 border-2 border-dashed rounded-2xl flex flex-col items-center gap-1 hover:border-blue-500">
                                    <LinkIcon className="w-5 h-5 text-blue-600" />
                                    <span className="text-[9px] font-bold uppercase">Link</span>
                                </button>
                                <button onClick={() => handleAddLink('youtube')} className="p-4 bg-white dark:bg-gray-900 border-2 border-dashed rounded-2xl flex flex-col items-center gap-1 hover:border-red-500">
                                    <Youtube className="w-5 h-5 text-red-600" />
                                    <span className="text-[9px] font-bold uppercase">Video</span>
                                </button>
                                <button onClick={() => handleAddLink('spotify')} className="p-4 bg-white dark:bg-gray-900 border-2 border-dashed rounded-2xl flex flex-col items-center gap-1 hover:border-green-500">
                                    <Music className="w-5 h-5 text-green-600" />
                                    <span className="text-[9px] font-bold uppercase">Music</span>
                                </button>
                            </div>
                            {links.map(link => (
                                <div key={link.id} className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <input value={link.title} onChange={e => handleUpdateLink(link.id, { title: e.target.value })} className="font-bold bg-transparent border-none text-sm p-0 focus:ring-0" />
                                        <div className="flex items-center gap-2">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={link.is_active} onChange={e => handleUpdateLink(link.id, { is_active: e.target.checked })} className="sr-only peer" />
                                                <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full" />
                                            </label>
                                            <button onClick={() => handleDeleteLink(link.id)} className="text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <LinkIcon className="w-3 h-3 text-gray-400" />
                                        <input value={link.url} onChange={e => handleUpdateLink(link.id, { url: e.target.value })} className="flex-1 text-[10px] bg-transparent border-none p-0 focus:ring-0 text-blue-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'design' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Appearance</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400">Page BG</label>
                                        <div className="flex gap-2">
                                            <input
                                                value={bioPage.theme?.backgroundImage || ''}
                                                onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), backgroundImage: e.target.value } })}
                                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] border-none"
                                                placeholder="Image URL"
                                            />
                                            <input type="color" value={bioPage.theme?.backgroundColor || '#ffffff'} onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), backgroundColor: e.target.value } })} className="w-10 h-10 border-none p-0 bg-transparent cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400">Banner</label>
                                        <div className="flex gap-2">
                                            <input
                                                value={bioPage.theme?.headerImage || ''}
                                                onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), headerImage: e.target.value, headerColor: undefined } })}
                                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] border-none"
                                                placeholder="Image URL"
                                            />
                                            <input
                                                type="color"
                                                value={bioPage.theme?.headerColor || '#ffffff'}
                                                onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), headerColor: e.target.value, headerImage: undefined } })}
                                                className="w-10 h-10 border-none p-0 bg-transparent cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Buttons</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="color" value={bioPage.theme?.buttonBgColor || '#000000'} onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), buttonBgColor: e.target.value } })} className="w-full h-10 border-none p-0 bg-transparent cursor-pointer" />
                                        <select value={bioPage.theme?.buttonStyle || 'rounded-full'} onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), buttonStyle: e.target.value } })} className="bg-gray-50 border-none rounded-xl text-xs">
                                            <option value="rounded-full">Pill</option>
                                            <option value="rounded-lg">Rounded</option>
                                            <option value="rounded-none">Sharp</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Card Layout</label>
                                    <input type="checkbox" checked={bioPage.theme?.cardMode} onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), cardMode: e.target.checked } })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'socials' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                                {['instagram', 'twitter', 'github', 'youtube'].map(key => (
                                    <div key={key} className="flex flex-col gap-1">
                                        <label className="text-[10px] font-black uppercase text-gray-400">{key}</label>
                                        <input
                                            value={bioPage.theme?.socials?.[key] || ''}
                                            onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), socials: { ...(bioPage.theme?.socials || {}), [key]: e.target.value } } })}
                                            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs border-none"
                                            placeholder={`https://${key}.com/username`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Display Name</label>
                                    <input value={bioPage.title || ''} onChange={e => setBioPage({ ...bioPage, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Short Bio</label>
                                    <textarea value={bioPage.description || ''} onChange={e => setBioPage({ ...bioPage, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none min-h-[100px]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Avatar URL</label>
                                    <input value={bioPage.avatar_url || ''} onChange={e => setBioPage({ ...bioPage, avatar_url: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none text-blue-500 underline text-xs" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Verified Badge</label>
                                    <input type="checkbox" checked={bioPage.theme?.isVerified} onChange={e => setBioPage({ ...bioPage, theme: { ...(bioPage.theme || {}), isVerified: e.target.checked } })} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Panel */}
            <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-black p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-10 right-10 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-[9px] font-black uppercase text-gray-400">Live Preview</div>
                <div className="scale-75 lg:scale-100 transition-all">
                    <BioPreview bioPage={bioPage} links={links} />
                </div>
            </div>
        </div>
    );
}
