import { JSX } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import type { ArticleCategory } from "@/types/article";
import type { ArticleResponse } from "@/lib/api/articles";

interface ArticleHeroProps {
    article: ArticleResponse;
}

// Category configuration
const categoryConfig: Record<ArticleCategory, {
    label: string;
    color: string;
    hoverColor: string;
}> = {
    nourishment: {
        label: "Nourishment",
        color: "text-emerald-600",
        hoverColor: "hover:text-emerald-700",
    },
    restoration: {
        label: "Restoration",
        color: "text-blue-600",
        hoverColor: "hover:text-blue-700",
    },
    mindset: {
        label: "Mindset",
        color: "text-purple-600",
        hoverColor: "hover:text-purple-700",
    },
    relationships: {
        label: "Relationships",
        color: "text-rose-600",
        hoverColor: "hover:text-rose-700",
    },
    vitality: {
        label: "Vitality",
        color: "text-orange-600",
        hoverColor: "hover:text-orange-700",
    },
};

// Estimate read time based on content length (average 200 words per minute)
function estimateReadTime(content: string): number {
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
}

// Format date
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function ArticleHero({ article }: ArticleHeroProps): JSX.Element {
    const category = article.category as ArticleCategory;
    const config = categoryConfig[category] || categoryConfig.nourishment;
    const readTime = estimateReadTime(article.content);

    return (
        <article className="relative">
            {/* Top Navigation Bar */}
            <motion.div
                className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4"/>
                        <span className="hidden sm:inline">Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Bookmark">
                            <Bookmark className="w-5 h-5"/>
                        </button>
                        <button
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Share">
                            <Share2 className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Article Header */}
            <header className="max-w-[680px] mx-auto px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-10">
                {/* Category */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Link
                        to={`/category/${category}`}
                        className={`inline-block text-sm font-medium ${config.color} ${config.hoverColor} transition-colors`}
                    >
                        {config.label}
                    </Link>
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="mt-4 text-[32px] sm:text-[42px] lg:text-[46px] font-bold text-gray-900 leading-[1.15] tracking-tight font-serif"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {article.title}
                </motion.h1>

                {/* Excerpt */}
                {article.excerpt && (
                    <motion.p
                        className="mt-5 text-xl sm:text-[22px] text-gray-500 leading-relaxed font-light"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {article.excerpt}
                    </motion.p>
                )}

                {/* Author & Meta */}
                <motion.div
                    className="mt-8 flex items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    {/* Author Avatar */}
                    <div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F97356] to-[#E85A3D] flex items-center justify-center text-white font-semibold text-lg">
                        TL
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">Total Life Daily</span>
                            <span className="text-emerald-600 text-sm">✓</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                            <span>{readTime} min read</span>
                            <span>·</span>
                            <span>{formatDate(article.published_at)}</span>
                        </div>
                    </div>

                    {/* Follow Button */}
                    <button
                        className="hidden sm:block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-full transition-colors">
                        Follow
                    </button>
                </motion.div>
            </header>

            {/* Featured Image - Full Width */}
            {article.featured_image && (
                <motion.figure
                    className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className="relative aspect-[2/1] sm:aspect-[21/9] rounded-lg sm:rounded-xl overflow-hidden">
                        <img
                            src={article.featured_image.url}
                            alt={article.featured_image.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="eager"
                        />
                    </div>
                    {article.featured_image.alt && (
                        <figcaption className="mt-3 text-center text-sm text-gray-500">
                            {article.featured_image.alt}
                        </figcaption>
                    )}
                </motion.figure>
            )}
        </article>
    );
}
