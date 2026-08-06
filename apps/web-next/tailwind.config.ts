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
        anchor: "var(--anchor)",
        "signal-amber": "var(--signal-amber)",
        "signal-amber-fill": "var(--signal-amber-fill)",
        element: {
          wood: "var(--element-wood)",
          fire: "var(--element-fire)",
          earth: "var(--element-earth)",
          metal: "var(--element-metal)",
          water: "var(--element-water)"
        },
        "element-fill": {
          wood: "var(--element-wood-fill)",
          fire: "var(--element-fire-fill)",
          earth: "var(--element-earth-fill)",
          metal: "var(--element-metal-fill)",
          water: "var(--element-water-fill)"
        }
      },
      boxShadow: {
        hero: "var(--shadow-hero)",
        card: "var(--shadow-card)",
        node: "var(--shadow-node)",
        nav: "var(--shadow-nav)"
      },
      borderRadius: {
        hero: "var(--radius-hero)",
        card: "var(--radius-card)",
        tile: "var(--radius-tile)",
        sheet: "var(--radius-sheet)",
        field: "var(--radius-field)"
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "sans-serif"],
        display: ["var(--font-bricolage)", "var(--font-figtree)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
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
