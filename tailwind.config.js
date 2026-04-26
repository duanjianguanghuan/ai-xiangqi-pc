/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a237e',
        secondary: '#ffd700',
        light: '#f5f5f5',
        dark: '#333333',
        'light-brown': '#f0d9b5',
        'dark-brown': '#b58863',
        'red-piece': '#e53935',
        'black-piece': '#212121',
      },
      fontFamily: {
        serif: ['serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}