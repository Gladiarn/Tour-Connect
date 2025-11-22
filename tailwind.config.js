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
      screens: {
        'xs': '475px',      // Extra small devices
        'sm': '640px',      // Small devices
        'md': '768px',      // Medium devices
        'lg': '1024px',     // Large devices
        'xl': '1280px',     // Extra large devices   // 1X large devices
        '2xl': '1536px',    // 2X large devices
        '3xl' : '1600px'
      }
    },
  },
  plugins: [],
};