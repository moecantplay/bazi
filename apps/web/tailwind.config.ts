import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        cinnabar: "var(--cinnabar)",
        "paper-raised": "var(--paper-raised)",
        surface: "var(--surface)",
        hairline: "var(--hairline)",
        element: {
          wood: "var(--element-wood)",
          fire: "var(--element-fire)",
          earth: "var(--element-earth)",
          metal: "var(--element-metal)",
          water: "var(--element-water)"
        }
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "sans-serif"],
        display: ["var(--font-figtree)", "system-ui", "sans-serif"],
        han: ['"Songti SC"', '"Noto Serif SC"', "serif"]
      },
      maxWidth: {
        app: "28rem"
      }
    }
  },
  plugins: []
};

export default config;
