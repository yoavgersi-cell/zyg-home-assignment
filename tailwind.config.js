/** @type {import('tailwindcss').Config} */
module.exports = {
  // Preflight off: the marketing landing page at "/" has its own global CSS
  // and must not be reset. The agent app scopes its own reset under .gia.
  corePlugins: { preflight: false },
  content: [
    './app/agent/**/*.{ts,tsx}',
    './components/agent/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A2540',
        accent: {
          DEFAULT: '#3E63DD',
          soft: '#EEF1FE',
          line: '#DCE3FB',
        },
        canvas: '#FAFBFC',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Inter',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,42,77,.04), 0 4px 16px rgba(16,42,77,.05)',
        pop: '0 8px 30px rgba(16,42,77,.10)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .35s cubic-bezier(.21,.86,.4,1) both',
      },
    },
  },
  plugins: [],
};
