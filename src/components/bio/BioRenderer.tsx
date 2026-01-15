"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { BioPage, BioLink } from "@/lib/db";
import {
    Instagram, Twitter, Github, Youtube, Globe, CheckCircle2,
    UserPlus, Share2, Search, Menu, X, QrCode, Copy,
    Facebook, Linkedin, Check, ChevronLeft, Mail, Phone, Music
} from "lucide-react";
import QrCodeDisplay from "../QrCodeDisplay";

interface BioRendererProps {
    bioPage: Partial<BioPage>;
    links: BioLink[];
    variant?: 'public' | 'preview';
}

export default function BioRenderer({ bioPage, links, variant = 'public' }: BioRendererProps) {
    const [showShare, setShowShare] = useState(false);
    const [viewMode, setViewMode] = useState<'share' | 'qr'>('share');
    const [isCopied, setIsCopied] = useState(false);

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

    const getAnimationProps = (animation?: string) => {
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

            <div
                className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col items-center relative"
                style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    fontFamily: fontFamily,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'local'
                }}
            >
                {/* IN-APP HEADER (New) */}
                <div className={`w-full px-6 py-6 flex items-center justify-between shrink-0 z-20 ${headerImage || headerColor ? 'text-white mix-blend-difference' : ''}`} style={{ color: headerImage || headerColor ? undefined : textColor }}>
                    <div className="flex gap-4">
                        <UserPlus className="w-5 h-5 opacity-80 cursor-pointer hover:scale-110 transition-transform" />
                        <Share2 onClick={() => setShowShare(true)} className="w-5 h-5 opacity-100 cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex gap-4">
                        <Search className="w-5 h-5 opacity-80" />
                        <Menu className="w-5 h-5 opacity-80" />
                    </div>
                </div>

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
                                    <div className="absolute bottom-1 right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow-lg ring-1 ring-black/5">
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
                        <h1 className="text-xl font-bold mb-3 flex items-center justify-center gap-1.5" style={{ color: textColor }}>
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
                                        className="transition-transform hover:scale-110 opacity-70 hover:opacity-100"
                                        style={{ color: textColor }}
                                    >
                                        <SocialIcon name={key} size={socialSize} />
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {/* Links */}
                    <div className="w-full flex flex-col px-2" style={{ gap: buttonSpacing }}>
                        {links.filter(l => l.is_active !== false).map((link) => {
                            if (link.type === 'youtube') {
                                const videoId = link.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
                                if (!videoId) return null;
                                return (
                                    <div key={link.id} className="w-full rounded-2xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all">
                                        <iframe width="100%" height="180" src={`https://www.youtube.com/embed/${videoId}`} title={link.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                    </div>
                                );
                            }

                            if (link.type === 'spotify') {
                                const match = link.url.match(/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
                                if (!match) return null;
                                return (
                                    <div key={link.id} className="w-full shadow-lg rounded-2xl overflow-hidden">
                                        <iframe src={`https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`} width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
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
                                    className={`block w-full px-6 text-center text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${buttonClass}`}
                                    style={{
                                        backgroundColor: buttonStyle === 'border-2' ? 'transparent' : buttonBgColor,
                                        color: buttonStyle === 'border-2' ? textColor : buttonTextColor,
                                        borderColor: buttonStyle === 'border-2' ? textColor : 'transparent',
                                        boxShadow: getShadowStyle(1),
                                        paddingTop: buttonPadding,
                                        paddingBottom: buttonPadding
                                    }}
                                    {...getAnimationProps(link.animation)}
                                >
                                    {link.title}
                                </motion.a>
                            );
                        })}
                    </div>

                    <div className="flex-grow min-h-[40px]"></div>

                    {/* Footer Branding */}
                    <div className="mt-8 mb-4 flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
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
        <div className="min-h-screen w-full flex items-center justify-center p-0 md:bg-gray-100 md:dark:bg-gray-900 md:py-8">
            <div className="w-full h-full md:w-[400px] md:h-auto md:aspect-[9/19] md:max-h-[90vh] md:rounded-[2.5rem] md:shadow-2xl md:ring-8 md:ring-black/5 overflow-hidden bg-white">
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
