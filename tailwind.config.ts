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
        gold: {
          light: "#F5E08B",
          DEFAULT: "#D4AF37",
          dark: "#8A6D1C",
        },
        noir: {
          surface: "#0E0E11",
          background: "#070709",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "serif"],
        accent: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;