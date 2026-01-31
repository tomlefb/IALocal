/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Utilise les CSS variables pour le theming (rgb format pour opacity support)
        'bg-primary': 'rgb(var(--bg-primary-rgb) / <alpha-value>)',
        'bg-secondary': 'rgb(var(--bg-secondary-rgb) / <alpha-value>)',
        'bg-tertiary': 'rgb(var(--bg-tertiary-rgb) / <alpha-value>)',

        'surface': 'rgb(var(--surface-rgb) / <alpha-value>)',
        'surface-hover': 'rgb(var(--surface-hover-rgb) / <alpha-value>)',
        'surface-active': 'rgb(var(--surface-active-rgb) / <alpha-value>)',

        'border-subtle': 'rgb(var(--border-subtle-rgb) / <alpha-value>)',
        'border-default': 'rgb(var(--border-default-rgb) / <alpha-value>)',

        'text-primary': 'rgb(var(--text-primary-rgb) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary-rgb) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--text-tertiary-rgb) / <alpha-value>)',

        'accent': '#3b82f6',
        'accent-hover': '#2563eb',
        'accent-subtle': 'rgba(59, 130, 246, 0.1)',

        'bubble-user': '#3b82f6',
        'bubble-assistant': 'rgb(var(--bubble-assistant-rgb) / <alpha-value>)',

        'success': '#22c55e',
        'error': '#ef4444',
        'warning': '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1s ease-in-out infinite',
      },
      keyframes: {
        typing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
