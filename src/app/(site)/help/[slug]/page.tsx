import { knowledgeBase } from "@/data/knowledgebase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar, ArrowLeft } from "lucide-react";
import { TableOfContents } from "@/components/TableOfContents";
import { ArticleFeedback } from "@/components/ArticleFeedback";

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = knowledgeBase.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    // Parse headings for TOC
    const headings: { id: string; text: string; level: number }[] = [];
    const lines = article.content.split('\n');

    // Simple parser to extract headings
    lines.forEach(line => {
        const match = line.match(/^(#{1,3})\s+(.*)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2];
            const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            headings.push({ id, text, level });
        }
    });

    const relatedArticles = article.relatedIds
        ? knowledgeBase.filter(a => article.relatedIds?.includes(a.id))
        : [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
                <Link href="/help" className="hover:text-gray-900 transition-colors flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Help
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium truncate max-w-[200px]">{article.title}</span>
            </nav>

            <div className="grid lg:grid-cols-[1fr_250px] gap-12">
                {/* Main Content Column */}
                <article className="min-w-0">
                    <header className="mb-10 space-y-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 text-4xl mb-2">
                            {article.icon}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-8">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                                <Calendar className="w-4 h-4" />
                                Updated {article.lastUpdated}
                            </span>
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                {article.category}
                            </span>
                        </div>
                    </header>

                    {/* Content using Custom Renderer */}
                    <div className="prose prose-gray prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700">
                        <MarkdownRenderer content={article.content} />
                    </div>

                    {/* Feedback Component */}
                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <ArticleFeedback />
                    </div>

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <div className="mt-12 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900">Related Articles</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {relatedArticles.map(rel => (
                                    <Link key={rel.id} href={`/help/${rel.slug}`} className="block p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                                        <div className="text-2xl mb-2">{rel.icon}</div>
                                        <div className="font-semibold text-gray-900 mb-1">{rel.title}</div>
                                        <div className="text-xs text-gray-500 line-clamp-2">{rel.description}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>

                {/* Sidebar Column (TOC) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24">
                        <TableOfContents headings={headings} />
                    </div>
                </aside>
            </div>
        </div>
    );
}

// Markdown Renderer with IDs for TOC
function MarkdownRenderer({ content }: { content: string }) {
    const lines = content.split('\n');
    return (
        <div className="space-y-6 text-gray-600 leading-7">
            {lines.map((line, i) => {
                // Headings
                const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
                if (headingMatch) {
                    const level = headingMatch[1].length;
                    const text = headingMatch[2];
                    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

                    if (level === 1) return <h1 key={i} id={id} className="text-3xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">{text}</h1>;
                    if (level === 2) return <h2 key={i} id={id} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{text}</h2>;
                    if (level === 3) return <h3 key={i} id={id} className="text-xl font-bold text-gray-800 mt-8 mb-3">{text}</h3>;
                }

                // Lists
                if (line.startsWith('- ')) return <li key={i} className="list-disc list-inside ml-4 marker:text-gray-300">{line.replace('- ', '')}</li>;
                if (line.match(/^\d+\. /)) return <li key={i} className="list-decimal list-inside ml-4 marker:text-gray-400 font-medium">{line.replace(/^\d+\. /, '')}</li>;

                // Blockquotes
                if (line.startsWith('> ')) return (
                    <div key={i} className="border-l-4 border-blue-500 bg-blue-50/50 pl-4 py-4 my-6 rounded-r-lg text-blue-900 italic relative">
                        {line.replace('> ', '')}
                    </div>
                );

                // Code Blocks (Simple)
                if (line.startsWith('```')) return null; // Skip fence
                // Note: Proper multi-line code block handling requires state, which simple map doesn't do easily.
                // For this demo, let's assume code is single line or simple wrapped for now.
                // Or better: render simple PRE if it doesn't match above? 

                if (line.trim() === '') return <br key={i} className="h-2 block" />;

                // Paragraphs with inline parsing
                const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
                return (
                    <div key={i}>
                        {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) return <strong key={j} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>;
                            if (part.startsWith('`') && part.endsWith('`')) return <code key={j} className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-sm border border-gray-200">{part.slice(1, -1)}</code>;
                            return part;
                        })}
                    </div>
                );
            })}
        </div>
    );
}

