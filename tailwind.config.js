/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#5AA6FF',
          500: '#2D8BFF',
          600: '#1E6FE0',
          700: '#1A56B8',
          800: '#17408A',
          900: '#132F63',
        },
        ink: '#0F172A',
        canvas: '#F8FAFC',
        accent: '#FFD60A',
        aqua: '#22D3C5',
      },
      spacing: {
        4.5: '1.125rem',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,.04), 0 8px 24px -8px rgba(15,23,42,.10)',
        lift: '0 2px 4px rgba(15,23,42,.04), 0 18px 40px -12px rgba(45,139,255,.28)',
        glow: '0 0 0 4px rgba(45,139,255,.12), 0 10px 30px -6px rgba(45,139,255,.45)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        bubbleUp: {
          '0%': { transform: 'translateY(0) scale(.6)', opacity: '0' },
          '25%': { opacity: '.9' },
          '100%': { transform: 'translateY(-46px) scale(1.1)', opacity: '0' },
        },
        blink: {
          '0%,92%,100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(.1)' },
        },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        bubbleUp: 'bubbleUp 3s ease-in infinite',
        blink: 'blink 4s ease-in-out infinite',
        spinSlow: 'spinSlow 8s linear infinite',
      },
    },
  },
  plugins: [],
}
