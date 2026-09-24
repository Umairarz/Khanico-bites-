import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1C1B19",
        chili: "#C8391E",
        "chili-dark": "#A62E17",
        turmeric: "#E8A33D",
        cream: "#FBF6EE",
        basil: "#2F5233",
        stone: "#8A8378",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        sharp: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
