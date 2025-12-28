/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}" // 👈 REQUIRED
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
