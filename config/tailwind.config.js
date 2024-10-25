const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./public/*.html",
    "./app/helpers/**/*.rb",
    "./app/javascript/**/*.js",
    "./app/views/**/*.{erb,haml,html,slim}",
    "./app/views/**/html.erb",
  ],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0px) rotate(45deg)" },
          "50%": { transform: "translateY(10px) rotate(45deg) " },
        },
      },
      animation: {
        bounce: "bounce 2s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        red: "#B12626",
        black: "#2C2B39",
        white: "#FBF7F4",
        accent: "#4D7EA8",
        gray: {
          dark: "#828489",
          light: "#DCDCDC",
        },
      },
      boxShadow: {
        top: "0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        around: "2px 2px 15px 5px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
  safelist: [
    {
      pattern: /(bg|text|border)-(red|black|gray-ash)/,
    },
  ],
};
