import { JSX, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const pillars = [
    { name: "Nourishment", href: "/category/nourishment" },
    { name: "Restoration", href: "/category/restoration" },
    { name: "Mindset", href: "/category/mindset" },
    { name: "Relationships", href: "/category/relationships" },
    { name: "Vitality", href: "/category/vitality" },
];

export function Header(): JSX.Element {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-500 ${
                scrolled
                    ? "bg-gradient-to-r from-[#F97356]/70 via-[#FF8A6B]/65 to-[#F97356]/70 backdrop-blur-2xl shadow-2xl shadow-[#F97356]/30 border-b border-white/25"
                    : "bg-gradient-to-r from-[#F97356]/80 via-[#FF7A5C]/75 to-[#E86547]/80 backdrop-blur-xl shadow-lg shadow-[#F97356]/20 border-b border-white/15"
            }`}
        >
            {/* Animated shimmer effect overlay */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                scrolled
                    ? "bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-100"
                    : "bg-gradient-to-r from-white/5 via-white/15 to-white/5 opacity-100"
            }`}/>

            {/* Glass reflection highlight */}
            <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent transition-opacity duration-500 ${
                    scrolled ? "opacity-100" : "opacity-60"
                }`}/>

            {/* Bottom inner glow */}
            <div
                className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"/>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img
                            src="/logo.svg"
                            alt="Total Life Daily"
                            width={183}
                            height={47}
                            className="h-10 w-auto drop-shadow-sm"
                        />
                    </Link>

                    {/* Pillar Tabs - Desktop */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {pillars.map((pillar) => (
                            <Link
                                key={pillar.name}
                                to={pillar.href}
                                className="relative px-4 py-2 text-sm font-medium text-white rounded-full transition-colors duration-300 ease-out hover:bg-black/20"
                            >
                                {pillar.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Subscribe Button */}
                    <div className="flex items-center gap-4">
                        <a
                            href="#subscribe"
                            className="hidden sm:inline-flex items-center px-5 py-2 bg-white text-[#F97356] text-sm font-semibold rounded-lg hover:bg-white/90 hover:shadow-lg hover:shadow-white/30 hover:scale-105 transition-all duration-200 cursor-pointer"
                        >
                            Subscribe
                        </a>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            className="lg:hidden p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6"/>
                            ) : (
                                <Menu className="w-6 h-6"/>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="lg:hidden bg-gradient-to-b from-[#E85A3D]/95 to-[#D94A2D]/95 backdrop-blur-xl border-t border-white/10"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 py-4 space-y-2">
                            {/* Mobile Pillar Links */}
                            {pillars.map((pillar, index) => (
                                <motion.div
                                    key={pillar.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        to={pillar.href}
                                        className="block px-4 py-2 text-white text-center rounded-lg hover:bg-white/15 backdrop-blur-sm transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {pillar.name}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile Subscribe */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <a
                                    href="#subscribe"
                                    className="block px-4 py-2 bg-white/95 backdrop-blur-sm text-[#F97356] text-center rounded-lg hover:bg-white transition-all mt-4 cursor-pointer"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Subscribe
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
