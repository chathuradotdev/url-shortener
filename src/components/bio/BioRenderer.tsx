import { BioPage, BioLink } from "@/lib/db";

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

    const buttonClass = buttonStyle === 'rounded-full' ? 'rounded-full' : buttonStyle === 'rounded-lg' ? 'rounded-lg' : 'rounded-none';

    return (
        <div
            className="w-full min-h-full overflow-y-auto overflow-x-hidden no-scrollbar"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            <div className="pt-12 pb-8 px-6 flex flex-col items-center max-w-md mx-auto min-h-screen">
                {/* Avatar */}
                {bioPage.avatar_url ? (
                    <img
                        src={bioPage.avatar_url}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-opacity-20 border-gray-500 shadow-md"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-3xl font-bold text-gray-400">
                        {bioPage.title?.charAt(0) || '?'}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-xl font-bold text-center mb-1">{bioPage.title || 'Your Name'}</h1>

                {/* Description */}
                <p className="text-sm text-center opacity-80 mb-8 max-w-xs leading-relaxed">{bioPage.description}</p>

                {/* Links */}
                <div className="w-full space-y-4 flex-grow">
                    {links.filter(l => l.is_active !== false).map((link) => {
                        if (link.type === 'youtube') {
                            const videoId = link.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2];
                            if (!videoId) return null;
                            return (
                                <div key={link.id} className="w-full rounded-xl overflow-hidden shadow-lg mb-4">
                                    <iframe
                                        width="100%"
                                        height="200"
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
                            // Support track, album, playlist, episode
                            const match = link.url.match(/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
                            if (!match) return null;
                            const type = match[1];
                            const id = match[2];
                            return (
                                <div key={link.id} className="w-full mb-4">
                                    <iframe
                                        style={{ borderRadius: '12px' }}
                                        src={`https://open.spotify.com/embed/${type}/${id}?utm_source=generator`}
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
                                className={`block w-full py-4 px-6 text-center text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md ${buttonClass} mb-3`}
                                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                            >
                                {link.icon && <span className="mr-2">{link.icon}</span>}
                                {link.title}
                            </a>
                        );
                    })}
                    {links.length === 0 && (
                        <div className="text-center text-sm opacity-50 py-10">
                            No links available
                        </div>
                    )}
                </div>

                {/* Footer Logo (Branding) */}
                <div className="mt-12 mb-6 text-[10px] font-bold opacity-30 uppercase tracking-widest">
                    poweered by ShortLink
                </div>
            </div>
        </div>
    );
}
