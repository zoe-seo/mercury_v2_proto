/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F9F0',
          100: '#C6F0DC',
          200: '#9FE5C7',
          300: '#6EDAAD',
          400: '#3FCF98',
          500: '#14AE5C',
          600: '#119A51',
          700: '#0E8646',
          800: '#0B723B',
          900: '#095E30',
        },
        accent: {
          50: '#E6F7F7',
          100: '#B3E8E8',
          200: '#80D9D9',
          300: '#4DCACA',
          400: '#26BCBC',
          500: '#00ADAD',
          600: '#009999',
          700: '#008585',
          800: '#007171',
          900: '#005D5D',
        },
        coral: {
          50: '#FFF0ED',
          100: '#FFD6CC',
          200: '#FFBCAB',
          300: '#FFA28A',
          400: '#FF8869',
          500: '#FF6B4A',
          600: '#E65F42',
          700: '#CC533A',
          800: '#B34732',
          900: '#993B2A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'primary': '0 4px 12px rgba(20, 174, 92, 0.25)',
        'primary-lg': '0 8px 20px rgba(20, 174, 92, 0.3)',
      },
    },
  },
  plugins: [],
}
