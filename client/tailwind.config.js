/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e1015",
        accent: {
          DEFAULT: "#6e5cf5",
          hover: "#5a4be3",
          light: "rgba(110, 92, 245, 0.15)",
        },
        dark: {
          card: "#161822",
          border: "#262936",
          bg: "#0e1015",
          input: "#1d2030",
          hover: "#222538",
        },
        text: {
          primary: "#f3f4f6",
          secondary: "#9ca3af",
          muted: "#6b7280",
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
