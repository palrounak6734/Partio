/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        titanium: {
          950: '#07090d',
          900: '#0b0e14',
          850: '#10141d',
          800: '#161c27',
          700: '#212938',
          600: '#2f3b4e',
        },
        aurora: {
          emerald: '#10b981',
          mint: '#34d399',
          gold: '#f59e0b',
          amber: '#fbbf24',
          amethyst: '#8b5cf6',
          violet: '#a855f7',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'shimmer-slow': 'shimmer 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'aurora-glow': 'auroraGlow 10s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
        },
        auroraGlow: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, -15px) scale(1.06)' },
          '100%': { transform: 'translate(-15px, 20px) scale(0.95)' },
        }
      }
    },
  },
  plugins: [],
}
