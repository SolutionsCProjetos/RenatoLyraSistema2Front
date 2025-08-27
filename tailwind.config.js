/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'esmerald-cust': '#04a4bc',
        'custom-blue': '#8ed4e4',
        'esmerald-custom': '#0ca4bc',
        'blue-custom': '#038295',
        'hearder-blue': '#1d6a7b',
        'buttonLimpar-500': '#660000',
        'buttonLimpar-600': '#520000',
        'buttonLimpar-700': '#8F0000'
      },
    },
  },
  plugins: [],
}

