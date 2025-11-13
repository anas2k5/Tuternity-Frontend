/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ Dark mode support
  darkMode: "class",

  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {

      // 🌅 Page Backgrounds (Landing-style gradients)
      backgroundImage: {
        "landing-light":
          "linear-gradient(135deg, #e0e7ff, #f5d0fe, #ddd6fe, #fbcfe8)",
        "landing-dark":
          "linear-gradient(135deg, #0a0c1d, #111827, #1e1b4b, #312e81)",
      },

      // 🌈 Gradient Animations
      backgroundSize: {
        "200%": "200%",
      },

      animation: {
        "gradient-x": "gradient-x 8s ease infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      keyframes: {
        "gradient-x": {
          "0%, 100%": { "background-position": "left center" },
          "50%": { "background-position": "right center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },

      // 💫 Glow & Shadow Effects
      boxShadow: {
        glow: "0 0 25px rgba(255, 255, 255, 0.3)",
        "inner-glow": "inset 0 0 15px rgba(255, 255, 255, 0.2)",
      },

      // 🎨 Custom Colors
      colors: {
        "neon-blue": "#4f8cff",
        "neon-pink": "#ff4f9f",
        "deep-purple": "#5f27cd",
        "soft-indigo": "#667eea",
        "electric-blue": "#3b82f6",
      },

      // 🧊 Backdrop enhancements
      backdropBlur: {
        xs: "2px",
      },
    },
  },

  plugins: [require("tailwind-scrollbar-hide")],
};
