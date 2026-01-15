"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BioPage, BioLink } from "@/lib/db";
import {
    Instagram, Twitter, Github, Youtube, Globe, CheckCircle2,
    UserPlus, Share2, Search, Menu, X, QrCode, Copy,
    Facebook, Linkedin, Check, ChevronLeft, Mail, Phone, Music, Send, PlusCircle
} from "lucide-react";
import QrCodeDisplay from "../QrCodeDisplay";
import { toast } from "sonner";

interface BioRendererProps {
    bioPage: Partial<BioPage>;
    links: BioLink[];
    variant?: 'public' | 'preview';
    allPages?: BioPage[];
}

export default function BioRenderer({ bioPage, links, variant = 'public', allPages = [] }: BioRendererProps) {
    const [showShare, setShowShare] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [viewMode, setViewMode] = useState<'share' | 'qr'>('share');
    const [isCopied, setIsCopied] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const theme = bioPage.theme || {};

    // Core Colors
    const bgColor = theme.backgroundColor || '#ffffff';
    const textColor = theme.textColor || '#000000';
    const buttonBgColor = theme.buttonBgColor || '#f3f4f6';
    const buttonTextColor = theme.buttonTextColor || '#1f2937';

    // Formatting
    const buttonStyle = theme.buttonStyle || 'rounded-full';
    const fontFamily = theme.fontFamily || 'Inter';
    const cardMode = theme.cardMode;

    // Backgrounds
    const backgroundImage = theme.backgroundImage;
    const headerImage = theme.headerImage;
    const headerColor = theme.headerColor;

    // Advanced styles
    const shadowType = theme.shadowType || 'soft'; // 'soft' | 'solid'
    const profileShadow = theme.profileShadow || 0; // 0-20
    const profileBorder = theme.profileBorder || 0; // 0-10
    const socialSize = theme.socialSize || 24; // px
    const buttonPadding = theme.buttonPadding || 16; // px
    const buttonSpacing = theme.buttonSpacing || 12; // px
    const glassEffect = theme.glassEffect || false;

    const socials = theme.socials || {};

    const buttonClass =
        buttonStyle === 'rounded-full' ? 'rounded-full' :
            buttonStyle === 'rounded-lg' ? 'rounded-lg' :
                buttonStyle === 'rounded-none' ? 'rounded-none' :
                    'border-2 bg-transparent';

    const getShadowStyle = (level: number = 1) => {
        if (shadowType === 'solid') {
            return `${level * 4}px ${level * 4}px 0px rgba(0,0,0,0.2)`;
        }
        return `0px ${level * 4}px ${level * 10}px rgba(0,0,0,${level * 0.1})`;
    };

    const getAnimationProps = (animation?: string): any => {
        switch (animation) {
            case 'pulse':
                return {
                    animate: { scale: [1, 1.03, 1] },
                    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                };
            case 'shake':
                return {
                    animate: { x: [0, -2, 2, -2, 2, 0] },
                    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
                };
            case 'bounce':
                return {
                    animate: { y: [0, -5, 0] },
                    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                };
            case 'glow':
                return {
                    animate: {
                        boxShadow: [
                            getShadowStyle(1),
                            `0px 0px 20px ${buttonBgColor}80`,
                            getShadowStyle(1)
                        ]
                    },
                    transition: { duration: 2, repeat: Infinity }
                };
            case 'blink':
                return {
                    animate: { opacity: [1, 0.5, 1] },
                    transition: { duration: 1, repeat: Infinity }
                };
            default:
                return {};
        }
    };

    const handleCopyLink = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(`https://liinks.co/${bioPage.slug}`);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleCloseShare = () => {
        setShowShare(false);
        setViewMode('share'); // Reset on close
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://liinks.co/${bioPage.slug}`;

    // The inner content (The "Phone" screen)
    const content = (
        <div className="relative w-full h-full overflow-hidden bg-white">
            {/* SHARE MODAL OVERLAY */}
            {showShare && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6 animate-in fade-in duration-200">
                    <button
                        onClick={handleCloseShare}
                        className="absolute top-24 left-1/2 -translate-x-1/2 text-white/90 hover:text-white mb-4 z-50 focus:outline-none transition-transform active:scale-95"
                    >
                        <div className="bg-white/10 p-2 rounded-full backdrop-blur-md">
                            <X className="w-6 h-6" />
                        </div>
                    </button>

                    <div className="bg-white rounded-[1.5rem] p-6 w-full max-w-[320px] shadow-2xl flex flex-col items-center gap-4 mt-8 animate-in zoom-in-95 duration-200 relative max-h-[75vh] overflow-y-auto no-scrollbar">

                        {viewMode === 'share' ? (
                            <>
                                <div className="text-center w-full relative">
                                    <h3 className="font-bold text-xl mb-4 text-gray-900 border-b border-gray-100 pb-4">{bioPage.title || 'Profile'}</h3>

                                    <div className="flex justify-center mb-2">
                                        {bioPage.avatar_url ? (
                                            <img
                                                src={bioPage.avatar_url}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-black text-gray-300">
                                                {bioPage.title?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full space-y-3 pt-2">
                                    <button
                                        onClick={() => setViewMode('qr')}
                                        className="w-full bg-[#1a1b1f] text-white h-12 px-4 rounded-xl font-bold text-sm flex items-center justify-between hover:bg-black transition-colors"
                                    >
                                        View QR Code <QrCode className="w-5 h-5 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={handleCopyLink}
                                        className={`w-full h-12 px-4 rounded-xl font-bold text-sm flex items-center justify-between transition-all duration-200 ${isCopied ? 'bg-green-600 text-white' : 'bg-[#1a1b1f] text-white hover:bg-black'}`}
                                    >
                                        {isCopied ? 'Copied to Clipboard!' : 'Copy Page URL'}
                                        {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 text-gray-400" />}
                                    </button>
                                </div>

                                <div className="flex justify-center gap-2 pt-2 w-full">
                                    <button className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-sm">
                                        <Facebook className="w-6 h-6 fill-current" />
                                    </button>
                                    <button className="w-12 h-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-sm">
                                        <Twitter className="w-6 h-6 fill-current" />
                                    </button>
                                    <button className="w-12 h-12 bg-[#E60023] rounded-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-sm">
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" /></svg>
                                    </button>
                                    <button className="w-12 h-12 bg-[#FF4500] rounded-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-sm">
                                        <span className="font-extrabold text-[10px] w-6 h-6 flex items-center justify-center border-2 border-white rounded-full">RD</span>
                                    </button>
                                    <button className="w-12 h-12 bg-[#0077b5] rounded-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-sm">
                                        <Linkedin className="w-6 h-6 fill-current" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            // QR Code View
                            <div className="flex flex-col items-center w-full">
                                <div className="w-full flex items-center justify-start mb-4 border-b border-gray-100 pb-4">
                                    <button onClick={() => setViewMode('share')} className="text-gray-500 hover:text-black flex items-center text-sm font-bold gap-1 transition-colors">
                                        <ChevronLeft className="w-5 h-5" /> Back
                                    </button>
                                </div>
                                <h3 className="font-bold text-lg mb-6 text-gray-900">Scan QR Code</h3>

                                <QrCodeDisplay
                                    url={`https://liinks.co/${bioPage.slug}`}
                                    variant="mobile-sheet"
                                    options={{ width: 400, margin: 1 }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* NAVIGATION MENU OVERLAY */}
            {showMenu && (
                <div
                    className="absolute inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300"
                    onClick={() => setShowMenu(false)}
                >
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-[80%] h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col p-6 relative overflow-y-auto no-scrollbar"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-lg uppercase tracking-wider opacity-90">My Pages</h3>
                            <button
                                onClick={() => setShowMenu(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {allPages.length > 0 ? (
                                allPages.map((page) => (
                                    <a
                                        key={page.id}
                                        href={variant === 'public' ? `/bio/${page.slug}` : '#'}
                                        onClick={(e) => {
                                            if (variant === 'preview') {
                                                e.preventDefault();
                                                toast.success(`Switching to: ${page.title}`);
                                            }
                                        }}
                                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${page.slug === bioPage.slug
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/20'
                                                : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-blue-500/20'
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 border border-white/10 shrink-0">
                                            <img
                                                src={page.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${page.slug}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-black text-sm truncate uppercase tracking-tight">{page.title || page.slug}</div>
                                            <div className="text-[10px] opacity-60 font-medium truncate">/{page.slug}</div>
                                        </div>
                                        {page.slug === bioPage.slug && (
                                            <Check className="w-4 h-4" />
                                        )}
                                    </a>
                                ))
                            ) : (
                                <div className="text-center py-12 opacity-40">
                                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No other pages</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto pt-8">
                            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-xl shadow-blue-500/20 group">
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                <h4 className="font-black text-sm mb-2 relative z-10">Upgrade to Pro</h4>
                                <p className="text-[10px] opacity-80 leading-relaxed mb-4 relative z-10">Create unlimited pages and unlock advanced analytics.</p>
                                <button className="w-full py-2 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-50 transition-colors relative z-10">Learn More</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <div
                className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col items-center relative"
                style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    fontFamily: fontFamily,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'local',
                    position: 'relative'
                }}
            >
                {backgroundImage && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundColor: `${bgColor}50` }}
                    />
                )}
                <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-full px-6 py-6 flex items-center justify-between shrink-0 z-20 ${headerImage || headerColor ? 'text-white mix-blend-difference' : ''}`} style={{ color: headerImage || headerColor ? undefined : textColor }}>
                        <div className="flex gap-4">
                            <UserPlus className="w-5 h-5 opacity-80 cursor-pointer hover:scale-110 transition-transform" />
                            <Share2 onClick={() => setShowShare(true)} className="w-5 h-5 opacity-100 cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex gap-4">
                            {theme.showSearch && (
                                <Search onClick={() => setIsSearchVisible(!isSearchVisible)} className="w-5 h-5 opacity-80 cursor-pointer hover:scale-110 transition-transform" />
                            )}
                            <Menu onClick={() => setShowMenu(true)} className="w-5 h-5 opacity-80 cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    {isSearchVisible && theme.showSearch && (
                        <div className="w-full px-6 mb-4 animate-in fade-in slide-in-from-top-1 z-20">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search links..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400/70"
                                    style={{ color: textColor }}
                                    autoFocus
                                />
                                {searchQuery && (
                                    <X
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Header Image (Optional Banner) */}
                    {headerImage && (
                        <div className="absolute top-0 w-full h-48 shrink-0 overflow-hidden z-0">
                            <img src={headerImage} alt="header" className="w-full h-full object-cover opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                        </div>
                    )}
                    {headerColor && (
                        <div className="absolute top-0 w-full h-32 shrink-0 z-0" style={{ backgroundColor: headerColor }}></div>
                    )}


                    {/* Content Container */}
                    <div className={`w-full flex flex-col items-center px-6 pb-12 relative flex-grow max-w-md mx-auto z-10 ${(headerImage || headerColor) ? 'pt-12' : ''}`}>

                        {/* Avatar with Custom Styles */}
                        <div className="relative group mb-4">
                            {bioPage.avatar_url ? (
                                <div className="relative">
                                    <img
                                        src={bioPage.avatar_url}
                                        alt="Profile"
                                        className="object-cover transition-all duration-500 group-hover:scale-105"
                                        style={{
                                            width: '96px',
                                            height: '96px',
                                            borderRadius: '9999px',
                                            border: `${profileBorder}px solid ${cardMode ? bgColor : '#fff'}`,
                                            boxShadow: profileShadow > 0 ? (shadowType === 'solid' ? `${profileShadow}px ${profileShadow}px 0px rgba(0,0,0,0.2)` : `0px 10px ${profileShadow * 2}px rgba(0,0,0,0.2)`) : 'none'
                                        }}
                                    />
                                    {theme.isVerified && (
                                        <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-900 rounded-full p-1 shadow-lg ring-1 ring-black/5 z-20">
                                            <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl font-black text-gray-300 shadow-lg"
                                    style={{
                                        border: `${profileBorder}px solid #fff`,
                                    }}
                                >
                                    {bioPage.title?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>

                        {/* Title & Description */}
                        <div className="text-center px-4 w-full mb-6">
                            <h1 className="text-xl font-bold mb-3 text-center" style={{ color: textColor }}>
                                {bioPage.title || 'Your Name'}
                            </h1>
                            <p className="text-xs opacity-70 mb-2 max-w-[240px] leading-relaxed font-medium mx-auto" style={{ color: textColor }}>
                                {bioPage.description || 'Welcome to my page.'}
                            </p>
                        </div>

                        {/* Social Icons with Dynamic Size */}
                        {Object.keys(socials).some(key => socials[key]) && (
                            <div className="flex flex-wrap justify-center gap-6 mb-8 px-4">
                                {Object.entries(socials).map(([key, value]) => {
                                    if (!value) return null;
                                    return (
                                        <a
                                            key={key}
                                            href={key === 'email' ? `mailto:${value}` : (key === 'phone' ? `tel:${value}` : value as string)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`transition-transform hover:scale-110 opacity-70 hover:opacity-100 p-2 ${glassEffect ? 'backdrop-blur-md bg-white/10 rounded-xl' : ''}`}
                                            style={{ color: textColor }}
                                        >
                                            <SocialIcon name={key} size={socialSize} />
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        {/* Instagram Feed Section (Priority) - Temporarily Disabled */}
                        {false && links.filter(l => l.type === 'instagram' && l.is_active !== false).length > 0 && (
                            <div className="w-full flex flex-col gap-4 mb-8 px-2">
                                <div className="flex items-center gap-2 px-4 mb-1">
                                    <div className="p-1.5 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-lg text-white">
                                        <Instagram className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-wider opacity-60">Instagram Feed</span>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {links.filter(l => l.type === 'instagram' && l.is_active !== false).map((link) => {
                                        const instaMatch = link.url.match(/(?:p|reels)\/([a-zA-Z0-9_-]+)/);
                                        if (!instaMatch) {
                                            // Fallback for profile URLs - show a nice follow card
                                            return (
                                                <a
                                                    key={link.id}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`p-6 rounded-2xl flex items-center justify-between group transition-all hover:scale-[1.02] shadow-lg ${glassEffect ? 'backdrop-blur-xl border border-white/20' : ''}`}
                                                    style={{
                                                        backgroundColor: glassEffect ? 'rgba(255, 255, 255, 0.1)' : buttonBgColor,
                                                        color: glassEffect ? '#ffffff' : buttonTextColor
                                                    }}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-0.5">
                                                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                                                <Instagram className="w-6 h-6 text-[#ee2a7b]" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-sm">Follow on Instagram</div>
                                                            <div className="text-[10px] opacity-60 font-bold">@{(link.url.split('instagram.com/')[1] || '').split('/')[0]}</div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white/20 p-2 rounded-full group-hover:bg-white group-hover:text-gray-900 transition-colors">
                                                        <PlusCircle className="w-4 h-4" />
                                                    </div>
                                                </a>
                                            );
                                        }
                                        return (
                                            <div key={link.id} className="w-full shadow-xl rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800 border-4 border-white/10">
                                                <iframe src={`https://www.instagram.com/p/${instaMatch[1]}/embed`} width="100%" height="480" frameBorder="0" scrolling="no" allowTransparency={true} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Other Links */}
                        <div className="w-full flex flex-col px-2" style={{ gap: buttonSpacing }}>
                            {links.filter(l => {
                                if (l.is_active === false || l.type === 'instagram') return false;
                                if (!searchQuery) return true;
                                const q = searchQuery.toLowerCase();
                                return l.title.toLowerCase().includes(q) || (l.url && l.url.toLowerCase().includes(q));
                            }).map((link) => {
                                if (link.type === 'text') {
                                    return (
                                        <div key={link.id} className="w-full py-4 text-center">
                                            <h2 className="text-lg font-black tracking-tight" style={{ color: textColor }}>{link.title}</h2>
                                        </div>
                                    );
                                }

                                if (link.type === 'youtube') {
                                    const videoId = link.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
                                    if (!videoId) return null;
                                    return (
                                        <div key={link.id} className="w-full rounded-2xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all">
                                            <iframe width="100%" height="180" src={`https://www.youtube.com/embed/${videoId}`} title={link.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                        </div>
                                    );
                                }

                                if (link.type === 'spotify' || (link.type === 'audio' && link.url.includes('spotify'))) {
                                    const match = link.url.match(/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
                                    if (!match) return null;
                                    return (
                                        <div key={link.id} className="w-full shadow-lg rounded-2xl overflow-hidden">
                                            <iframe src={`https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`} width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
                                        </div>
                                    );
                                }

                                if (link.type === 'audio' && link.url.includes('music.apple.com')) {
                                    const embedUrl = link.url.replace('music.apple.com', 'embed.music.apple.com');
                                    return (
                                        <div key={link.id} className="w-full shadow-lg rounded-2xl overflow-hidden">
                                            <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameBorder="0" height="175" style={{ width: '100%', maxWidth: '660px', overflow: 'hidden', borderRadius: '10px' }} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src={embedUrl} />
                                        </div>
                                    );
                                }


                                if (link.type === 'form') {
                                    return (
                                        <div key={link.id}
                                            className={`w-full p-6 rounded-2xl flex flex-col gap-4 shadow-lg ${glassEffect ? 'backdrop-blur-xl border border-white/20' : ''}`}
                                            style={{
                                                backgroundColor: glassEffect ? 'rgba(255, 255, 255, 0.1)' : buttonBgColor,
                                                color: glassEffect ? '#ffffff' : buttonTextColor
                                            }}
                                        >
                                            <h4 className="font-black text-sm">{link.title || 'Stay Updated'}</h4>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-white/30 outline-none placeholder:text-inherit/50"
                                                />
                                                <button className="bg-white text-gray-900 rounded-xl px-4 py-2 font-black text-xs hover:scale-105 active:scale-95 transition-transform">
                                                    <Send className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <motion.a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => {
                                            fetch('/api/bio/click', {
                                                method: 'POST',
                                                keepalive: true,
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ linkId: link.id })
                                            }).catch(err => console.error("Track click failed", err));
                                        }}
                                        className={`block w-full px-6 text-center text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${buttonClass} ${glassEffect ? 'backdrop-blur-xl border border-white/20' : ''}`}
                                        style={{
                                            backgroundColor: buttonStyle === 'border-2' ? 'transparent' : (glassEffect ? 'rgba(255, 255, 255, 0.15)' : buttonBgColor),
                                            color: buttonStyle === 'border-2' ? textColor : (glassEffect ? '#ffffff' : buttonTextColor),
                                            borderColor: buttonStyle === 'border-2' ? textColor : (glassEffect ? 'rgba(255, 255, 255, 0.3)' : 'transparent'),
                                            boxShadow: glassEffect ? 'none' : getShadowStyle(1),
                                            paddingTop: buttonPadding,
                                            paddingBottom: buttonPadding,
                                            textShadow: glassEffect ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                        {...getAnimationProps(link.animation)}
                                    >
                                        {link.title}
                                    </motion.a>
                                );
                            })}
                        </div>

                        <div className="flex-grow min-h-[40px]"></div>
                    </div>

                    {/* Footer Branding */}
                    <div className="mt-8 mb-4 flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity relative z-10">
                        <span className="text-[9px] font-bold tracking-widest uppercase">Made With</span>
                        <div className="flex items-center gap-1 font-black text-sm tracking-tight">
                            <Globe className="w-3 h-3" /> liinks.co
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // LAYOUT LOGIC
    if (variant === 'preview') {
        return content;
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:items-center md:justify-center p-0 md:bg-gray-100 md:dark:bg-gray-900 md:py-8">
            <div className="w-full flex-grow md:flex-grow-0 md:w-[400px] md:h-auto md:aspect-[9/19] md:max-h-[90vh] md:rounded-[2.5rem] md:shadow-2xl md:ring-8 md:ring-black/5 overflow-hidden" style={{ backgroundColor: bgColor }}>
                {content}
            </div>
        </div>
    );
}

function SocialIcon({ name, size = 20 }: { name: string, size?: number }) {
    const props = { style: { width: size, height: size }, strokeWidth: 1.5 };

    switch (name) {
        case 'email': return <Mail {...props} />;
        case 'phone': return <Phone {...props} />;
        case 'instagram': return <Instagram {...props} />;
        case 'twitter': return (
            <svg viewBox="0 0 24 24" style={{ width: size, height: size }} fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
        );
        case 'linkedin': return <Linkedin {...props} />;
        case 'facebook': return <Facebook {...props} />;
        case 'github': return <Github {...props} />;
        case 'youtube': return <Youtube {...props} />;
        case 'website': return <Globe {...props} />;
        case 'tiktok': return <Music {...props} />;
        default: return <Globe {...props} />;
    }
}
