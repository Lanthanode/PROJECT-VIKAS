/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c4e0d3',
          300: '#9bc8b6',
          400: '#6ea993',
          500: '#4d8e75',
          600: '#39725d',
          700: '#2d594a',
          800: '#15382b', // Indian Railways deep forest green
          900: '#0e261d',
          950: '#071610',
          accent: '#d9e944', // vibrant ticket badge lime/gold
          card: '#163d2f',
        },
        ivory: {
          50: '#fdfdfc',
          100: '#fafaf8',
          200: '#f5f5f0', // Clean warm background from PDF
          300: '#eaeae2',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'ticket': '0 20px 40px -15px rgba(14, 38, 29, 0.35)',
        'card-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
