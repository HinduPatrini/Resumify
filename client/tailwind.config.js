/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--bg-color-rgb), <alpha-value>)",
        accent: {
          DEFAULT: "rgba(var(--color-accent-rgb), <alpha-value>)",
          hover: "rgba(var(--color-accent-hover-rgb), <alpha-value>)",
          light: "rgba(var(--color-accent-rgb), 0.15)",
        },
        dark: {
          card: "rgba(var(--card-color-rgb), <alpha-value>)",
          border: "rgba(var(--border-color-rgb), <alpha-value>)",
          bg: "rgba(var(--bg-color-rgb), <alpha-value>)",
          input: "rgba(var(--input-color-rgb), <alpha-value>)",
          hover: "rgba(var(--hover-color-rgb), <alpha-value>)",
        },
        text: {
          primary: "rgba(var(--text-primary-rgb), <alpha-value>)",
          secondary: "rgba(var(--text-secondary-rgb), <alpha-value>)",
          muted: "rgba(var(--text-muted-rgb), <alpha-value>)",
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
