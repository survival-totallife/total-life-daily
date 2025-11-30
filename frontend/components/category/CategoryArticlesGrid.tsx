"use client";

import { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/common";
import type { ArticleCategory } from "@/types/article";

interface Article {
    slug: string;
    title: string;
    excerpt: string;
    category: ArticleCategory;
    publishedAt: string;
    readTimeMinutes: number;
    featuredImage?: { url: string; alt: string };
}

interface CategoryConfig {
    label: string;
    color: string;
    bgColor: string;
    lightBg: string;
}

interface CategoryArticlesGridProps {
    articles: Article[];
    config: CategoryConfig;
}

export function CategoryArticlesGrid({ articles, config }: CategoryArticlesGridProps): JSX.Element {
    return (
        <section className="py-12 lg:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal animation="fadeUp" delay={0.1}>
                    <div className="mb-8">
                        <h2 className={`text-2xl font-bold ${config.color}`}>
                            Latest in {config.label}
                        </h2>
                        <p className="text-gray-600 mt-2">
                            {articles.length} article{articles.length !== 1 ? 's' : ''} to explore
                        </p>
                    </div>
                </ScrollReveal>

                <StaggerContainer
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    staggerDelay={0.1}
                >
                    {articles.map((article) => (
                        <StaggerItem key={article.slug} animation="fadeUp">
                            <Link
                                href={`/blog/${article.slug}`}
                                className="group block h-full"
                            >
                                <article
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        {article.featuredImage ? (
                                            <Image
                                                src={article.featuredImage.url}
                                                alt={article.featuredImage.alt}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className={`absolute inset-0 bg-gradient-to-br ${config.lightBg}`}/>
                                        )}
                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span
                                                className={`px-3 py-1 ${config.bgColor} text-white text-xs font-medium rounded-full`}>
                                                {config.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                            <time dateTime={article.publishedAt}>
                                                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </time>
                                            <span>•</span>
                                            <span>{article.readTimeMinutes} min read</span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#F97356] transition-colors mb-3 line-clamp-2">
                                            {article.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                                            {article.excerpt}
                                        </p>

                                        <span className="text-sm text-[#F97356] font-medium group-hover:underline">
                                            Read article →
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {/* Load More Button (placeholder for pagination) */}
                {articles.length >= 4 && (
                    <ScrollReveal animation="fadeUp" delay={0.3}>
                        <div className="text-center mt-12">
                            <motion.button
                                className={`px-8 py-3 ${config.bgColor} text-white font-medium rounded-full hover:opacity-90 transition-opacity`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Load More Articles
                            </motion.button>
                        </div>
                    </ScrollReveal>
                )}
            </div>
        </section>
    );
}
