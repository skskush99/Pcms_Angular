/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      borderWidth:{
        "1" : "1px",
        "1.5" : "1.5px"
      },
      fontWeight:{
        '400':'400'
      }
    },
  },
  plugins: [],
}

