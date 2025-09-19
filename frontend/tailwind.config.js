/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'durga-orange': '#FF6B35',
        'durga-red': '#DC2626',
        'durga-yellow': '#FBBF24',
      }
    },
  },
  plugins: [],
}
