/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.7' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 50%, 90%': { transform: 'translateX(-3px)' },
          '30%, 70%': { transform: 'translateX(3px)' },
        },
      },
      animation: {
        'bubble-pop': 'pop 1.2s ease-in-out infinite',
        shake: 'shake 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
