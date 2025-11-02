const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        aurora: "aurora 60s linear infinite",
        "aurora-move": "aurora-move 20s ease-in-out infinite",
        "aurora-flow": "aurora-flow 30s linear infinite", 
        "aurora-pulse": "aurora-pulse 25s ease-in-out infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        "aurora-move": {
          "0%, 100%": {
            backgroundPosition: "0% 50%, 100% 50%",
          },
          "25%": {
            backgroundPosition: "100% 0%, 0% 100%",
          },
          "50%": {
            backgroundPosition: "50% 100%, 50% 0%",
          },
          "75%": {
            backgroundPosition: "0% 50%, 100% 50%",
          },
        },
        "aurora-flow": {
          "0%": {
            backgroundPosition: "-100% 0%",
          },
          "100%": {
            backgroundPosition: "100% 0%",
          },
        },
        "aurora-pulse": {
          "0%, 100%": {
            opacity: "0.2",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.4",
            transform: "scale(1.1)",
          },
        },
      },
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      backgroundImage: {
        'gradient-emerald': 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #059669 100%)',
        'gradient-premium': 'linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FCD34D 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const colors = flattenColorPalette(theme("colors"));
      const utilities = Object.entries(colors).map(([key, value]) => ({
        [`.text-${key}`]: { color: value },
        [`.bg-${key}`]: { backgroundColor: value },
        [`.border-${key}`]: { borderColor: value },
      }));
      addUtilities(utilities.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
    },
  ],
}