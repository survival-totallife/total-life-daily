import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ExternalLink, Send, Square, User, X } from "lucide-react";

interface Source {
    id: string;
    title: string;
    authors: string;
    journal: string;
    year: string;
    url: string;
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    isStreaming?: boolean;
}

interface AISearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// API URL for backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Typing effect hook
function useTypingEffect(text: string, isStreaming: boolean, speed: number = 15) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!isStreaming) {
            setDisplayedText(text);
            return;
        }

        let index = 0;
        setDisplayedText("");

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, isStreaming, speed]);

    return displayedText;
}

// Message component with enhanced waterfall animation
function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
    const displayedContent = useTypingEffect(
        message.content,
        Boolean(message.isStreaming && isLatest),
        5
    );
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, x: isUser ? 30 : -30 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.8
            }}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Avatar with pop-in animation */}
            <motion.div
                initial={{ scale: 0, rotate: isUser ? 90 : -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 20 }}
                whileHover={{ scale: 1.15 }}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                    isUser
                        ? "bg-coral-500"
                        : "bg-gradient-to-br from-coral-500 to-orange-500"
                }`}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-white"/>
                ) : (
                    <img
                        src="/chatbot.png"
                        alt="Lilly"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                    />
                )}
            </motion.div>

            {/* Message content with slide animation */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, x: isUser ? 20 : -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
                className={`max-w-[80%] ${
                    isUser
                        ? "bg-coral-500 text-white rounded-2xl rounded-tr-md px-4 py-3"
                        : "bg-gray-800/80 text-gray-100 rounded-2xl rounded-tl-md px-4 py-3"
                }`}
            >
                {isUser ? (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                ) : (
                    <div
                        className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none prose-headings:text-coral-300 prose-strong:text-coral-200 prose-li:marker:text-coral-400">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: formatMarkdown(displayedContent)
                            }}
                        />
                        {message.isStreaming && isLatest && (
                            <motion.span
                                className="inline-block w-2 h-4 bg-coral-400 ml-1 rounded-sm"
                                animate={{ opacity: [1, 0.3, 1], scaleY: [1, 0.8, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            />
                        )}

                        {/* Sources section */}
                        {message.sources && message.sources.length > 0 && !message.isStreaming && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700/50"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen className="w-4 h-4 text-coral-400"/>
                                    <span className="text-xs font-semibold text-coral-300 uppercase tracking-wide">
                                        Research Sources ({message.sources.length})
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {message.sources.map((source, idx) => (
                                        <motion.a
                                            key={source.id}
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                            className="block p-3 rounded-lg bg-gray-900/50 border border-gray-700/30 hover:border-coral-500/50 hover:bg-gray-900/80 transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-200 line-clamp-2 group-hover:text-coral-200 transition-colors">
                                                        {source.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                                        {source.authors} • {source.journal} ({source.year})
                                                    </p>
                                                </div>
                                                <ExternalLink
                                                    className="w-3.5 h-3.5 text-gray-500 group-hover:text-coral-400 flex-shrink-0 transition-colors"/>
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

// Simple markdown formatter
function formatMarkdown(text: string): string {
    return text
        // Source citations - ChatGPT-style superscript numbers
        .replace(
            /\[Source:\s*(\d+)\]/g,
            '<a href="https://pubmed.ncbi.nlm.nih.gov/$1" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 ml-0.5 text-[10px] font-medium bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-full no-underline cursor-pointer align-super transition-colors" title="View source on PubMed">$1</a>'
        )
        // Headers
        .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-coral-300 mt-4 mb-2">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-coral-300 mt-4 mb-2">$1</h2>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Lists
        .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
        .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-3">')
        .replace(/\n/g, '<br />');
}

// Rotating status messages for loading state
const loadingMessages = [
    "Lilly is thinking...",
    "Gathering research...",
    "Analyzing sources...",
    "Formatting response...",
    "Almost there...",
];

// Hook to cycle through loading messages
function useRotatingMessage(messages: string[], intervalMs: number = 2500) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, intervalMs);

        return () => clearInterval(interval);
    }, [messages, intervalMs]);

    return messages[currentIndex];
}

// Loading dots animation with enhanced effects
function LoadingDots() {
    const statusMessage = useRotatingMessage(loadingMessages, 2500);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, x: -30 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex gap-3"
        >
            <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500 }}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-coral-500 to-orange-500 flex items-center justify-center overflow-hidden">
                <img
                    src="/chatbot.png"
                    alt="Lilly"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                />
            </motion.div>
            <motion.div
                className="bg-gray-800/80 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-coral-400 rounded-full"
                        animate={{
                            y: [0, -8, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut"
                        }}
                    />
                ))}
                <motion.span
                    key={statusMessage}
                    className="ml-2 text-xs text-gray-500"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                >
                    {statusMessage}
                </motion.span>
            </motion.div>
        </motion.div>
    );
}

export function AISearchModal({ isOpen, onClose }: AISearchModalProps): JSX.Element {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const streamingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentStreamingIdRef = useRef<string | null>(null);

    // Stop the current streaming/generation
    const handleStop = useCallback(() => {
        // Abort the fetch request if in progress
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        // Clear the streaming timeout
        if (streamingTimeoutRef.current) {
            clearTimeout(streamingTimeoutRef.current);
            streamingTimeoutRef.current = null;
        }

        // Mark current message as done streaming
        if (currentStreamingIdRef.current) {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === currentStreamingIdRef.current
                        ? { ...msg, isStreaming: false }
                        : msg
                )
            );
            currentStreamingIdRef.current = null;
        }

        setIsLoading(false);
        setIsStreaming(false);
    }, []);

    // Auto-scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Handle keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                if (!isOpen) {
                    // This won't work directly since we can't open from here
                    // but it's good to have the handler ready
                }
            }
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            // Optional: reset messages when modal closes
            // setMessages([]);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading || isStreaming) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content }),
                signal: abortControllerRef.current.signal,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || `Error: ${res.statusText}`);
            }

            const data = await res.json();

            const assistantMessageId = (Date.now() + 1).toString();
            const assistantMessage: Message = {
                id: assistantMessageId,
                role: "assistant",
                content: data.answer,
                sources: data.sources || [],
                isStreaming: true,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setIsLoading(false);
            setIsStreaming(true);
            currentStreamingIdRef.current = assistantMessageId;

            // Mark as done streaming after the animation completes
            const streamDuration = data.answer.length * 5 + 500;
            streamingTimeoutRef.current = setTimeout(() => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, isStreaming: false }
                            : msg
                    )
                );
                setIsStreaming(false);
                currentStreamingIdRef.current = null;
                streamingTimeoutRef.current = null;
            }, streamDuration);
        } catch (error) {
            // Don't show error message if request was aborted
            if (error instanceof Error && error.name === 'AbortError') {
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `I'm sorry, I couldn't process your request. ${error instanceof Error ? error.message : 'Please try again later.'}`,
                isStreaming: false,
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    const suggestedQuestions = [
        "What foods improve brain health?",
        "How can I sleep better at night?",
        "Benefits of walking daily?",
        "How to reduce stress naturally?",
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with fade and blur animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            duration: 0.2,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        className="fixed inset-4 md:inset-6 lg:inset-8 xl:inset-12 bg-gray-900 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-800"
                    >
                        {/* Animated background - simplified */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {/* Primary gradient orbs */}
                            <motion.div
                                className="absolute -top-40 -left-40 w-80 h-80 bg-coral-500/10 rounded-full blur-3xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.15, 0.1],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            <motion.div
                                className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.15, 0.1, 0.15],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            {/* Center glow */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-coral-500/5 rounded-full blur-3xl"
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* Subtle twinkling stars - reduced count */}
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={`star-${i}`}
                                    className="absolute rounded-full bg-white/50"
                                    style={{
                                        left: `${10 + (i * 8)}%`,
                                        top: `${15 + (i * 7) % 70}%`,
                                        width: '2px',
                                        height: '2px',
                                    }}
                                    animate={{
                                        opacity: [0.2, 0.5, 0.2],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}

                            {/* Shimmer line effect */}
                            <div
                                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coral-500/30 to-transparent"/>
                        </div>

                        {/* Header */}
                        <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-orange-500 flex items-center justify-center overflow-hidden">
                                    <img
                                        src="/chatbot.png"
                                        alt="Lilly"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-semibold text-white">
                                            Lilly
                                        </h2>
                                        {/* Online status indicator */}
                                        <div
                                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                                            <span className="text-xs text-green-400">Online</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Your wellness assistant
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5"/>
                            </button>
                        </div>

                        {/* Messages area */}
                        <div className="relative flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.length === 0 ? (
                                // Empty state - simplified
                                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                    {/* Avatar */}
                                    <div className="relative mb-6">
                                        <div
                                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-coral-500 to-orange-500 animate-pulse opacity-30"/>
                                        <div
                                            className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-coral-500 to-orange-500 flex items-center justify-center overflow-hidden">
                                            <img
                                                src="/chatbot.png"
                                                alt="Lilly"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Hi, I&apos;m Lilly! How can I help?
                                    </h3>
                                    <p className="text-gray-400 mb-8 max-w-md">
                                        Ask me anything about nutrition, sleep, mindfulness,
                                        relationships, or fitness for healthy aging.
                                    </p>

                                    {/* Suggested questions */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                        {suggestedQuestions.map((question) => (
                                            <button
                                                key={question}
                                                onClick={() => setInputValue(question)}
                                                className="text-left p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:border-coral-500/50 hover:text-white transition-all duration-200 text-sm cursor-pointer"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Messages list
                                <div className="space-y-6">
                                    <AnimatePresence mode="popLayout">
                                        {messages.map((message, index) => (
                                            <MessageBubble
                                                key={message.id}
                                                message={message}
                                                isLatest={index === messages.length - 1}
                                            />
                                        ))}
                                    </AnimatePresence>

                                    {/* Loading indicator */}
                                    <AnimatePresence>
                                        {isLoading && <LoadingDots/>}
                                    </AnimatePresence>
                                </div>
                            )}
                            <div ref={messagesEndRef}/>
                        </div>

                        {/* Input area */}
                        <div className="relative p-4 border-t border-gray-800">
                            <div
                                className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-coral-500/30 to-transparent"/>
                            
                            <form onSubmit={handleSubmit} className="relative">
                                <div className="relative flex items-center">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Ask about healthy aging..."
                                        disabled={isLoading || isStreaming}
                                        className="relative w-full px-5 py-4 pr-14 bg-gray-800/80 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    {(isLoading || isStreaming) ? (
                                        <button
                                            type="button"
                                            onClick={handleStop}
                                            className="absolute right-2 p-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white cursor-pointer transition-all"
                                            title="Stop generating"
                                        >
                                            <Square className="w-4 h-4 fill-current"/>
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={!inputValue.trim()}
                                            className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-coral-500 to-orange-500 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                        >
                                            <Send className="w-5 h-5"/>
                                        </button>
                                    )}
                                </div>
                            </form>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                Lilly provides AI-powered wellness advice based on Total Life Daily content
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
