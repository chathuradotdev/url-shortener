import { BioPage, BioLink } from "@/lib/db";
import { Instagram, Twitter, Github, Youtube, Globe, CheckCircle2 } from "lucide-react";

interface BioRendererProps {
    bioPage: Partial<BioPage>;
    links: BioLink[];
}

export default function BioRenderer({ bioPage, links }: BioRendererProps) {
    const theme = bioPage.theme || {};
    const bgColor = theme.backgroundColor || '#ffffff';
    const textColor = theme.textColor || '#000000';
    const buttonBgColor = theme.buttonBgColor || '#f3f4f6';
    const buttonTextColor = theme.buttonTextColor || '#1f2937';
    const buttonStyle = theme.buttonStyle || 'rounded-full';
    const fontFamily = theme.fontFamily || 'Inter';
    const socials = theme.socials || {};
    const headerImage = theme.headerImage;
    const headerColor = theme.headerColor;
    const cardMode = theme.cardMode;
    const backgroundImage = theme.backgroundImage;

    const buttonClass =
        buttonStyle === 'rounded-full' ? 'rounded-full' :
            buttonStyle === 'rounded-lg' ? 'rounded-lg' :
                buttonStyle === 'rounded-none' ? 'rounded-none' :
                    'border-2 bg-transparent';

    return (
        <div
            className="w-full min-h-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col items-center relative"
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
            {/* Header Section */}
            {headerImage ? (
                <div className="w-full h-48 shrink-0 relative overflow-hidden">
                    <img src={headerImage} alt="header" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>
            ) : headerColor ? (
                <div className="w-full h-32 shrink-0" style={{ backgroundColor: headerColor }}></div>
            ) : (
                <div className="w-full h-12"></div>
            )}

            {/* Content Container */}
            <div className={`w-full flex flex-col items-center px-6 pb-12 relative flex-grow max-w-md mx-auto ${(headerImage || headerColor) ? '-mt-16' : ''}`}>

                {/* Background Card / Glassmorphism */}
                {(cardMode || (!cardMode && (headerImage || headerColor || backgroundImage))) && (
                    <div className={`absolute inset-x-0 top-0 bottom-0 -z-10 ${cardMode
                            ? 'bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 mx-2'
                            : 'bg-white/94 dark:bg-gray-950/80 backdrop-blur-2xl rounded-t-[3rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.15)]'
                        }`}></div>
                )}

                {/* Avatar with Overlap */}
                <div className={`${cardMode ? 'pt-8' : 'pt-6'}`}>
                    {bioPage.avatar_url ? (
                        <div className="relative group mb-4">
                            <img
                                src={bioPage.avatar_url}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl transition-all duration-500 group-hover:scale-105"
                            />
                            {theme.isVerified && (
                                <div className="absolute bottom-1 right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow-lg ring-1 ring-black/5">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 flex items-center justify-center text-3xl font-black text-gray-300 border-4 border-white dark:border-gray-800 shadow-lg">
                            {bioPage.title?.charAt(0) || '?'}
                        </div>
                    )}
                </div>

                {/* Title & Description */}
                <div className="text-center px-4 w-full">
                    <h1 className="text-2xl font-black mb-1 flex items-center justify-center gap-1.5" style={{ color: cardMode || (headerImage || headerColor || backgroundImage) ? undefined : textColor }}>
                        {bioPage.title || 'Your Name'}
                        {!bioPage.avatar_url && theme.isVerified && (
                            <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                        )}
                    </h1>
                    <p className="text-sm opacity-70 mb-8 max-w-xs leading-relaxed font-medium mx-auto" style={{ color: cardMode || (headerImage || headerColor || backgroundImage) ? undefined : textColor }}>
                        {bioPage.description}
                    </p>
                </div>

                {/* Social Icons */}
                {Object.keys(socials).some(key => socials[key]) && (
                    <div className="flex flex-wrap justify-center gap-5 mb-8 px-4">
                        {socials.instagram && (
                            <a href={socials.instagram} target="_blank" className="p-2 transition-all hover:scale-125 hover:rotate-6 active:scale-95 opacity-80 hover:opacity-100">
                                <Instagram className="w-6 h-6" />
                            </a>
                        )}
                        {socials.twitter && (
                            <a href={socials.twitter} target="_blank" className="p-2 transition-all hover:scale-125 hover:-rotate-6 active:scale-95 opacity-80 hover:opacity-100">
                                <Twitter className="w-6 h-6" />
                            </a>
                        )}
                        {socials.github && (
                            <a href={socials.github} target="_blank" className="p-2 transition-all hover:scale-125 hover:rotate-6 active:scale-95 opacity-80 hover:opacity-100">
                                <Github className="w-6 h-6" />
                            </a>
                        )}
                        {socials.youtube && (
                            <a href={socials.youtube} target="_blank" className="p-2 transition-all hover:scale-125 hover:-rotate-6 active:scale-95 opacity-80 hover:opacity-100">
                                <Youtube className="w-6 h-6" />
                            </a>
                        )}
                    </div>
                )}

                {/* Links */}
                <div className="w-full space-y-4 px-2">
                    {links.filter(l => l.is_active !== false).map((link) => {
                        if (link.type === 'youtube') {
                            const videoId = link.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
                            if (!videoId) return null;
                            return (
                                <div key={link.id} className="w-full rounded-3xl overflow-hidden shadow-2xl mb-4 transform hover:scale-[1.02] transition-all border-4 border-white dark:border-gray-800">
                                    <iframe
                                        width="100%"
                                        height="180"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={link.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            );
                        }

                        if (link.type === 'spotify') {
                            const match = link.url.match(/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
                            if (!match) return null;
                            const type = match[1];
                            const id = match[2];
                            return (
                                <div key={link.id} className="w-full mb-4 transform hover:scale-[1.02] transition-all shadow-xl rounded-3xl overflow-hidden bg-black/5">
                                    <iframe
                                        style={{ borderRadius: '1.5rem' }}
                                        src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`}
                                        width="100%"
                                        height="152"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                    />
                                </div>
                            );
                        }

                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full py-4 px-6 text-center text-base font-black transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg hover:shadow-xl ${buttonClass} mb-3`}
                                style={{
                                    backgroundColor: buttonStyle === 'border-2' ? 'transparent' : buttonBgColor,
                                    color: buttonStyle === 'border-2' ? textColor : buttonTextColor,
                                    borderColor: textColor + '44'
                                }}
                            >
                                {link.title}
                            </a>
                        );
                    })}
                </div>

                <div className="flex-grow"></div>

                {/* Branding */}
                <div className="mt-16 mb-4 flex items-center gap-2 opacity-20 text-[10px] uppercase font-black tracking-widest pointer-events-none">
                    <Globe className="w-3 h-3" /> Built with ShortLink
                </div>
            </div>
        </div>
    );
}
