module.exports = {
  darkMode: 'class', 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        teal: {
          500: '#14b8a6',
          600: '#0d9488',
        }
      }
    }
  },
  plugins: [],
}
