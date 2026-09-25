import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          terracotta: "#C85A32",
          "terracotta-dark": "#A84420",
          sandalwood: "#D4A373",
          cream: "#FBF7F0",
          charcoal: "#1A1817",
          card: "#262320",
          indigo: "#2B3A4E",
          gold: "#DAA520",
          bronze: "#CD7F32",
          green: "#2E5A44",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(200, 90, 50, 0.3)",
        "gold-glow": "0 0 25px -5px rgba(218, 165, 32, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
