/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#eab308', // Sarı
          dark: '#ca8a04',    // Koyu sarı
          light: '#fde047',   // Açık sarı
        },
        secondary: {
          DEFAULT: '#000000', // Siyah
          light: '#1a1a1a',   // Açık siyah
        },
        accent: {
          DEFAULT: '#ffffff', // Beyaz
          dark: '#f3f4f6',    // Koyu beyaz
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 