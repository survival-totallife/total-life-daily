"use client";

import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/common";
import { AISearchModal } from "./AISearchModal";

export function AISearchSection(): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section
                className="py-12 lg:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Animated gradient orbs */}
                    <motion.div
                        className="absolute -top-20 -left-20 w-96 h-96 bg-coral-500/20 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.5, 0.3, 0.5],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-coral-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* Floating particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-coral-400/40 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.8, 0.2],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal animation="fadeUp" delay={0.1}>
                        <div className="text-center mb-8">
                            {/* AI Badge */}
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-500/20 border border-coral-500/30 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    <Sparkles className="w-4 h-4 text-coral-400"/>
                                </motion.div>
                                <span className="text-sm font-medium text-coral-300">
                                    AI-Powered Search
                                </span>
                            </motion.div>

                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Ask Anything About{" "}
                                <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-orange-400">
                                    Healthy Aging
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                Our AI assistant can help you discover articles, answer questions,
                                and guide you on your wellness journey.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Search Bar Trigger */}
                    <ScrollReveal animation="fadeUp" delay={0.3}>
                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative">
                                {/* Glow effect */}
                                <div
                                    className="absolute -inset-1 bg-gradient-to-r from-coral-500 to-orange-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"/>

                                <div
                                    className="relative flex items-center gap-4 bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl px-6 py-5 group-hover:border-coral-500/50 transition-all duration-300">
                                    <div className="flex-shrink-0">
                                        <motion.div
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-500 to-orange-500 flex items-center justify-center"
                                            whileHover={{ rotate: [0, -10, 10, 0] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Search className="w-6 h-6 text-white"/>
                                        </motion.div>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                            Ask me anything about nutrition, sleep, mindfulness, relationships, or
                                            fitness...
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 hidden sm:flex items-center gap-2">
                                        <kbd
                                            className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-700/50 border border-gray-600/50 rounded-lg">
                                            ⌘
                                        </kbd>
                                        <kbd
                                            className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-700/50 border border-gray-600/50 rounded-lg">
                                            K
                                        </kbd>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    </ScrollReveal>

                    {/* Quick suggestions */}
                    <ScrollReveal animation="fadeUp" delay={0.5}>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            {[
                                "Best foods for brain health",
                                "How to improve sleep quality",
                                "Benefits of daily walking",
                                "Reduce stress naturally",
                            ].map((suggestion, index) => (
                                <motion.button
                                    key={suggestion}
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 text-sm text-gray-400 bg-gray-800/50 border border-gray-700/50 rounded-full hover:bg-gray-700/50 hover:text-gray-300 hover:border-coral-500/30 transition-all duration-300"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {suggestion}
                                </motion.button>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* AI Search Modal */}
            <AISearchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
