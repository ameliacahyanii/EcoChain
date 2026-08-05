import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16A34A",
          hover: "#15803D",
          light: "#DCFCE7",
        },
        secondary: {
          DEFAULT: "#0D9488",
          hover: "#0F766E",
        },
        accent: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
        },
        danger: {
          DEFAULT: "#DC2626",
          hover: "#B91C1C",
        },
        neutral: {
          bg: "#F9FAFB",
          text: "#111827",
          border: "#E5E7EB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
    },
  },
  plugins: [],
};

export default config;
