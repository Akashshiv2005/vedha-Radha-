/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#FDF4F5',
          100: '#FBE8EB',
          200: '#F5CCD2',
          700: '#752431',
          800: '#5C1D27',
          900: '#48161E',
          950: '#340E14',
        },
        gold: {
          50: '#FAF6EE',
          100: '#F3EAD3',
          200: '#E6D3A3',
          300: '#D7BA72',
          400: '#C5A059',
          500: '#B38E46',
          600: '#967433',
          700: '#735724',
        },
        ivory: {
          50: '#FDFCFA',
          100: '#FAF8F4',
          200: '#F4EFE6',
          300: '#EDE5D8',
          400: '#DFD4C2',
          500: '#C9BBA5',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(92, 29, 39, 0.06)',
        'card': '0 2px 12px -1px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
