/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bee: {
          yellow: '#F5C400',
          'yellow-bright': '#FFD700',
          'yellow-dark': '#C9A000',
        },
        gym: {
          black: '#080808',
          charcoal: '#131313',
          'charcoal-mid': '#1E1E1E',
          'charcoal-light': '#2A2A2A',
          red: '#C41E1E',
          'red-dark': '#8B0000',
          'red-bright': '#E02020',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        heading: ['"Oswald"', 'sans-serif'],
        body: ['"Barlow"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.5em',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ticker: 'ticker 20s linear infinite',
      },
    },
  },
  plugins: [],
};
