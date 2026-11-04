/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f8fafc',
        surface: '#ffffff',
        'surface-2': '#f1f5f9',
        border: '#e2e8f0',
        muted: '#64748b',
        ink: '#1e293b',
        accent: '#d97706',
        'accent-dim': '#fef3c7',
        'accent-light': '#fffbeb',
        gain: '#16a34a',
        loss: '#dc2626',
        gold: '#d97706',
        silver: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
