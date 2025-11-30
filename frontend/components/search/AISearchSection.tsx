"use client";

import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { ScrollReveal } from "@/components/common";
import { AISearchModal } from "./AISearchModal";

export function AISearchSection(): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section
                className="py-10 lg:py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
                {/* Subtle animated background */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-20 -left-20 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.3, 0.2],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.2, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal animation="fadeUp" delay={0.1}>
                        {/* Compact Card Layout */}
                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full cursor-pointer group"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="relative">
                                {/* Glow effect */}
                                <div
                                    className="absolute -inset-1 bg-gradient-to-r from-coral-500 to-orange-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"/>

                                <div
                                    className="relative flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 group-hover:border-coral-500/50 transition-all duration-300 shadow-lg shadow-black/20">
                                    {/* Lilly Avatar */}
                                    <div className="flex-shrink-0 relative">
                                        <div
                                            className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden ring-2 ring-gray-600 group-hover:ring-coral-500/50 transition-all duration-300">
                                            <Image
                                                src="/chatbot.png"
                                                alt="Lilly"
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Online indicator */}
                                        <motion.div
                                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-800"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-base font-semibold text-white">
                                                Chat with Lilly
                                            </h3>
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-coral-500/20 border border-white/30">
                                                <Sparkles className="w-3 h-3 text-white"/>
                                                <span className="text-xs font-medium text-white">AI</span>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                            Ask about nutrition, sleep, mindfulness, or fitness
                                        </p>
                                    </div>

                                    {/* Arrow/Chat Icon */}
                                    <div className="flex-shrink-0">
                                        <motion.div
                                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-orange-500 flex items-center justify-center"
                                            whileHover={{ rotate: [0, -5, 5, 0] }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <MessageCircle className="w-5 h-5 text-white"/>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
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
