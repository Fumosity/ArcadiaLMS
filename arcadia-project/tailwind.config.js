export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
        "arcadia-red": "#8B0000",
        "white": "#FFFFFF",
        "dark-gray": "#333333",
        "black": "#000000",
        "light-gray": "#f4f4f4",
        "grey": '#D4D4D8',
        "arcadia-black": '#18181B',
        "yellow": '#e8d08d',
        "red": '#de6262',
        "green" : '#8fd28f'
    },
    extend: {
      fontFamily: {
        'Zen': ['"Zen Kaku Gothic Antique"', '"Zen Kaku Gothic New"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

