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
        royal: {
          DEFAULT: "#0d21a1",
          dark: "#081890",
          light: "#1a33c8",
        },
        amber: {
          brand: "#FF9D00",
          dark: "#e08800",
          light: "#ffb733",
        },
        teal: {
          brand: "#3BBDD4",
          light: "#e8f8fb",
        },
      },
      fontFamily: {
        rubik: ["Rubik", "Arial", "sans-serif"],
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
