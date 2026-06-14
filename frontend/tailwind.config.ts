import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stock: {
          DEFAULT: '#0c1014',
          950: '#080b0e',
          900: '#0c1014',
          800: '#11171c',
          700: '#182229',
          600: '#22303a',
        },
        parchment: '#e8efe9',
        muted: '#8ba5a0',
        faint: '#566b69',
        foil: {
          DEFAULT: '#9fe7d6',
          teal: '#5fd0c0',
          magenta: '#e58fc7',
          gold: '#d9c38a',
        },
        genuine: '#7fe3c0',
        doubtful: '#e7c46a',
        forgery: '#f08a9c',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      keyframes: {
        sheen: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        riseup: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseseal: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        sealframe: {
          '0%': { borderColor: '#9fe7d6', boxShadow: '0 0 0 0 rgba(159,231,214,0.45)' },
          '100%': { borderColor: '#22303a', boxShadow: '0 0 0 16px rgba(159,231,214,0)' },
        },
      },
      animation: {
        sheen: 'sheen 7s linear infinite',
        riseup: 'riseup 0.5s ease-out forwards',
        pulseseal: 'pulseseal 1.5s ease-in-out infinite',
        sealframe: 'sealframe 1.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
