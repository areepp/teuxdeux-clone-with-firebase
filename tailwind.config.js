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
        'mobile-horizontal-lines':
          'repeating-linear-gradient(transparent,transparent 48px, #e7e5e4 48px, #e7e5e4 49px, transparent 49px)',
        'md-horizontal-lines':
          'repeating-linear-gradient(transparent,transparent 26px, #e7e5e4 26px, #e7e5e4 27px, transparent 27px)',
      },
      width: {
        main: 'calc(100% - 128px)',
      },
      colors: {
        primary: '#f41d12',
      },
    },
  },
  plugins: [],
}
