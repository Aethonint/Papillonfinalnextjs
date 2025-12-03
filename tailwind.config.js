/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        figtree:[ "Figtree", "sans-serif"],
        albert:["Albert Sans", "sans-serif"],
      },
      colors:{
         primarycolor:'#9DCDCD',
         secondarycolor:'#FDC2CF',
         thirdcolor:'#66A3A3',
      },


    },
  },
  plugins: [],
}

