/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Industrial / maintenance palette — deep ink + signal amber (hazard/caution)
        // and a cyan-teal for "in progress / systems ok" states.
        ink: {
          950: '#0B0F13',
          900: '#11161C',
          800: '#171E26',
          700: '#212A34',
          600: '#2E3944',
          500: '#47535F',
          400: '#6B7885',
          300: '#96A2AC',
          200: '#C6CDD3',
          100: '#E7EAED',
        },
        signal: {
          500: '#F2A33A', // caution amber — used sparingly as the signature accent
          600: '#D9861C',
          400: '#F5B85F',
        },
        ok: {
          500: '#2FB8A0', // teal — completed / healthy
          600: '#22947F',
        },
        alert: {
          500: '#E0533D', // high priority red-orange
          600: '#C43F2C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
