/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        game: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          card: '#262626',
          accent: '#ef4444',
          text: '#ffffff',
          'text-secondary': '#a0a0a0',
        }
      },
    },
  },
  plugins: [],
}

