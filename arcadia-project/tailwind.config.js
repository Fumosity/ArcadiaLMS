export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
        "arcadia-red": "#8B0000",
        "white": "#FFFFFF",
        "dark-gray": "#333333",
        "black": "#000000",
        "light-gray": "#f4f4f5",
    },
    extend: {
      fontFamily: {
        'arcadia': ['Georgia', 'serif'],
          body: ['"Zen Kaku Gothic Antique"', '"Zen Kaku Gothic New"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

