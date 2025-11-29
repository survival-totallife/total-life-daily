"use client";

import { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/common";

interface FeaturedArticle {
    slug: string;
    title: string;
    excerpt?: string;
    category: string;
    featuredImage?: {
        url: string;
        alt: string;
    };
}

interface FeaturedSectionProps {
    articles: FeaturedArticle[];
}

export function FeaturedSection({ articles }: FeaturedSectionProps): JSX.Element {
    if (articles.length === 0) return <></>;

    return (
        <section className="py-12 lg:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <ScrollReveal animation="fadeUp" delay={0.1}>
                    <div className="mb-8">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Featured
                        </span>
                    </div>
                </ScrollReveal>

                {/* Articles Grid */}
                <StaggerContainer
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    staggerDelay={0.15}
                >
                    {articles.map((article) => (
                        <StaggerItem key={article.slug} animation="fadeUp">
                            <Link
                                href={`/blog/${article.slug}`}
                                className="group block h-full"
                            >
                                <article className="h-full flex flex-col">
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                                        {article.featuredImage ? (
                                            <Image
                                                src={article.featuredImage.url}
                                                alt={article.featuredImage.alt}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"/>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#F97356] transition-colors mb-3 line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <span
                                            className="mt-auto text-sm text-[#F97356] font-medium group-hover:underline">
                                            Read more about {article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title}
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
