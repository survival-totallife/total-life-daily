"use client";

import { JSX } from "react";
import { motion } from "framer-motion";
import { Leaf, Moon, Brain, Heart, Zap } from "lucide-react";
import type { ArticleCategory } from "@/types/article";

interface CategoryHeroProps {
    category: ArticleCategory;
    label: string;
    description: string;
}

// Category-specific icons
const categoryIcons: Record<ArticleCategory, typeof Leaf> = {
    nourishment: Leaf,
    restoration: Moon,
    mindset: Brain,
    relationships: Heart,
    vitality: Zap,
};

// Category-specific styling
const categoryStyles: Record<ArticleCategory, {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    glow: string;
    ring: string;
    bgGradient: string;
}> = {
    nourishment: {
        primary: "#10B981",
        primaryDark: "#059669",
        secondary: "#34D399",
        accent: "#6EE7B7",
        glow: "rgba(16, 185, 129, 0.25)",
        ring: "rgba(16, 185, 129, 0.4)",
        bgGradient: "from-emerald-800 via-emerald-900 to-gray-900",
    },
    restoration: {
        primary: "#3B82F6",
        primaryDark: "#2563EB",
        secondary: "#60A5FA",
        accent: "#93C5FD",
        glow: "rgba(59, 130, 246, 0.25)",
        ring: "rgba(59, 130, 246, 0.4)",
        bgGradient: "from-blue-800 via-blue-900 to-gray-900",
    },
    mindset: {
        primary: "#8B5CF6",
        primaryDark: "#7C3AED",
        secondary: "#A78BFA",
        accent: "#C4B5FD",
        glow: "rgba(139, 92, 246, 0.25)",
        ring: "rgba(139, 92, 246, 0.4)",
        bgGradient: "from-purple-800 via-purple-900 to-gray-900",
    },
    relationships: {
        primary: "#EC4899",
        primaryDark: "#DB2777",
        secondary: "#F472B6",
        accent: "#F9A8D4",
        glow: "rgba(236, 72, 153, 0.25)",
        ring: "rgba(236, 72, 153, 0.4)",
        bgGradient: "from-pink-800 via-pink-900 to-gray-900",
    },
    vitality: {
        primary: "#F97316",
        primaryDark: "#EA580C",
        secondary: "#FB923C",
        accent: "#FDBA74",
        glow: "rgba(249, 115, 22, 0.25)",
        ring: "rgba(249, 115, 22, 0.4)",
        bgGradient: "from-orange-800 via-orange-900 to-gray-900",
    },
};

