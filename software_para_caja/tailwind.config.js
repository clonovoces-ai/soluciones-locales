/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pos: {
          bg: '#0F172A',
          card: '#1E293B',
          accent: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
          border: '#334155',
          text: '#F8FAFC',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Roboto Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
