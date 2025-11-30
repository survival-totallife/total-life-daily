"use client";

import { JSX, ReactNode, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ArticleEngagement } from "./ArticleEngagement";
import { CommentsSection } from "./CommentsSection";

interface ArticleContentProps {
    content: string;
    articleId: number;
    articleSlug: string;
    articleTitle: string;
}

interface ChildrenProps {
    children?: ReactNode;
}

interface AnchorProps extends ChildrenProps {
    href?: string;
}

interface CodeProps extends ChildrenProps {
    className?: string;
}

interface ImageProps {
    src?: string | Blob;
    alt?: string;
}

// Medium-style markdown components with elegant typography
const markdownComponents = {
    h1: ({ children }: ChildrenProps) => (
        <h1 className="text-[32px] sm:text-[40px] font-bold text-gray-900 mt-14 mb-6 leading-[1.2] tracking-tight font-serif">
            {children}
        </h1>
    ),
    h2: ({ children }: ChildrenProps) => (
        <h2 className="text-[26px] sm:text-[32px] font-bold text-gray-900 mt-12 mb-4 leading-[1.25] tracking-tight font-serif">
            {children}
        </h2>
    ),
    h3: ({ children }: ChildrenProps) => (
        <h3 className="text-[22px] sm:text-[26px] font-semibold text-gray-900 mt-10 mb-4 leading-[1.3] font-serif">
            {children}
        </h3>
    ),
    h4: ({ children }: ChildrenProps) => (
        <h4 className="text-[18px] sm:text-[20px] font-semibold text-gray-900 mt-8 mb-3 leading-[1.4]">
            {children}
        </h4>
    ),
    h5: ({ children }: ChildrenProps) => (
        <h5 className="text-[16px] sm:text-[18px] font-semibold text-gray-900 mt-6 mb-3">
            {children}
        </h5>
    ),
    h6: ({ children }: ChildrenProps) => (
        <h6 className="text-[14px] sm:text-[16px] font-semibold text-gray-600 uppercase tracking-wide mt-6 mb-3">
            {children}
        </h6>
    ),
    p: ({ children }: ChildrenProps) => (
        <p className="text-[18px] sm:text-[21px] text-gray-700 leading-[1.8] mb-8 font-[georgia,serif]">
            {children}
        </p>
    ),
    a: ({ href, children }: AnchorProps) => (
        <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-gray-900 underline decoration-[#F97356] decoration-2 underline-offset-2 hover:decoration-[#E85A3D] hover:bg-orange-50 transition-all"
        >
            {children}
        </a>
    ),
    strong: ({ children }: ChildrenProps) => (
        <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }: ChildrenProps) => (
        <em className="italic text-gray-800">{children}</em>
    ),
    ul: ({ children }: ChildrenProps) => (
        <ul className="my-8 space-y-4 text-[18px] sm:text-[21px] text-gray-700 font-[georgia,serif]">
            {children}
        </ul>
    ),
    ol: ({ children }: ChildrenProps) => (
        <ol className="my-8 space-y-4 text-[18px] sm:text-[21px] text-gray-700 font-[georgia,serif] list-decimal list-inside">
            {children}
        </ol>
    ),
    li: ({ children }: ChildrenProps) => (
        <li className="leading-[1.8] pl-2 relative before:content-['•'] before:absolute before:-left-4 before:text-[#F97356] before:font-bold">
            <span className="pl-2">{children}</span>
        </li>
    ),
    blockquote: ({ children }: ChildrenProps) => (
        <blockquote className="my-10 pl-6 border-l-[3px] border-gray-900">
            <div className="text-[24px] sm:text-[30px] text-gray-900 italic leading-[1.5] font-[georgia,serif]">
                {children}
            </div>
        </blockquote>
    ),
    code: ({ children, className }: CodeProps) => {
        const isInline = !className;

        if (isInline) {
            return (
                <code className="bg-gray-100 text-[#E85A3D] px-2 py-1 rounded text-[16px] font-mono">
                    {children}
                </code>
            );
        }

        return (
            <code
                className="block bg-gray-900 text-gray-100 p-5 rounded-lg overflow-x-auto text-[14px] font-mono leading-relaxed">
                {children}
            </code>
        );
    },
    pre: ({ children }: ChildrenProps) => (
        <pre className="my-8 bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto text-[14px] shadow-lg">
            {children}
        </pre>
    ),
    hr: () => (
        <div className="my-14 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"/>
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"/>
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"/>
        </div>
    ),
    img: ({ src, alt }: ImageProps) => (
        <figure className="my-12 -mx-4 sm:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={typeof src === 'string' ? src : undefined}
                alt={alt || "Article image"}
                className="w-full sm:rounded-lg"
                loading="lazy"
            />
            {alt && (
                <figcaption className="mt-4 text-center text-[14px] text-gray-500 px-4">
                    {alt}
                </figcaption>
            )}
        </figure>
    ),
    table: ({ children }: ChildrenProps) => (
        <div className="my-8 overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full text-[16px]">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }: ChildrenProps) => (
        <thead className="border-b-2 border-gray-200">{children}</thead>
    ),
    tbody: ({ children }: ChildrenProps) => (
        <tbody className="divide-y divide-gray-100">{children}</tbody>
    ),
    tr: ({ children }: ChildrenProps) => (
        <tr>{children}</tr>
    ),
    th: ({ children }: ChildrenProps) => (
        <th className="px-4 py-4 text-left font-semibold text-gray-900">
            {children}
        </th>
    ),
    td: ({ children }: ChildrenProps) => (
        <td className="px-4 py-4 text-gray-700">{children}</td>
    ),
};

