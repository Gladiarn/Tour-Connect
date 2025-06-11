/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',

  ],
  theme: {

    fontFamily: {
      sans: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'],

      poppins: ['var(--font-poppins)', 'sans-serif'],
    },
    extend: {
    },
  },
  plugins: [],
};