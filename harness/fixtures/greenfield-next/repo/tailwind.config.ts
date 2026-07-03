import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tempo Deck brand tokens
        beat: {
          DEFAULT: "#f4603e",
          soft: "#ffb59f",
          deep: "#7a2413",
        },
        stage: {
          DEFAULT: "#12131a",
          raised: "#1d1f2b",
        },
        accent: "#4fd1c5",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      spacing: {
        gutter: "1.375rem",
      },
      borderRadius: {
        card: "1.125rem",
      },
    },
  },
  plugins: [],
};

export default config;
