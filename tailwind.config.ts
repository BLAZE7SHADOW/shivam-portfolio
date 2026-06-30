import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#08080a",
        "bg-soft": "#0e0e12",
        ink: "#f4f4f6",
        "ink-dim": "#a1a1ad",
        "ink-faint": "#6b6b78",
        accent: "#f59e0b",
        "accent-2": "#22d3ee",
        panel: "rgba(255,255,255,0.025)",
        "panel-border": "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: {
        "5.5": "1.375rem",
        "4.5": "1.125rem",
      },
      keyframes: {
        "scroll-x": { to: { transform: "translateX(-50%)" } },
      },
      animation: {
        "scroll-x": "scroll-x 28s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
