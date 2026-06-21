/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        accent: {
          DEFAULT: "rgba(var(--color-accent-rgb), <alpha-value>)",
          hover: "rgba(var(--color-accent-hover-rgb), <alpha-value>)",
          light: "rgba(var(--color-accent-rgb), 0.15)",
        },
        dark: {
          card: "var(--card-color)",
          border: "var(--border-color)",
          bg: "var(--bg-color)",
          input: "var(--input-color)",
          hover: "var(--hover-color)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
