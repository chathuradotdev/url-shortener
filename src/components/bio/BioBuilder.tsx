"use client";

import { useState, useEffect } from "react";
import { BioPage, BioLink } from "@/lib/db";
import BioPreview from "./BioPreview";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutTemplate, Palette, Share2, PlusCircle, Instagram, Twitter, Globe, Github, Youtube, Music, Link as LinkIcon, Type } from "lucide-react";

export default function BioBuilder() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [bioPage, setBioPage] = useState<Partial<BioPage>>({ theme: {} });
    const [links, setLinks] = useState<BioLink[]>([]);
    const [saving, setSaving] = useState(false);
    const [userTeams, setUserTeams] = useState<any[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");

    // Form states
    const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'design'>('links');

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
                // Not premium
                toast.error("Premium required for Bio Pages");
                router.push("/dashboard");
                return;
            }

            const bioData = await bioRes.json();

            if (bioData.exists === false) {
                // Initialize empty? or create on save?
                // Let's keep it partial
            } else {
                setBioPage(bioData);

                // Fetch links only if bio page exists
                const linksRes = await fetch("/api/bio/links");
                if (linksRes.ok) {
                    setLinks(await linksRes.json());
                }
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to load bio data");
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
                body: JSON.stringify({
                    ...bioPage,
                    teamId: selectedTeamId || null
                })
            });

            if (!res.ok) throw new Error(await res.text());

            const updated = await res.json();
            setBioPage(updated);
            toast.success("Profile saved!");
        } catch (e: any) {
            toast.error("Failed to save: " + e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddLink = async (type: 'link' | 'youtube' | 'spotify' = 'link') => {
        setSaving(true);
        try {
            // Ensure bio page exists first
            if (!bioPage.id) {
                await handleSaveProfile(); // This might fail if validation fails, handled in catch
            }
            // Need to reload bioPage to get ID if it was just created? 
            // handleSaveProfile updates state, but async state updates... 
            // Better to chain properly or just save profile first if new.

            // Actually handleSaveProfile waits for response. state update might be pending.
            // Let's assume user explicitly creates profile/saves first or we auto-save.

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

            if (!res.ok) throw new Error(await res.text());

            const savedLink = await res.json();
            setLinks([...links, savedLink]);
            toast.success("Link added");
        } catch (e: any) {
            toast.error("Error adding link");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateLink = async (id: string, updates: Partial<BioLink>) => {
        // Optimistic update
        const oldLinks = [...links];
        setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l));

        try {
            await fetch(`/api/bio/links/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates)
            });
        } catch (e) {
            setLinks(oldLinks);
            toast.error("Failed to update link");
        }
    };

    const handleDeleteLink = async (id: string) => {
        if (!confirm("Delete this link?")) return;

        const oldLinks = [...links];
        setLinks(links.filter(l => l.id !== id));

        try {
            await fetch(`/api/bio/links/${id}`, { method: "DELETE" });
            toast.success("Link deleted");
        } catch (e) {
            setLinks(oldLinks);
            toast.error("Failed to delete link");
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Panel - Editor */}
            <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Bio Builder</h2>
                    <a
                        href={`/bio/${bioPage.slug || ''}`}
                        target="_blank"
                        className={`text-sm text-blue-600 hover:underline ${!bioPage.slug ? 'hidden' : ''}`}
                    >
                        View Live
                    </a>
                </div>

                {userTeams.length > 0 && !bioPage.id && (
                    <div className="mb-6 flex items-center gap-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in slide-in-from-left-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Workspace:
                        </div>
                        <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-blue-600 dark:text-blue-400 cursor-pointer p-0 pr-8"
                        >
                            <option value="">Personal</option>
                            {userTeams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
                    {['links', 'profile', 'design'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab
                                ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'profile' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Page Slug (URL)</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm">
                                    /bio/
                                </span>
                                <input
                                    type="text"
                                    value={bioPage.slug || ''}
                                    onChange={e => setBioPage({ ...bioPage, slug: e.target.value })}
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="your-name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Display Name</label>
                            <input
                                type="text"
                                value={bioPage.title || ''}
                                onChange={e => setBioPage({ ...bioPage, title: e.target.value })}
                                className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={bioPage.description || ''}
                                onChange={e => setBioPage({ ...bioPage, description: e.target.value })}
                                rows={3}
                                className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Avatar URL</label>
                            <input
                                type="url"
                                value={bioPage.avatar_url || ''}
                                onChange={e => setBioPage({ ...bioPage, avatar_url: e.target.value })}
                                className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md font-bold mt-4 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                )}

                {activeTab === 'design' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        {/* Background */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Background Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={bioPage.theme?.backgroundColor || '#ffffff'}
                                    onChange={e => setBioPage({ ...bioPage, theme: { ...bioPage.theme, backgroundColor: e.target.value } })}
                                    className="h-10 w-20 rounded cursor-pointer"
                                />
                                <span className="text-sm font-mono">{bioPage.theme?.backgroundColor || '#ffffff'}</span>
                            </div>
                        </div>

                        {/* Text Color */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Text Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={bioPage.theme?.textColor || '#000000'}
                                    onChange={e => setBioPage({ ...bioPage, theme: { ...bioPage.theme, textColor: e.target.value } })}
                                    className="h-10 w-20 rounded cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Button Style */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Button Style</label>
                            <select
                                value={bioPage.theme?.buttonStyle || 'rounded-full'}
                                onChange={e => setBioPage({ ...bioPage, theme: { ...bioPage.theme, buttonStyle: e.target.value } })}
                                className="block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                            >
                                <option value="rounded-full">Rounded Full</option>
                                <option value="rounded-lg">Rounded Box</option>
                                <option value="rounded-none">Sharp</option>
                            </select>
                        </div>

                        {/* Button Colors */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Button Background</label>
                                <input
                                    type="color"
                                    value={bioPage.theme?.buttonBgColor || '#f3f4f6'}
                                    onChange={e => setBioPage({ ...bioPage, theme: { ...bioPage.theme, buttonBgColor: e.target.value } })}
                                    className="h-10 w-full rounded cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Button Text</label>
                                <input
                                    type="color"
                                    value={bioPage.theme?.buttonTextColor || '#1f2937'}
                                    onChange={e => setBioPage({ ...bioPage, theme: { ...bioPage.theme, buttonTextColor: e.target.value } })}
                                    className="h-10 w-full rounded cursor-pointer"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md font-bold mt-4 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Design'}
                        </button>
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <button
                                onClick={() => handleAddLink('link')}
                                disabled={saving}
                                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all gap-2"
                            >
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <LinkIcon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold">Link</span>
                            </button>
                            <button
                                onClick={() => handleAddLink('youtube')}
                                disabled={saving}
                                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all gap-2"
                            >
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                    <Youtube className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold">YouTube</span>
                            </button>
                            <button
                                onClick={() => handleAddLink('spotify')}
                                disabled={saving}
                                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all gap-2"
                            >
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <Music className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold">Spotify</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {links.map((link) => (
                                <div key={link.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm group">
                                    <div className="flex items-start gap-3">
                                        <div className="cursor-move text-gray-400 pt-2">
                                            {/* Drag Handle Icon - functionality requires dnd lib, skipping for now */}
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <input
                                                type="text"
                                                value={link.title}
                                                onChange={e => handleUpdateLink(link.id, { title: e.target.value })}
                                                className="block w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent font-medium"
                                                placeholder="Title"
                                            />
                                            {/* Badge for Type */}
                                            {link.type && link.type !== 'link' && (
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${link.type === 'youtube' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {link.type}
                                                </span>
                                            )}

                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={e => handleUpdateLink(link.id, { url: e.target.value })}
                                                className="block w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-500"
                                                placeholder={link.type === 'youtube' ? "https://youtube.com/watch?v=..." : link.type === 'spotify' ? "https://open.spotify.com/track/..." : "https://example.com"}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={link.is_active}
                                                    onChange={e => handleUpdateLink(link.id, { is_active: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                                            </label>
                                            <button
                                                onClick={() => handleDeleteLink(link.id)}
                                                className="text-gray-400 hover:text-red-500 p-1"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {links.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No links yet. Click the button above to add one.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Panel - Preview */}
            <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-black flex items-center justify-center p-8 relative">
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 px-4 py-2 rounded-full shadow text-sm font-medium opacity-50">
                    Live Preview
                </div>
                <BioPreview bioPage={bioPage} links={links} />
            </div>
        </div>
    );
}
