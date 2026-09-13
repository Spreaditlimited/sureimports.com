import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        md: '900px',
      },
    },
    extend: {
      backgroundImage: {
        bannerimage: "url('/images/banner.png')",
      },
      backdropOpacity: {
        2: '0.2',
      },
      screens: {
        xl17: '1700px',
        xl16: '1600px',
        xl15: '1500px',
        xl14: '1400px',
      },
      colors: {
        // --- CORE BRAND TOKENS ---
        blue: {
          50: '#f4f2fc', 100: '#eeecfa', 200: '#dcd7f6', 300: '#c6bef0',
          400: '#b0a7e8', 500: '#746ac4', 600: '#48439b', 700: '#40398b',
          800: '#35316f', 900: '#292539', 950: '#19152d',
        },
        indigo: {
          50: '#f4f2fc', 100: '#eeecfa', 200: '#dcd7f6', 300: '#c6bef0',
          400: '#b0a7e8', 500: '#746ac4', 600: '#48439b', 700: '#40398b',
          800: '#35316f', 900: '#292539', 950: '#19152d',
        },
        // NEW: Strategic Brand Orange for CTAs and Conversions
        'brand-orange': {
          50: '#fff4ed', 100: '#ffe6d4', 200: '#fecaa6', 300: '#fda66e',
          400: '#fb7b35', 500: '#f95a0e', 600: '#ea4306', 700: '#c23106',
          800: '#9a270d', 900: '#7c230e', 950: '#430e05',
        },
        
        // --- LEGACY TOKENS (Preserved to prevent breaking old components) ---
        'buy-sourcing-white': "#FFF",
        'buy-sourcing-black': "#000",
        'buy-sourcing-bglightwhite': "rgba(255, 255, 255, 0.13)",
        'buy-sourcing-blue': "#48439b",
        'buy-sourcing-purple': "#3E4095",
        'buy-sourcing-darkblack': "#161629",
        'buy-sourcing-gray': "#475569",
        'buy-sourcing-lightskyblue': "#F1F5F9",
        'buy-sourcing-lightwhitebg': "rgba(255, 255, 255, 0.25)",
        'buy-sourcing-lightblack': "rgba(0, 0, 0, 0.50)",
        'buy-sourcing-blacklight': "rgba(0, 0, 0, 0.70)",
        'buy-sourcing-bgextralightwhite': "rgba(255, 255, 255, 0.19)",
        'buy-sourcing-lightpurple': "rgba(62, 64, 149, 0.25)",

        'store-white': "#FFF",
        'store-black': "#000",
        'store-bglightwhite': "rgba(255, 255, 255, 0.13)",
        'store-blue': "#48439b",
        'store-purple': "#3E4095",
        'store-darkblack': "#161629",
        'store-gray': "#475569",
        'store-lightskyblue': "#F1F5F9",
        'store-lightwhitebg': "rgba(255, 255, 255, 0.25)",
        'store-lightblack': "rgba(0, 0, 0, 0.50)",
        'store-blacklight': "rgba(0, 0, 0, 0.70)",
        'store-bgextralightwhite': "rgba(255, 255, 255, 0.19)",
        'store-lightpurple': "rgba(62, 64, 149, 0.25)",
        
        // --- SHADCN SYSTEM TOKENS ---
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-120%)' },
        },
        'marquee-left-lg': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-215%)' },
        },
        'marquee-left-sm': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-320%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'marquee-right-lg': {
          '0%': { transform: 'translateX(-215%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'marquee-right-sm': {
          '0%': { transform: 'translateX(-320%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'infinite-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-20%)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee-left': 'marquee-left 25s linear infinite',
        'marquee-left-lg': 'marquee-left-lg 20s linear infinite',
        'marquee-left-sm': 'marquee-left-sm 20s linear infinite',
        'marquee-right': 'marquee-right 25s linear infinite',
        'marquee-right-lg': 'marquee-right-lg 20s linear infinite',
        'marquee-right-sm': 'marquee-right-sm 20s linear infinite',
        'infinite-scroll': 'infinite-scroll 10s linear infinite',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        custom: '0px 4px 15px rgba(0, 0, 0, 0.10)',
        customshadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.10)',
        customboxshadow: '10px 10px 10px 0px rgba(0, 0, 0, 0.08)',
        cardshadow: '5px 5px 10px 0px rgba(0, 0, 0, 0.08)',
        cardshadow2: '0px 4px 18px 0px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
