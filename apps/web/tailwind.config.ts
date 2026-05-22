import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: "#070b14",
          subtle: "#0c1322",
          raised: "#111a2c",
        },
        ph: {
          violet: "#7c3aed",
          orange: "#fb923c",
          cyan: "#22d3ee",
          lime: "#a3e635",
          ember: "#f97316",
        },
        glass: "rgba(255,255,255,0.04)",
      },
      backgroundImage: {
        "ph-gradient":
          "radial-gradient(120% 80% at 20% 0%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(80% 60% at 80% 100%, rgba(34,211,238,0.15), transparent 60%), linear-gradient(180deg, #07091a 0%, #0a0f24 60%, #06091a 100%)",
        "ph-accent":
          "linear-gradient(135deg, #7c3aed 0%, #f97316 100%)",
        "ph-accent-2":
          "linear-gradient(135deg, #22d3ee 0%, #a3e635 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 0 1px rgba(124,58,237,0.5), 0 8px 30px rgba(124,58,237,0.3)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
