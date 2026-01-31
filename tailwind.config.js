/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fond
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#141414',
        'bg-tertiary': '#1f1f1f',
        
        // Surfaces (cards, modals)
        'surface': '#1a1a1a',
        'surface-hover': '#252525',
        'surface-active': '#2f2f2f',
        
        // Bordures
        'border-subtle': '#2a2a2a',
        'border-default': '#3a3a3a',
        
        // Texte
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'text-tertiary': '#6b6b6b',
        
        // Accent
        'accent': '#3b82f6',
        'accent-hover': '#2563eb',
        'accent-subtle': 'rgba(59, 130, 246, 0.1)',
        
        // Bulles de chat
        'bubble-user': '#3b82f6',
        'bubble-assistant': '#2a2a2a',
        
        // Status
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
