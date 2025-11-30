"use client";

import { JSX, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { ArticleCategory } from "@/types/article";
import { ScrollReveal } from "@/components/common";

interface CategoryArticle {
    slug: string;
    title: string;
    category: ArticleCategory;
    featuredImage?: {
        url: string;
        alt: string;
    };
}

interface CategorySectionProps {
    articlesByCategory: Record<ArticleCategory, CategoryArticle[]>;
}

const categoryConfig: Record<ArticleCategory, { label: string; color: string; bgColor: string; hoverColor: string }> = {
    nourishment: {
        label: "Nourishment",
        color: "text-emerald-600",
        bgColor: "bg-emerald-600",
        hoverColor: "hover:bg-emerald-50",
    },
    restoration: {
        label: "Restoration",
        color: "text-blue-600",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-50",
    },
    mindset: {
        label: "Mindset",
        color: "text-purple-600",
        bgColor: "bg-purple-600",
        hoverColor: "hover:bg-purple-50",
    },
    relationships: {
        label: "Relationships",
        color: "text-rose-600",
        bgColor: "bg-rose-600",
        hoverColor: "hover:bg-rose-50",
    },
    vitality: {
        label: "Vitality",
        color: "text-orange-600",
        bgColor: "bg-orange-600",
        hoverColor: "hover:bg-orange-50",
    },
};

const categories: ArticleCategory[] = ["nourishment", "restoration", "mindset", "relationships", "vitality"];

export function CategorySection({ articlesByCategory }: CategorySectionProps): JSX.Element {
    const [activeCategory, setActiveCategory] = useState<ArticleCategory>("nourishment");
    const config = categoryConfig[activeCategory];
    const articles = articlesByCategory[activeCategory] || [];

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Category Tabs */}
                <ScrollReveal animation="fadeUp" delay={0.1}>
                    <div className="mb-10">
                        <div className="text-center mb-4">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                Browse by Category
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 lg:gap-4">
                            {categories.map((category, index) => {
                                const catConfig = categoryConfig[category];
                                const isActive = activeCategory === category;
                                return (
                                    <motion.button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                                            isActive
                                                ? `${catConfig.bgColor} text-white`
                                                : `bg-white text-gray-600 border border-gray-200 ${catConfig.hoverColor}`
                                        }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 + 0.2 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {catConfig.label}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Category Title */}
                <AnimatePresence mode="wait">
                    <motion.h3
                        key={activeCategory}
                        className={`text-2xl font-bold ${config.color} mb-8`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {config.label}
                    </motion.h3>
                </AnimatePresence>

                {/* Articles Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        className="grid md:grid-cols-2 gap-6 lg:gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {articles.slice(0, 2).map((article, index) => (
                            <motion.div
                                key={article.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
                            >
                                <Link
                                    href={`/blog/${article.slug}`}
                                    className="group block"
                                >
                                    <article
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                                        {/* Image */}
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            {article.featuredImage ? (
                                                <Image
                                                    src={article.featuredImage.url}
                                                    alt={article.featuredImage.alt}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"/>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-[#F97356] transition-colors mb-3 line-clamp-2">
                                                {article.title}
                                            </h4>
                                            <span className="text-sm text-[#F97356] font-medium group-hover:underline">
                                                Read more
                                            </span>
                                        </div>
                                    </article>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
