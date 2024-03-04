/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors :{
        darkBlue : '#1D203E',
        darkGrey : '#2C2F48',
        gradientBlue : '#304CD5',
        gradientCyan : '#27DCE5',
        lightPink: '#C743AF',
      },

      fontFamily: {
        'quick': ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

