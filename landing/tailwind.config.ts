import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mc: {
          gold: "#FFAA00",
          green: "#55FF55",
          "dark-green": "#00AA00",
          red: "#FF5555",
          "dark-red": "#AA0000",
          aqua: "#55FFFF",
          gray: "#AAAAAA",
          "dark-gray": "#555555",
          yellow: "#FFFF55",
        },
        bg: {
          dark: "#1a1a2e",
          darker: "#12121f",
        },
      },
      fontFamily: {
        pixel: ['"Galmuri11"', "monospace"],
        "pixel-bold": ['"Galmuri11-Bold"', '"Galmuri11"', "monospace"],
        title: ['"Press Start 2P"', "monospace"],
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-delayed": "float 3s ease-in-out 1.5s infinite",
        "toast-in": "toastIn 0.5s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        toastIn: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(85, 255, 85, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(85, 255, 85, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
