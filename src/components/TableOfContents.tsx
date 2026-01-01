"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
    headings: { id: string; text: string; level: number }[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">On this page</h4>
            <nav className="flex flex-col space-y-1">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                            setActiveId(heading.id);
                        }}
                        className={cn(
                            "text-sm py-1 pl-4 border-l-2 transition-all hover:text-blue-600 block truncate",
                            activeId === heading.id
                                ? "border-blue-600 text-blue-600 font-medium"
                                : "border-gray-100 text-gray-500 hover:border-gray-300"
                        )}
                        style={{ marginLeft: (heading.level - 1) * 8 }}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
