/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // Indigo
        surface: "#F8FAFC", // Cool Gray
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}