import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs du thème - Modifiables dans globals.css
        // Syntaxe Tailwind v3+ avec support de l'opacité
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          light: "rgb(var(--primary-light) / <alpha-value>)",
          dark: "rgb(var(--primary-dark) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          light: "rgb(var(--secondary-light) / <alpha-value>)",
          dark: "rgb(var(--secondary-dark) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          light: "rgb(var(--accent-light) / <alpha-value>)",
          dark: "rgb(var(--accent-dark) / <alpha-value>)",
        },
        background: {
          DEFAULT: "rgb(var(--background) / <alpha-value>)",
          soft: "rgb(var(--background-soft) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "rgb(var(--foreground) / <alpha-value>)",
          muted: "rgb(var(--foreground-muted) / <alpha-value>)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      spacing: {
        section: "var(--section-spacing)",
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "pulse-scale": "pulseScale 1.5s ease-in-out infinite",
        "slide-in-left": "slideInLeft 0.8s ease-out forwards",
        "slide-in-right": "slideInRight 0.8s ease-out forwards",
        "page-enter": "pageEnter 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseScale: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-60px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(60px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        pageEnter: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
