import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: "#f3ead5",
          100: "#e4dac3",
          200: "#d8cfb8",
          300: "#b7c39e",
          400: "#8fa47f",
          500: "#68856a",
          600: "#486a55",
          700: "#365445",
          800: "#183129",
          900: "#10231d",
          950: "#07110e"
        },
        parchment: "#e4dac3",
        ink: "#f3ead5"
      },
      boxShadow: {
        card: "0 24px 70px rgba(0, 0, 0, 0.34)"
      },
      fontFamily: {
        serif: [
          "\"Iowan Old Style\"",
          "\"Palatino Linotype\"",
          "Palatino",
          "\"Book Antiqua\"",
          "Georgia",
          "serif"
        ],
        sans: [
          "\"Avenir Next\"",
          "Avenir",
          "\"Segoe UI\"",
          "system-ui",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
