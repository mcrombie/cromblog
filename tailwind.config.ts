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
          50: "#f4f7f2",
          100: "#e8eee3",
          200: "#d2ddca",
          300: "#adc3a6",
          400: "#87a282",
          500: "#6a8665",
          600: "#546d50",
          700: "#405440",
          800: "#344434",
          900: "#243024"
        },
        parchment: "#f7f4ee",
        ink: "#1f261f"
      },
      boxShadow: {
        card: "0 18px 40px rgba(36, 48, 36, 0.08)"
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "\"Times New Roman\"", "Times", "serif"],
        sans: ["\"Avenir Next\"", "Avenir", "\"Segoe UI\"", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

