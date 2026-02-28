/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#6366f1',
        'primary-hover': '#4f46e5',
        secondary: '#94a3b8',
        accent:    '#f43f5e',
        error:     '#ef4444',
        success:   '#10b981',
        border:    '#334155',
        'bg-main': '#0f172a',
        'bg-card': '#1e293b',
        'text-main':  '#f8fafc',
        'text-muted': '#94a3b8',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
