/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Oswald', ...defaultTheme.fontFamily.sans],
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
        gothic: ['AlternateGothic', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'horizontal-lines':
          'repeating-linear-gradient(transparent,transparent 48px, rgba(0,0,0,.08) 48px, rgba(0,0,0,.08) 49px, transparent 49px)',
      },
    },
  },
  plugins: [],
}