export function CategoryHero({ category, label, description }: CategoryHeroProps): JSX.Element {
    const Icon = categoryIcons[category];
    const colors = categoryStyles[category];

    return (
        <section
            className={`relative min-h-[420px] lg:min-h-[480px] overflow-hidden bg-gradient-to-br ${colors.bgGradient}`}>
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0">
                {/* Large animated color blobs */}
                <motion.div
                    className="absolute w-[800px] h-[800px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${colors.glow} 0%, transparent 60%)`,
                        left: "-20%",
                        top: "-40%",
                    }}
                    animate={{
                        x: [0, 80, 0],
                        y: [0, 60, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${colors.glow} 0%, transparent 60%)`,
                        right: "-10%",
                        bottom: "-40%",
                    }}
                    animate={{
                        x: [0, -60, 0],
                        y: [0, -40, 0],
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Coral brand accent blob */}
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(249, 115, 86, 0.15) 0%, transparent 60%)",
                        right: "10%",
                        top: "-10%",
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4],
                        x: [0, 30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Secondary floating blob */}
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
                    style={{
                        background: colors.primary,
                        opacity: 0.1,
                        left: "50%",
                        top: "60%",
                    }}
                    animate={{
                        x: [0, -50, 50, 0],
                        y: [0, -30, 20, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Geometric shapes */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                    {/* Animated rings */}
                    <motion.circle
                        cx="12%"
                        cy="65%"
                        r="100"
                        fill="none"
                        stroke={colors.ring}
                        strokeWidth="1.5"
                        animate={{
                            scale: [0.8, 1.1, 0.8],
                            opacity: [0.2, 0.5, 0.2],
                            rotate: [0, 180, 360],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        style={{ transformOrigin: "12% 65%" }}
                    />
                    <motion.circle
                        cx="88%"
                        cy="25%"
                        r="140"
                        fill="none"
                        stroke={colors.ring}
                        strokeWidth="1"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.15, 0.4, 0.15],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                    <motion.circle
                        cx="75%"
                        cy="75%"
                        r="70"
                        fill="none"
                        stroke="rgba(249, 115, 86, 0.3)"
                        strokeWidth="1.5"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                    <motion.circle
                        cx="30%"
                        cy="20%"
                        r="50"
                        fill="none"
                        stroke={colors.ring}
                        strokeWidth="1"
                        animate={{
                            scale: [1.1, 0.9, 1.1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    />

                    {/* Grid lines */}
                    <defs>
                        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)"/>

                    {/* Diagonal accent lines */}
                    <motion.line
                        x1="0%"
                        y1="100%"
                        x2="40%"
                        y2="60%"
                        stroke={colors.ring}
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 0.3, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                    <motion.line
                        x1="60%"
                        y1="0%"
                        x2="100%"
                        y2="40%"
                        stroke="rgba(249, 115, 86, 0.3)"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 0.3, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    />
                </svg>

                {/* Floating dots */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            background: i % 3 === 0 ? "#F97356" : i % 3 === 1 ? colors.secondary : colors.accent,
                            width: 4 + (i % 3) * 3,
                            height: 4 + (i % 3) * 3,
                            left: `${10 + i * 11}%`,
                            top: `${15 + (i % 4) * 20}%`,
                        }}
                        animate={{
                            y: [0, -25, 0],
                            x: [0, i % 2 === 0 ? 10 : -10, 0],
                            opacity: [0.4, 0.9, 0.4],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                        }}
                    />
                ))}

                {/* Sparkle effects */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        className="absolute"
                        style={{
                            left: `${20 + i * 20}%`,
                            top: `${30 + (i % 2) * 40}%`,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1.5,
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M8 0L9 7L16 8L9 9L8 16L7 9L0 8L7 7L8 0Z"
                                fill={i % 2 === 0 ? colors.accent : "#F97356"}
                                fillOpacity="0.6"
                            />
                        </svg>
                    </motion.div>
                ))}
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex items-center">
                <div className="w-full">
                    {/* Category badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6"
                    >
                        <div
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm"
                            style={{
                                borderColor: colors.ring,
                                background: `linear-gradient(135deg, ${colors.glow} 0%, rgba(255,255,255,0.05) 100%)`,
                            }}
                        >
                            <motion.div
                                className="p-2 rounded-xl"
                                style={{ backgroundColor: colors.primary }}
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Icon className="w-4 h-4 text-white" strokeWidth={2}/>
                            </motion.div>
                            <span className="text-sm font-medium text-white/90 tracking-wide">
                                Total Life Pillar
                            </span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
                    >
                        {label}
                        <motion.span
                            className="inline-block ml-3 w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors.primary }}
                            animate={{
                                scale: [1, 1.3, 1],
                                boxShadow: [
                                    `0 0 0 0 ${colors.glow}`,
                                    `0 0 0 10px transparent`,
                                    `0 0 0 0 ${colors.glow}`,
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl"
                    >
                        {description}
                    </motion.p>

                    {/* Accent line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-8 h-1.5 w-32 rounded-full origin-left overflow-hidden"
                        style={{
                            background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 50%, #F97356 100%)`
                        }}
                    >
                        <motion.div
                            className="h-full w-8 bg-white/40 blur-sm"
                            animate={{ x: [-32, 160, -32] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 via-gray-50/60 to-transparent"/>
        </section>
    );
}
