"use client";
import React from 'react';

interface VideoWidgetProps {
    link: {
        id: string;
        url: string;
        title?: string;
    };
}

export default function VideoWidget({ link }: VideoWidgetProps) {
    const url = link.url || '';

    let embedUrl = null;
    let type = 'unknown';

    // YouTube
    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    if (ytMatch && ytMatch[2].length === 11) {
        type = 'youtube';
        embedUrl = `https://www.youtube.com/embed/${ytMatch[2]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo.com\/)(\d+)/);
    if (!embedUrl && vimeoMatch) {
        type = 'vimeo';
        embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`;
    }

    // TikTok
    const tiktokMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
    if (!embedUrl && tiktokMatch) {
        type = 'tiktok';
        embedUrl = `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
    }

    if (!embedUrl) {
        // Fallback for invalid URLs? Or just don't render?
        // Let's render a place holder in editor, but nothing in public if invalid?
        // Actually, returning null is safer for public view.
        return null;
    }

    if (type === 'tiktok') {
        return (
            <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-black">
                <iframe
                    src={embedUrl}
                    className="w-full aspect-[9/16]"
                    style={{ minHeight: '500px' }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={link.title || "TikTok Video"}
                ></iframe>
            </div>
        );
    }

    return (
        <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-black">
            <iframe
                src={embedUrl}
                className="w-full aspect-video"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={link.title || "Video"}
            ></iframe>
        </div>
    );
}
