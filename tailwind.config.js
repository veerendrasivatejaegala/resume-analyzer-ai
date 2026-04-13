/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090B', // Deep Slate
        panel: 'rgba(24, 24, 27, 0.7)', // Glassmorphism base
        primary: '#8B5CF6',    // Electric Violet
        accent: '#EC4899',     // Fuchsia Pink
        text: '#FAFAFA',       // Ghost White
        subtext: '#A1A1AA',    // Muted Gray
      },
      borderRadius: {
        '4xl': '2.5rem',
      }
    },
  },
  plugins: [],
}