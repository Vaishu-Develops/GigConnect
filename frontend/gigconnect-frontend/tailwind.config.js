/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#e4e7ec',
          500: '#4a5568',
          900: '#0A0E27',
        },
        brand: {
          primary: '#0A0E27',
          secondary: '#00D9FF',
          accent: '#B794F6',
          highlight: '#FF6B9D',
        },
        success: '#00FFA3',
        warning: '#FFB800',
        error: '#FF4757',
        info: '#00D9FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}