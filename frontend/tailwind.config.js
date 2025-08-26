/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0, 0%, 100%)",
        border: "hsl(220, 13%, 91%)",
        ring: "hsl(210, 100%, 50%)",
        "card-bg": "hsl(0, 0%, 98%)", // Add this line
      },
    },
  },
  plugins: [],
}
