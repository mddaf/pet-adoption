/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html","./src/**/*.{html,js}"],
  theme: {
    extend: {
        fontFamily: {
          lato:["Lato", "sans-serif"]
          },
    },
  },
  plugins: [],
}