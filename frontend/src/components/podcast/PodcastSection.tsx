import { JSX } from "react";
import { Headphones, Music2, Play, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/common";

interface PodcastEpisode {
    id: string;
    title: string;
    description?: string;
    thumbnail?: {
        url: string;
        alt: string;
    };
    youtubeUrl?: string;
    spotifyUrl?: string;
    applePodcastsUrl?: string;
}

interface PodcastSectionProps {
    featuredEpisode: PodcastEpisode;
    totalEpisodes: number;
    playlistUrl: string;
}

export function PodcastSection({ featuredEpisode, totalEpisodes, playlistUrl }: PodcastSectionProps): JSX.Element {
    // Generate episode numbers array (excluding featured which is episode 1)
    const episodeNumbers = Array.from({ length: Math.min(totalEpisodes - 1, 6) }, (_, i) => totalEpisodes - i - 1);

    return (
        <section
            className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <ScrollReveal animation="fadeUp" delay={0.1}>
                    <div className="mb-10 text-center lg:text-left">
                        <span
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97356] uppercase tracking-wider mb-2">
                            <Headphones className="w-4 h-4 animate-pulse"/>
                            Mind My Age Podcast
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">
                            Listen & Learn
                        </h2>
                    </div>
                </ScrollReveal>

                {/* Featured Episode */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
                    {/* Video/Image */}
                    <ScrollReveal animation="fadeLeft" delay={0.2}>
                        <a
                            href={featuredEpisode.youtubeUrl || featuredEpisode.spotifyUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-800 cursor-pointer shadow-2xl shadow-black/50 hover:shadow-[#F97356]/20 transition-all duration-500 block"
                        >
                            {featuredEpisode.thumbnail ? (
                                <img
                                    src={featuredEpisode.thumbnail.url}
                                    alt={featuredEpisode.thumbnail.alt}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#F97356] to-purple-600"/>
                            )}
                            {/* Play Button Overlay */}
                            <div
                                className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                <motion.div
                                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-[#F97356]/80 transition-all duration-300 shadow-lg"
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform"
                                          fill="white"/>
                                </motion.div>
                            </div>
                            {/* Featured Badge */}
                            <motion.div
                                className="absolute top-4 left-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span
                                    className="px-3 py-1 bg-[#F97356] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                    Featured Episode
                                </span>
                            </motion.div>
                        </a>
                    </ScrollReveal>

                    {/* Content */}
                    <ScrollReveal animation="fadeRight" delay={0.3}>
                        <div className="lg:pl-4">
                            <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                                {featuredEpisode.title}
                            </h2>
                            {featuredEpisode.description && (
                                <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                                    {featuredEpisode.description}
                                </p>
                            )}

                            {/* Platform Links */}
                            <div className="flex flex-wrap gap-3">
                                {featuredEpisode.youtubeUrl && (
                                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                        <a
                                            href={featuredEpisode.youtubeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-red-600/30 hover:shadow-red-500/50"
                                        >
                                            <Youtube className="w-5 h-5 group-hover/btn:animate-bounce"/>
                                            Watch on YouTube
                                        </a>
                                    </motion.div>
                                )}
                                {featuredEpisode.spotifyUrl && (
                                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                        <a
                                            href={featuredEpisode.spotifyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-green-600/30 hover:shadow-green-500/50"
                                        >
                                            <Music2 className="w-5 h-5 group-hover/btn:animate-bounce"/>
                                            Listen on Spotify
                                        </a>
                                    </motion.div>
                                )}
                                {featuredEpisode.applePodcastsUrl && (
                                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                        <a
                                            href={featuredEpisode.applePodcastsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50"
                                        >
                                            <Music2 className="w-5 h-5 group-hover/btn:animate-bounce"/>
                                            Apple Podcasts
                                        </a>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* All Episodes */}
                <div>
                    <ScrollReveal animation="fadeUp" delay={0.2}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-8 h-px bg-gradient-to-r from-[#F97356] to-transparent"></span>
                                All Episodes ({totalEpisodes} total)
                            </h3>
                            <a
                                href={playlistUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#F97356] hover:text-[#fa8a72] transition-colors cursor-pointer font-medium"
                            >
                                View full playlist →
                            </a>
                        </div>
                    </ScrollReveal>
                    <StaggerContainer
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                        staggerDelay={0.08}
                    >
                        {episodeNumbers.map((episodeNum) => (
                            <StaggerItem key={episodeNum} animation="scale">
                                <a
                                    href={playlistUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:shadow-[#F97356]/20 hover:-translate-y-1 hover:scale-105 transition-all duration-300 border border-gray-700/50 hover:border-[#F97356]/50 block"
                                >
                                    {/* Background Image using CSS */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url('/mind-my-age.png')` }}
                                    />

                                    {/* Overlay */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-[#F97356]/70 transition-all duration-300"/>

                                    {/* Episode Number - Top Right */}
                                    <div className="absolute top-2 right-2">
                                    <span
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F97356] text-white text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {episodeNum}
                                    </span>
                                    </div>

                                    {/* Play Icon on Hover */}
                                    <div
                                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div
                                            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                            <Play className="w-4 h-4 text-[#F97356] ml-0.5" fill="#F97356"/>
                                        </div>
                                    </div>

                                    {/* Episode Label */}
                                    <div
                                        className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-xs font-medium text-white/90">Episode</span>
                                    </div>
                                </a>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    {/* View More Button */}
                    {totalEpisodes > 6 && (
                        <ScrollReveal animation="fadeUp" delay={0.4}>
                            <div className="mt-6 text-center">
                                <a
                                    href={playlistUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer border border-white/20 hover:border-white/40 hover:scale-105"
                                >
                                    <Youtube className="w-5 h-5"/>
                                    Watch all {totalEpisodes} episodes on YouTube
                                </a>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </div>
        </section>
    );
}
