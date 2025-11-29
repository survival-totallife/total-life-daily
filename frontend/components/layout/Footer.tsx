import { JSX } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
    questions: [
        { name: "FAQs", href: "https://totallife.com/faqs/" },
        { name: "info@totallife.com", href: "mailto:info@totallife.com" },
        { name: "press@totallife.com", href: "mailto:press@totallife.com" },
    ],
    getStarted: [
        { name: "Find a Therapist", href: "https://totallife.com/" },
        { name: "How It Works", href: "https://totallife.com/learn-more/" },
    ],
    resources: [
        { name: "Emergency Resources", href: "https://totallife.com/emergency-resources/" },
        { name: "Wellness", href: "https://wellness.totallife.com/" },
    ],
    legal: [
        { name: "About", href: "https://totallife.com/" },
        { name: "Careers", href: "https://apply.workable.com/total-life/" },
        { name: "Privacy Policy", href: "https://totallife.com/privacy/" },
        { name: "Terms and Conditions", href: "https://totallife.com/termsandconditions/" },
    ],
};

const socialLinks = [
    { name: "Facebook", href: "https://www.facebook.com/TotalLifeTeletherapy", icon: Facebook },
    { name: "Instagram", href: "https://www.instagram.com/totallifetherapy", icon: Instagram },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/totallifeapp/", icon: Linkedin },
    { name: "YouTube", href: "https://www.youtube.com/@MindMyAge", icon: Youtube },
];

export function Footer(): JSX.Element {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Tagline */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                        Total Life Daily — where science meets sass, and research turns into real-life upgrades.
                    </h2>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
                    {/* Questions */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Questions
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.questions.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get Started */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Get Started
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.getStarted.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-6 mb-8">
                    {socialLinks.map((social) => (
                        <Link
                            key={social.name}
                            href={social.href}
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label={social.name}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <social.icon className="w-6 h-6"/>
                        </Link>
                    ))}
                </div>

                {/* Emergency Notice */}
                <div className="text-center text-sm text-gray-400 mb-8">
                    <p>
                        If you or someone you know is experiencing an emergency or crisis and needs
                        immediate help, call 911 or go to the nearest emergency room.
                    </p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
                            {footerLinks.legal.map((link, index) => (
                                <span key={link.name} className="flex items-center">
                                    <Link
                                        href={link.href}
                                        className="hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                    {index < footerLinks.legal.length - 1 && (
                                        <span className="ml-4">|</span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} Copyright Total Life. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
