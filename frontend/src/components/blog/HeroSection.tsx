import { JSX } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface HeroArticle {
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: {
        url: string;
        alt: string;
    };
}

interface HeroSectionProps {
    article: HeroArticle;
}

export function HeroSection({ article }: HeroSectionProps): JSX.Element {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Full-width Background Image */}
            <motion.div
                className="relative w-full aspect-[21/9] min-h-[350px] max-h-[500px]"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
                {article.featuredImage ? (
                    <img
                        src={article.featuredImage.url}
                        alt={article.featuredImage.alt}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        loading="eager"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"/>
                )}

                {/* Content Overlay - Positioned at bottom center */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 sm:px-6">
                    {/* Text Content Box */}
                    <motion.div
                        className="relative"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.4,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                    >
                        {/* Coral top border */}
                        <motion.div
                            className="absolute -top-1 left-0 right-0 h-1 bg-[#F97356]"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        />

                        {/* Dark teal/green content box */}
                        <div className="bg-[#1a4a4a] px-6 py-5 lg:px-8 lg:py-6 flex items-center justify-between gap-6">
                            <motion.h1
                                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight flex-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                {article.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                            >
                                <Link
                                    to={`/blog/${article.slug}`}
                                    className="flex-shrink-0 text-[#F97356] hover:text-[#ff8a70] font-medium text-sm lg:text-base transition-colors whitespace-nowrap"
                                >
                                    Read More →
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
