import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "var(--white)",
        black: "var(--black)",
        
        // Primary colors
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          950: "var(--primary-950)",
        },

        // Primary colors
        indigo: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          950: "var(--primary-950)",
        },
        
        // Neutral colors
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
          950: "var(--neutral-950)",
        },
        
        // Success, warning, error colors
        success: {
          50: "var(--success-50)",
          500: "var(--success-500)",
          900: "var(--success-900)",
        },
        warning: {
          50: "var(--warning-50)",
          500: "var(--warning-500)",
          900: "var(--warning-900)",
        },
        error: {
          50: "var(--error-50)",
          500: "var(--error-500)",
          900: "var(--error-900)",
        },
        
        // UI element specific
        card: {
          DEFAULT: "var(--card-background)",
          foreground: "var(--card-foreground)",
        },
        button: {
          primary: {
            DEFAULT: "var(--button-primary-background)",
            foreground: "var(--button-primary-foreground)",
            hover: "var(--button-primary-hover)",
          },
        },
        input: {
          DEFAULT: "var(--input-background)",
          border: "var(--input-border)",
          focus: "var(--input-focus-border)",
        },
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [],
} satisfies Config;
