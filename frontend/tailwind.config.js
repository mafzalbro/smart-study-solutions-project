// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        foreground: 'rgb(var(--foreground-rgb))',
        'background-start-rgb': '255, 222, 204',
        'background-end-rgb': '255, 238, 228',
      },
    },
  },
  darkMode: 'class', // Enable dark mode using a class
  plugins: [],
};
