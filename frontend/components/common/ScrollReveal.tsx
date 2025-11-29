"use client";

import { motion, useInView, Variants } from "framer-motion";
import { ReactNode, useRef } from "react";

type AnimationType =
    | "fadeUp"
    | "fadeDown"
    | "fadeLeft"
    | "fadeRight"
    | "fadeIn"
    | "scale"
    | "slideUp"
    | "slideDown"
    | "blur"
    | "rotate"
    | "bounce";

interface ScrollRevealProps {
    children: ReactNode;
    animation?: AnimationType;
    delay?: number;
    duration?: number;
    className?: string;
    once?: boolean;
    threshold?: number;
}

const animations: Record<AnimationType, Variants> = {
    fadeUp: {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 },
    },
    fadeDown: {
        hidden: { opacity: 0, y: -60 },
        visible: { opacity: 1, y: 0 },
    },
    fadeLeft: {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 },
    },
    fadeRight: {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 },
    },
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    scale: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    },
    slideUp: {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 },
    },
    slideDown: {
        hidden: { opacity: 0, y: -100 },
        visible: { opacity: 1, y: 0 },
    },
    blur: {
        hidden: { opacity: 0, filter: "blur(10px)" },
        visible: { opacity: 1, filter: "blur(0px)" },
    },
    rotate: {
        hidden: { opacity: 0, rotate: -10, scale: 0.9 },
        visible: { opacity: 1, rotate: 0, scale: 1 },
    },
    bounce: {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            }
        },
    },
};

export function ScrollReveal({
                                 children,
                                 animation = "fadeUp",
                                 delay = 0,
                                 duration = 0.6,
                                 className = "",
                                 once = true,
                                 threshold = 0.2,
                             }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once,
        amount: threshold,
    });

    const selectedAnimation = animations[animation];

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={selectedAnimation}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth feel
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Staggered children animation wrapper
interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    once?: boolean;
    threshold?: number;
}

export function StaggerContainer({
                                     children,
                                     className = "",
                                     staggerDelay = 0.1,
                                     once = true,
                                     threshold = 0.1,
                                 }: StaggerContainerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, amount: threshold });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.1,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Individual stagger item
interface StaggerItemProps {
    children: ReactNode;
    className?: string;
    animation?: AnimationType;
}

export function StaggerItem({
                                children,
                                className = "",
                                animation = "fadeUp",
                            }: StaggerItemProps) {
    const selectedAnimation = animations[animation];

    return (
        <motion.div
            variants={selectedAnimation}
            transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Parallax scroll effect
interface ParallaxProps {
    children: ReactNode;
    speed?: number;
    className?: string;
}

export function Parallax({
                             children,
                             speed = 0.5,
                             className = "",
                         }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0 });

    return (
        <motion.div
            ref={ref}
            initial={{ y: 0 }}
            animate={isInView ? { y: 0 } : { y: 50 * speed }}
            transition={{
                duration: 0.8,
                ease: "easeOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Text reveal animation (character by character or word by word)
interface TextRevealProps {
    text: string;
    className?: string;
    wordByWord?: boolean;
    delay?: number;
}

export function TextReveal({
                               text,
                               className = "",
                               wordByWord = false,
                               delay = 0,
                           }: TextRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    const elements = wordByWord ? text.split(" ") : text.split("");

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: wordByWord ? 0.08 : 0.03,
                delayChildren: delay,
            },
        },
    };

    const childVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
            }
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={className}
            aria-label={text}
        >
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    variants={childVariants}
                    className="inline-block"
                >
                    {element}
                    {wordByWord && index < elements.length - 1 ? "\u00A0" : ""}
                </motion.span>
            ))}
        </motion.div>
    );
}

// Floating animation (continuous)
interface FloatingProps {
    children: ReactNode;
    className?: string;
    amplitude?: number;
    duration?: number;
}

export function Floating({
                             children,
                             className = "",
                             amplitude = 10,
                             duration = 3,
                         }: FloatingProps) {
    return (
        <motion.div
            animate={{
                y: [-amplitude, amplitude, -amplitude],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
