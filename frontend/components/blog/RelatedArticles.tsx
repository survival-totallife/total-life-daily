"use client";

import { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ArticleCategory } from "@/types/article";
import type { ArticlePreview } from "@/lib/api/articles";

interface RelatedArticlesProps {
    articles: ArticlePreview[];
    category: ArticleCategory;
}

// Category configuration
const categoryConfig: Record<ArticleCategory, {
    label: string;
    color: string;
}> = {
    nourishment: {
        label: "Nourishment",
        color: "text-emerald-600",
    },
    restoration: {
        label: "Restoration",
        color: "text-blue-600",
    },
    mindset: {
        label: "Mindset",
        color: "text-purple-600",
    },
    relationships: {
        label: "Relationships",
        color: "text-rose-600",
    },
    vitality: {
        label: "Vitality",
        color: "text-orange-600",
    },
};

// Format date
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export function RelatedArticles({ articles, category }: RelatedArticlesProps): JSX.Element {
    const config = categoryConfig[category] || categoryConfig.nourishment;

    if (articles.length === 0) return <></>;

    return (
        <section className="border-t border-gray-200 bg-gray-50">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                {/* Section Header - Medium Style */}
                <motion.div
                    className="flex items-center justify-between mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">More from Total Life
                            Daily</p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
                            Recommended in <span className={config.color}>{config.label}</span>
                        </h2>
                    </div>
                    <Link
                        href={`/category/${category}`}
                        className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        See all
                        <ChevronRight className="w-4 h-4"/>
                    </Link>
                </motion.div>

                {/* Articles Grid - Medium Style Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <motion.article
                            key={article.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={`/blog/${article.slug}`} className="group block">
                                {/* Image */}
                                <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                                    {article.featured_image ? (
                                        <Image
                                            src={article.featured_image.url}
                                            alt={article.featured_image.alt}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"/>
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    {/* Author Row */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F97356] to-[#E85A3D] flex items-center justify-center text-white text-[10px] font-semibold">
                                            TL
                                        </div>
                                        <span className="text-sm text-gray-700">Total Life Daily</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-snug mb-2 line-clamp-2 font-serif">
                                        {article.title}
                                    </h3>

                                    {/* Excerpt */}
                                    {article.excerpt && (
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    )}

                                    {/* Meta */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>{formatDate(article.published_at)}</span>
                                        <span>·</span>
                                        <span className={config.color}>{config.label}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                {/* Mobile View All Link */}
                <motion.div
                    className="mt-10 text-center sm:hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link
                        href={`/category/${category}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600"
                    >
                        See all {config.label} articles
                        <ChevronRight className="w-4 h-4"/>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
