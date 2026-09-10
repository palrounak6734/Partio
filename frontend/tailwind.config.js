/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070b14',
          900: '#0b1222',
          800: '#101b33',
          700: '#18274a',
          600: '#223666',
        },
        cyber: {
          cyan: '#38bdf8',
          indigo: '#818cf8',
          violet: '#a855f7',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'scanline': 'scanlineFull 4.5s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orb-float': 'orbFloat 12s ease-in-out infinite alternate',
      },
      keyframes: {
        scanlineFull: {
          '0%': { top: '2%', opacity: '0.2' },
          '15%': { opacity: '0.95' },
          '85%': { opacity: '0.95' },
          '100%': { top: '96%', opacity: '0.2' },
        },
        orbFloat: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.08)' },
          '100%': { transform: 'translate(-20px, 25px) scale(0.96)' },
        }
      }
    },
  },
  plugins: [],
}
