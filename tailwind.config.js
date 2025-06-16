const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
     "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#EDEDED",
        section: "#FFFFFF",
        green: "#22C55E",
        blue: "#199BE3",
        alert: "#CE2626",
        advisement: "#FDC541",
        text: "#111111",
        dark: {
          bg: "#1E1E1E",
          section: "#2A2A2A",
          green: "#1E8C4A",
          blue: "#1678B8",
          alert: "#B23B3B",
          advisement: "#E0B13F",
          text: "#F0F0F0",
        },
      },
    },
  },
  plugins: [
    heroui({
      themes: [
        {
          name: "custom",
          definition: {
            primary: "#199BE3",   // blue
            secondary: "#22C55E", // green
            warning: "#FDC541",   // advisement
            danger: "#CE2626",    // alert
            background: "#EDEDED",
            surface: "#FFFFFF",
            content: "#111111",
          },
        },
      ],
    }),
  ],
};