/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js}", "./index.html"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      gap: {
        '30': '6rem',
      },
      'my-4' : {
        margin: '1rem 0'
      }
    },
  },
  plugins: [],
}
