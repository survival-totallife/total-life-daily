"use client";

import { JSX, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, User, Loader2, ArrowDown } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    isStreaming?: boolean;
}

interface AISearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock AI responses for demo
const mockResponses = [
    `Great question! Based on the latest research in healthy aging, here are some key insights about **brain health**:

## Top Foods for Brain Health

1. **Fatty Fish** (Salmon, Sardines, Mackerel)
   - Rich in omega-3 fatty acids
   - Studies show they can slow mental decline by up to 30%

2. **Blueberries** 
   - Packed with antioxidants
   - May delay brain aging by 2.5 years

3. **Leafy Greens** (Spinach, Kale, Broccoli)
   - High in vitamin K, lutein, and folate
   - Associated with slower cognitive decline

4. **Nuts and Seeds**
   - Walnuts especially are great for memory
   - Contains vitamin E which protects cells

## Related Articles You Might Enjoy:
- "She Just Ate More Salmon—You Won't Believe What Happened to Her Brain and Balance"
- "Eat to Age Well: The 12-Year Study That Proves It's Not Too Late"

Would you like me to dive deeper into any of these topics?`,

    `Absolutely! **Sleep quality** is one of the most important factors for healthy aging. Here's what the science tells us:

## The Science of Better Sleep

### Why Sleep Matters After 50
During deep sleep, your brain clears out toxins, including beta-amyloid proteins linked to Alzheimer's. Getting 7-8 hours of quality sleep can:
- Improve memory consolidation
- Boost immune function
- Reduce inflammation

### Practical Tips for Better Sleep

1. **Maintain a consistent schedule** - Go to bed and wake up at the same time daily
2. **Create a cool, dark environment** - Ideal temperature is 65-68°F
3. **Limit screen time** - Blue light suppresses melatonin production
4. **Try relaxation techniques** - Deep breathing or meditation before bed

### The "90-Year-Old Secret"
Studies of centenarians show they prioritize:
- Natural light exposure during the day
- Physical activity (but not too close to bedtime)
- Light dinners eaten 3+ hours before sleep

## Want to Learn More?
Check out our article: "The Bedtime Secret 90-Year-Olds Know (That Could Keep Your Brain Young)"`,

    `That's a wonderful question about **reducing stress naturally**! Chronic stress accelerates aging, but there are proven ways to combat it:

## Natural Stress Reduction Techniques

### 1. Mindfulness Meditation
Research from Harvard shows just **8 weeks of mindfulness practice** can:
- Reduce anxiety by 58%
- Improve emotional regulation
- Actually change brain structure (increased gray matter)

### 2. Nature Walks
Walking in nature for just **20-30 minutes twice a week** has been shown to:
- Lower cortisol levels by 21%
- Reduce depression symptoms by nearly half
- Boost mood for up to 7 hours afterward

### 3. Social Connection
Maintaining strong friendships is crucial:
- People with larger social circles live longer
- Quality relationships reduce stress hormones
- Even brief positive interactions help

### 4. Breathing Exercises
The 4-7-8 technique is particularly effective:
- Inhale for 4 seconds
- Hold for 7 seconds
- Exhale for 8 seconds

## Ready to Start?
Our article "Feeling Blue? Try These Two Walks a Week—They Cut Depression and Anxiety Nearly in Half" has more practical tips!`
];

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

// Message component with waterfall animation
function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
    const displayedContent = useTypingEffect(
        message.content,
        Boolean(message.isStreaming && isLatest),
        12
    );
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 1
            }}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Avatar */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isUser
                        ? "bg-coral-500"
                        : "bg-gradient-to-br from-coral-500 to-orange-500"
                }`}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-white"/>
                ) : (
                    <Sparkles className="w-4 h-4 text-white"/>
                )}
            </motion.div>

            {/* Message content */}
            <div
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
                                className="inline-block w-2 h-4 bg-coral-400 ml-1"
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Simple markdown formatter
function formatMarkdown(text: string): string {
    return text
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

// Loading dots animation
function LoadingDots() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-3"
        >
            <div
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-coral-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white"/>
            </div>
            <div className="bg-gray-800/80 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-coral-400 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export function AISearchModal({ isOpen, onClose }: AISearchModalProps): JSX.Element {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const responseIndexRef = useRef(0);

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
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Simulate AI response delay
        setTimeout(() => {
            const mockResponse = mockResponses[responseIndexRef.current % mockResponses.length];
            responseIndexRef.current++;

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: mockResponse,
                isStreaming: true,
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setIsLoading(false);

            // Mark as done streaming after the animation completes
            const streamDuration = mockResponse.length * 12 + 500;
            setTimeout(() => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessage.id
                            ? { ...msg, isStreaming: false }
                            : msg
                    )
                );
            }, streamDuration);
        }, 1000 + Math.random() * 500);
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
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                        }}
                        className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-24 bg-gray-900 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-800"
                    >
                        {/* Animated background */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                className="absolute -top-40 -left-40 w-80 h-80 bg-coral-500/10 rounded-full blur-3xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    x: [0, 50, 0],
                                    y: [0, 30, 0],
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            <motion.div
                                className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    x: [0, -50, 0],
                                    y: [0, -30, 0],
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative flex items-center justify-between px-6 py-4 border-b border-gray-800"
                        >
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-orange-500 flex items-center justify-center"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Sparkles className="w-5 h-5 text-white"/>
                                </motion.div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        Total Life AI
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        Your wellness assistant
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-5 h-5"/>
                            </motion.button>
                        </motion.div>

                        {/* Messages area */}
                        <div className="relative flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.length === 0 ? (
                                // Empty state
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="h-full flex flex-col items-center justify-center text-center px-4"
                                >
                                    <motion.div
                                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-coral-500 to-orange-500 flex items-center justify-center mb-6"
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Sparkles className="w-10 h-10 text-white"/>
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        How can I help you today?
                                    </h3>
                                    <p className="text-gray-400 mb-8 max-w-md">
                                        Ask me anything about nutrition, sleep, mindfulness,
                                        relationships, or fitness for healthy aging.
                                    </p>

                                    {/* Suggested questions */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                        {suggestedQuestions.map((question, index) => (
                                            <motion.button
                                                key={question}
                                                onClick={() => setInputValue(question)}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                                className="text-left p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:border-coral-500/50 hover:text-white transition-all duration-300 text-sm"
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {question}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="relative p-4 border-t border-gray-800"
                        >
                            <form onSubmit={handleSubmit} className="relative">
                                <div className="relative flex items-center">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Ask about healthy aging..."
                                        disabled={isLoading}
                                        className="w-full px-5 py-4 pr-14 bg-gray-800/80 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={!inputValue.trim() || isLoading}
                                        className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-coral-500 to-orange-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin"/>
                                        ) : (
                                            <Send className="w-5 h-5"/>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                AI-powered responses based on Total Life Daily content
                            </p>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
