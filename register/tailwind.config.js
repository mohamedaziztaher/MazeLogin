/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#EF4444',
          dark: '#1F2937',
        },
        'nird-blue': '#3B82F6',
        'nird-purple': '#A855F7',
        'nird-pink': '#EC4899',
      },
    },
  },
  plugins: [],
}

