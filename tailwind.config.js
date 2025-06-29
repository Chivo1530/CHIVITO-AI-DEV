/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chivito-orange': '#FF6B35',
        'chivito-dark': '#1A1A1A',
        'chivito-gray': '#2D2D2D',
      },
    },
  },
  plugins: [],
}
