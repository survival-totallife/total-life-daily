"use client";

import { motion } from "framer-motion";

export default function CategoryLoading() {
    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero Skeleton */}
            <section
                className="relative min-h-[420px] lg:min-h-[480px] overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900">
                {/* Animated shimmer overlay */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] bg-gray-700/30"
                        style={{ left: "-10%", top: "-20%" }}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bg-gray-700/20"
                        style={{ right: "-5%", bottom: "-30%" }}
                        animate={{
                            scale: [1.1, 1, 1.1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Content skeleton */}
                <div
                    className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex items-center">
                    <div className="w-full">
                        {/* Badge skeleton */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-6"
                        >
                            <div
                                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm w-40 h-10"/>
                        </motion.div>

                        {/* Title skeleton */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-6"
                        >
                            <div className="h-16 md:h-20 lg:h-24 w-64 md:w-80 bg-white/10 rounded-lg"/>
                        </motion.div>

                        {/* Description skeleton */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3 max-w-2xl"
                        >
                            <div className="h-6 w-full bg-white/10 rounded"/>
                            <div className="h-6 w-4/5 bg-white/10 rounded"/>
                        </motion.div>

                        {/* Accent line skeleton */}
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 h-1.5 w-32 bg-white/10 rounded-full origin-left"
                        />
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"/>
            </section>
        </div>
    );
}
