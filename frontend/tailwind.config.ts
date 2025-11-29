import type { Config } from "tailwindcss";

/**
 * Total Life Daily - Tailwind Configuration
 *
 * This configuration extends Tailwind with custom colors matching
 * the Total Life Daily brand. See DESIGN_SYSTEM.md for full documentation.
 *
 * Primary Brand: Coral (#F97356)
 * Five Pillars: Nourishment, Restoration, Mindset, Relationships, Vitality
 */

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Base semantic colors (from CSS variables)
                background: "hsl(var(--color-background) / <alpha-value>)",
                foreground: "hsl(var(--color-foreground) / <alpha-value>)",
                card: {
                    DEFAULT: "hsl(var(--color-card) / <alpha-value>)",
                    foreground: "hsl(var(--color-card-foreground) / <alpha-value>)",
                },
                popover: {
                    DEFAULT: "hsl(var(--color-popover) / <alpha-value>)",
                    foreground: "hsl(var(--color-popover-foreground) / <alpha-value>)",
                },
                primary: {
                    DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
                    foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "hsl(var(--color-secondary) / <alpha-value>)",
                    foreground: "hsl(var(--color-secondary-foreground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "hsl(var(--color-muted) / <alpha-value>)",
                    foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "hsl(var(--color-accent) / <alpha-value>)",
                    foreground: "hsl(var(--color-accent-foreground) / <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "hsl(var(--color-destructive) / <alpha-value>)",
                    foreground: "hsl(var(--color-destructive-foreground) / <alpha-value>)",
                },
                border: "hsl(var(--color-border) / <alpha-value>)",
                input: "hsl(var(--color-input) / <alpha-value>)",
                ring: "hsl(var(--color-ring) / <alpha-value>)",

                /**
                 * Coral - Primary Brand Color
                 */
                coral: {
                    50: "#FEF2F0",
                    100: "#FEE4E0",
                    200: "#FDCDC6",
                    300: "#FBAB9E",
                    400: "#F98472",
                    500: "#F97356",  // Primary
                    600: "#E85A3D",
                    700: "#C44A32",
                    800: "#A13E2B",
                    900: "#853628",
                },

                /**
                 * Five Pillars - Category Colors
                 * Each pillar has a distinct color for visual identification
                 */
                pillar: {
                    nourishment: {
                        DEFAULT: "#22C55E",  // green-500
                        light: "#DCFCE7",    // green-100
                        dark: "#16A34A",     // green-600
                    },
                    restoration: {
                        DEFAULT: "#3B82F6",  // blue-500
                        light: "#DBEAFE",    // blue-100
                        dark: "#2563EB",     // blue-600
                    },
                    mindset: {
                        DEFAULT: "#A855F7",  // purple-500
                        light: "#F3E8FF",    // purple-100
                        dark: "#9333EA",     // purple-600
                    },
                    relationships: {
                        DEFAULT: "#EC4899",  // pink-500
                        light: "#FCE7F3",    // pink-100
                        dark: "#DB2777",     // pink-600
                    },
                    vitality: {
                        DEFAULT: "#F97316",  // orange-500
                        light: "#FFEDD5",    // orange-100
                        dark: "#EA580C",     // orange-600
                    },
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;
