import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/common";

export function NewsletterSection(): JSX.Element {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ firstName: "", lastName: "", phone: "", email: "" });
    };

    return (
        <section id="subscribe"
                 className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-rose-50 overflow-hidden">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <ScrollReveal animation="fadeUp" delay={0.1}>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Begin Your Wellness Journey Now.
                        </h2>
                        <p className="text-lg text-gray-600">
                            Join daily online classes, use a self-care journal, and connect with a
                            supportive community—all designed to boost your physical, mental, and emotional
                            well-being.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Form */}
                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div
                            className="text-center py-8"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            <motion.div
                                className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                            >
                                <motion.svg
                                    className="w-8 h-8 text-[#F97356]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <motion.path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                    />
                                </motion.svg>
                            </motion.div>
                            <motion.h3
                                className="text-xl font-semibold text-gray-900 mb-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                Thank you for subscribing!
                            </motion.h3>
                            <motion.p
                                className="text-gray-600"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                We&apos;ll be in touch with wellness tips and updates.
                            </motion.p>
                        </motion.div>
                    ) : (
                        <ScrollReveal animation="fadeUp" delay={0.2}>
                            <motion.form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Name Fields */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label htmlFor="firstName"
                                               className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97356] focus:border-[#F97356] transition-colors"
                                            placeholder="First"
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label htmlFor="lastName"
                                               className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97356] focus:border-[#F97356] transition-colors"
                                            placeholder="Last"
                                        />
                                    </motion.div>
                                </div>

                                {/* Phone */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97356] focus:border-[#F97356] transition-colors"
                                        placeholder="Phone number"
                                    />
                                </motion.div>

                                {/* Email */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97356] focus:border-[#F97356] transition-colors"
                                        placeholder="email@example.com"
                                    />
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 px-6 bg-[#F97356] hover:bg-[#E85A3D] disabled:bg-[#F9A090] text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isSubmitting ? (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex items-center justify-center gap-2"
                                            >
                                                <motion.span
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block"
                                                />
                                                Submitting...
                                            </motion.span>
                                        ) : (
                                            "SUBMIT"
                                        )}
                                    </motion.button>
                                </motion.div>
                            </motion.form>
                        </ScrollReveal>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
