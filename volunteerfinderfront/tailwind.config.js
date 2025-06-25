/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#006C67',
        accent: '#FF6B6B',
        support: '#FFC145',
        neutralDark: '#2E2E2E',
        neutralLight: '#FDFCFB',
        grayBorder: 'rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}