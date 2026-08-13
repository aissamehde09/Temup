/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        teamup: {
          dark: '#071417',
          green: '#65A30D',
          orange: '#F97316',
        },
      },
    },
  },
  plugins: [],
};
