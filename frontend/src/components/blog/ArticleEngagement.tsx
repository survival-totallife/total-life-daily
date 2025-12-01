import { JSX, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Facebook, Heart, Link2, Linkedin, MessageCircle, Share2, Twitter } from "lucide-react";
import { useAnonymousUser } from "@/lib/hooks/useAnonymousUser";
import { EngagementStats, getEngagementStats, toggleArticleLike } from "@/lib/api/engagement";

interface ArticleEngagementProps {
    articleId: number;
    articleSlug: string;
    articleTitle: string;
    onCommentsClick: () => void;
    commentsCount: number;
}

export function ArticleEngagement({
                                      articleId,
                                      articleSlug,
                                      articleTitle,
                                      onCommentsClick,
                                      commentsCount,
                                  }: ArticleEngagementProps): JSX.Element {
    const { user } = useAnonymousUser();
    const [stats, setStats] = useState<EngagementStats | null>(null);
    const [isLiking, setIsLiking] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);

    // Fetch initial engagement stats
    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await getEngagementStats(articleId, user?.id);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch engagement stats:", error);
                // Set default stats on error
                setStats({
                    article_id: articleId,
                    likes_count: 0,
                    comments_count: commentsCount,
                    is_liked_by_user: false,
                });
            }
        }

        fetchStats();
    }, [articleId, user?.id, commentsCount]);

    const handleLike = async () => {
        if (!user || isLiking) return;

        setIsLiking(true);
        setLikeAnimation(true);

        // Optimistic update
        setStats(prev => prev ? {
            ...prev,
            likes_count: prev.is_liked_by_user ? prev.likes_count - 1 : prev.likes_count + 1,
            is_liked_by_user: !prev.is_liked_by_user,
        } : null);

        try {
            const result = await toggleArticleLike(articleId, user.id);
            setStats(prev => prev ? {
                ...prev,
                likes_count: result.likes_count,
                is_liked_by_user: result.is_liked,
            } : null);
        } catch (error) {
            console.error("Failed to toggle like:", error);
            // Revert optimistic update
            setStats(prev => prev ? {
                ...prev,
                likes_count: prev.is_liked_by_user ? prev.likes_count + 1 : prev.likes_count - 1,
                is_liked_by_user: !prev.is_liked_by_user,
            } : null);
        } finally {
            setIsLiking(false);
            setTimeout(() => setLikeAnimation(false), 300);
        }
    };

    const shareUrl = `${window.location.origin}/blog/${articleSlug}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy link:", error);
        }
    };

    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(articleTitle);

        const urls: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        };

        if (urls[platform]) {
            window.open(urls[platform], "_blank", "width=600,height=400");
        }

        setShowShareMenu(false);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: articleTitle,
                    url: shareUrl,
                });
            } catch (error) {
                // User cancelled or share failed
                console.log("Share cancelled:", error);
            }
        }
        setShowShareMenu(false);
    };

    return (
        <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
            {/* Left side - Likes and Comments */}
            <div className="flex items-center gap-6">
                {/* Like Button */}
                <button
                    onClick={handleLike}
                    disabled={isLiking || !user}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#F97356] transition-colors group disabled:opacity-50 cursor-pointer"
                >
                    <motion.div
                        animate={likeAnimation ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <Heart
                            className={`w-5 h-5 transition-all ${
                                stats?.is_liked_by_user
                                    ? "fill-[#F97356] text-[#F97356]"
                                    : "group-hover:scale-110"
                            }`}
                        />
                    </motion.div>
                    <span className="text-sm font-medium">
                        {stats?.likes_count || 0}
                    </span>
                </button>

                {/* Comments Button */}
                <button
                    onClick={onCommentsClick}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                >
                    <MessageCircle className="w-5 h-5"/>
                    <span className="text-sm font-medium">
                        {stats?.comments_count || commentsCount}
                    </span>
                </button>
            </div>

            {/* Right side - Share */}
            <div className="relative">
                <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                    <Share2 className="w-5 h-5"/>
                </button>

                {/* Share Menu */}
                <AnimatePresence>
                    {showShareMenu && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowShareMenu(false)}
                            />

                            {/* Menu */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                            >
                                {/* Native Share (if available) */}
                                {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                                    <button
                                        onClick={handleNativeShare}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Share2 className="w-4 h-4"/>
                                        <span className="text-sm">Share via...</span>
                                    </button>
                                )}

                                {/* Copy Link */}
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-emerald-500"/>
                                            <span className="text-sm text-emerald-600">Link copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Link2 className="w-4 h-4"/>
                                            <span className="text-sm">Copy link</span>
                                        </>
                                    )}
                                </button>

                                <div className="h-px bg-gray-100 my-2"/>

                                {/* Twitter */}
                                <button
                                    onClick={() => handleShare("twitter")}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Twitter className="w-4 h-4"/>
                                    <span className="text-sm">Share on X</span>
                                </button>

                                {/* Facebook */}
                                <button
                                    onClick={() => handleShare("facebook")}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Facebook className="w-4 h-4"/>
                                    <span className="text-sm">Share on Facebook</span>
                                </button>

                                {/* LinkedIn */}
                                <button
                                    onClick={() => handleShare("linkedin")}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Linkedin className="w-4 h-4"/>
                                    <span className="text-sm">Share on LinkedIn</span>
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
