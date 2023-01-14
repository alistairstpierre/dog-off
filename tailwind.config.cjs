/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      'phone': '320px',
      // => @media (min-width: 320px) { ... }
  
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }
  
      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }
    },
  },
  plugins: [],
};