// Process content to handle PubMed citations
function processCitations(content: string): string {
    return content.replace(
        /\[Source: (\d+)\]/g,
        '[[Source: $1]](https://pubmed.ncbi.nlm.nih.gov/$1)'
    );
}

export function ArticleContent({ content, articleId, articleSlug, articleTitle }: ArticleContentProps): JSX.Element {
    const processedContent = useMemo(() => processCitations(content), [content]);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);

    return (
        <section className="relative">
            {/* Main Content */}
            <motion.div
                className="max-w-[680px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <article>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={markdownComponents}
                    >
                        {processedContent}
                    </ReactMarkdown>
                </article>

                {/* Tags Section */}
                <motion.div
                    className="mt-14 pt-8 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                >
                    <div className="flex flex-wrap gap-2">
                        {["Health", "Wellness", "Longevity", "Science"].map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full cursor-pointer transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Engagement Bar */}
                <motion.div
                    className="mt-8 py-4 border-t border-b border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                >
                    <ArticleEngagement
                        articleId={articleId}
                        articleSlug={articleSlug}
                        articleTitle={articleTitle}
                        onCommentsClick={() => setIsCommentsOpen(!isCommentsOpen)}
                        commentsCount={commentsCount}
                    />
                </motion.div>

                {/* Comments Section (Expandable) */}
                <CommentsSection
                    articleId={articleId}
                    isOpen={isCommentsOpen}
                    onToggle={() => setIsCommentsOpen(!isCommentsOpen)}
                    onCommentsCountChange={setCommentsCount}
                />

                {/* Author Card */}
                <motion.div
                    className="mt-10 p-6 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F97356] to-[#E85A3D] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            TL
                        </div>
                        <div className="flex-1">
                            <div>
                                <h4 className="font-semibold text-gray-900 text-lg">Total Life Daily</h4>
                                <p className="text-gray-500 text-sm mt-0.5">Your guide to happy, healthy aging</p>
                            </div>
                            <p className="mt-3 text-gray-600 text-[15px] leading-relaxed">
                                Science-backed content built on Total Life&apos;s five essential pillars to help
                                everyone live longer, brighter, and better.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                    className="mt-10 mb-16 p-5 bg-amber-50 border border-amber-200 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                >
                    <p className="text-sm text-amber-800 leading-relaxed">
                        <strong>Disclaimer:</strong> The information provided in this article is for educational
                        purposes only and should not be considered medical advice.
                        Please consult with a healthcare professional before making any changes to your health routine.
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
}
