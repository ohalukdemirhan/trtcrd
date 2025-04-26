/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e0e1fc',
          200: '#c1c3f9',
          300: '#a3a5f7',
          400: '#8487f4',
          500: '#6366f1', // Primary indigo
          600: '#4f52c1',
          700: '#3b3d91',
          800: '#282960',
          900: '#141430',
        },
        secondary: {
          100: '#d9f7f4',
          200: '#b3efe9',
          300: '#8ee7de',
          400: '#68dfd3',
          500: '#2dd4bf', // Secondary teal
          600: '#24aa99',
          700: '#1b7f73',
          800: '#12554c',
          900: '#092a26',
        },
        accent: {
          100: '#fce0ed',
          200: '#f9c1db',
          300: '#f5a3c9',
          400: '#f284b7',
          500: '#ec4899', // Accent pink
          600: '#bd3a7a',
          700: '#8e2b5c',
          800: '#5e1d3d',
          900: '#2f0e1f',
        },
        purple: {
          500: '#a855f7', // Middle gradient color
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
      },
      boxShadow: {
        'neumorphic': '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff',
        'neumorphic-dark': '5px 5px 10px #1a1a1a, -5px -5px 10px #2c2c2c',
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
} 