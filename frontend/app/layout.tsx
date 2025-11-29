import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Total Life Daily | Health & Wellness Blog",
    description: "Happy, healthy aging — made simple. Science-backed content built on Total Life's five essential pillars to help everyone live longer, brighter, and better.",
    keywords: ["health", "wellness", "aging", "mindfulness", "nourishment", "vitality", "relationships", "restoration"],
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
    return (
        <html lang="en">
        <body className={`${inter.className} antialiased bg-white`}>
        <Header/>
        <main className="min-h-screen">
            {children}
        </main>
        <Footer/>
            </body>
        </html>
    );
}
