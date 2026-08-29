/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dashboard palette (admin/employee/client shells)
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
        signal: { 500: '#F2A33A', 600: '#D9861C', 400: '#F5B85F' },
        ok: { 500: '#2FB8A0', 600: '#22947F' },
        alert: { 500: '#E0533D', 600: '#C43F2C' },

        // Auth palette (login/signup/pending) — "checkpoint" identity
        navy: {
          950: '#070B18',
          900: '#0D1428',
          800: '#131C38',
          700: '#1C2848',
          600: '#2A3A63',
          500: '#3F5286',
        },
        teal: { 500: '#2DD4BF', 600: '#14B8A6', 400: '#5EEAD4' },
        violet: { 500: '#8B7CF6', 600: '#7C6AEF', 400: '#A79BFA' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.3)',
        glass: '0 8px 40px rgba(0,0,0,0.45), 0 1px 0 0 rgba(255,255,255,0.06) inset',
      },
      backgroundImage: {
        'mesh-navy':
          'radial-gradient(circle at 15% 10%, rgba(45,212,191,0.16), transparent 40%), radial-gradient(circle at 85% 25%, rgba(139,124,246,0.18), transparent 45%), radial-gradient(circle at 50% 100%, rgba(45,212,191,0.10), transparent 50%)',
      },
    },
  },
  plugins: [],
          }
