import { JSX, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Heart, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { AnonymousUser, useAnonymousUser } from "@/lib/hooks/useAnonymousUser";
import { addComment, Comment, deleteComment, getComments, toggleCommentLike } from "@/lib/api/engagement";

interface CommentsSectionProps {
    articleId: number;
    isOpen: boolean;
    onToggle: () => void;
    onCommentsCountChange: (count: number) => void;
}

// Format relative time
function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Generate avatar color from user ID
function getAvatarColor(userId: string): string {
    const colors = [
        "from-rose-400 to-rose-600",
        "from-orange-400 to-orange-600",
        "from-amber-400 to-amber-600",
        "from-emerald-400 to-emerald-600",
        "from-teal-400 to-teal-600",
        "from-cyan-400 to-cyan-600",
        "from-blue-400 to-blue-600",
        "from-indigo-400 to-indigo-600",
        "from-violet-400 to-violet-600",
        "from-purple-400 to-purple-600",
    ];

    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return colors[Math.abs(hash) % colors.length];
}

// Get initials from display name
function getInitials(name: string): string {
    const words = name.match(/[A-Z][a-z]+/g) || [];
    if (words.length >= 2 && words[0] && words[1]) {
        return words[0][0] + words[1][0];
    }
    return name.substring(0, 2).toUpperCase();
}

interface CommentItemProps {
    comment: Comment;
    currentUser: AnonymousUser | null;
    onLike: (commentId: number) => void;
    onDelete: (commentId: number) => void;
    isLiking: boolean;
}

function CommentItem({ comment, currentUser, onLike, onDelete, isLiking }: CommentItemProps) {
    const [showMenu, setShowMenu] = useState(false);
    const isAuthor = comment.is_own;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-3 py-4"
        >
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(comment.anonymous_user_id)} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                {getInitials(comment.display_name)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                        {comment.display_name}
                    </span>
                    <span className="text-gray-400 text-xs">
                        {formatRelativeTime(comment.created_at)}
                    </span>
                </div>

                <p className="text-gray-700 text-[15px] leading-relaxed break-words">
                    {comment.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-2">
                    <button
                        onClick={() => onLike(comment.comment_id)}
                        disabled={isLiking || !currentUser}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-[#F97356] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <Heart
                            className={`w-4 h-4 ${
                                comment.is_liked ? "fill-[#F97356] text-[#F97356]" : ""
                            }`}
                        />
                        {comment.likes_count > 0 && (
                            <span className="text-xs">{comment.likes_count}</span>
                        )}
                    </button>

                    {isAuthor && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                            >
                                <MoreHorizontal className="w-4 h-4"/>
                            </button>

                            <AnimatePresence>
                                {showMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowMenu(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                                        >
                                            <button
                                                onClick={() => {
                                                    onDelete(comment.comment_id);
                                                    setShowMenu(false);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm whitespace-nowrap cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                                Delete
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export function CommentsSection({
                                    articleId,
                                    isOpen,
                                    onToggle,
                                    onCommentsCountChange
                                }: CommentsSectionProps): JSX.Element {
    const { user } = useAnonymousUser();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [likingCommentId, setLikingCommentId] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const commentsContainerRef = useRef<HTMLDivElement>(null);

    // Fetch comments on mount to get the count, and refetch when opened
    useEffect(() => {
        fetchComments();
    }, [articleId, user?.id]);

    // Refetch when opened (in case new comments were added elsewhere)
    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newComment]);

    async function fetchComments() {
        setIsLoading(true);
        try {
            const data = await getComments(articleId, user?.id);
            setComments(data);
            onCommentsCountChange(data.length);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user || !newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const comment = await addComment(articleId, {
                anonymous_user_id: user.id,
                display_name: user.displayName,
                content: newComment.trim(),
            });

            setComments(prev => [comment, ...prev]);
            onCommentsCountChange(comments.length + 1);
            setNewComment("");

            // Scroll to top of comments
            if (commentsContainerRef.current) {
                commentsContainerRef.current.scrollTop = 0;
            }
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleLike(commentId: number) {
        if (!user || likingCommentId) return;

        setLikingCommentId(commentId);

        // Optimistic update
        setComments(prev => prev.map(c =>
            c.comment_id === commentId
                ? {
                    ...c,
                    likes_count: c.is_liked ? c.likes_count - 1 : c.likes_count + 1,
                    is_liked: !c.is_liked,
                }
                : c
        ));

        try {
            const result = await toggleCommentLike(articleId, commentId, user.id);
            setComments(prev => prev.map(c =>
                c.comment_id === commentId
                    ? { ...c, likes_count: result.likes_count, is_liked: result.is_liked }
                    : c
            ));
        } catch (error) {
            console.error("Failed to toggle comment like:", error);
            // Revert optimistic update
            setComments(prev => prev.map(c =>
                c.comment_id === commentId
                    ? {
                        ...c,
                        likes_count: c.is_liked ? c.likes_count + 1 : c.likes_count - 1,
                        is_liked: !c.is_liked,
                    }
                    : c
            ));
        } finally {
            setLikingCommentId(null);
        }
    }

    async function handleDelete(commentId: number) {
        if (!user) return;

        try {
            await deleteComment(articleId, commentId, user.id);
            setComments(prev => prev.filter(c => c.comment_id !== commentId));
            onCommentsCountChange(comments.length - 1);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    }

    return (
        <div className="mt-8">
            {/* Expandable Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer group"
            >
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Responses ({comments.length})
                    </h3>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5"/>
                    ) : (
                        <ChevronDown className="w-5 h-5"/>
                    )}
                </div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pt-6 pb-4">
                            {/* Comment Input */}
                            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl">
                                <div className="flex gap-3">
                                    {user && (
                                        <div
                                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                                            {user.initials}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <textarea
                                            ref={textareaRef}
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    if (newComment.trim() && !isSubmitting && user) {
                                                        handleSubmit(e);
                                                    }
                                                }
                                            }}
                                            placeholder="What are your thoughts?"
                                            className="w-full resize-none border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700 placeholder:text-gray-400 text-[15px] leading-relaxed min-h-[80px] max-h-[200px] bg-white"
                                            rows={3}
                                        />
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xs text-gray-400">
                                                Posting as {user?.displayName || "Anonymous"}
                                            </span>
                                            <button
                                                type="submit"
                                                disabled={!newComment.trim() || isSubmitting || !user}
                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-full transition-colors cursor-pointer"
                                            >
                                                {isSubmitting ? (
                                                    <div
                                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4"/>
                                                        Respond
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* Comments List */}
                            <div ref={commentsContainerRef}>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div
                                            className="w-6 h-6 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"/>
                                    </div>
                                ) : comments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-sm">
                                            No responses yet. Be the first to share your thoughts!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        <AnimatePresence>
                                            {comments.map((comment) => (
                                                <CommentItem
                                                    key={comment.comment_id}
                                                    comment={comment}
                                                    currentUser={user}
                                                    onLike={handleLike}
                                                    onDelete={handleDelete}
                                                    isLiking={likingCommentId === comment.comment_id}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
