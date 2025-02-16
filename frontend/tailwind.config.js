/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#121212',
        grayText: '#b3b3b3',
        grayBox: '#2F2E2E',
        dark: '#121212',
        filterButton: '#212121',
        hoverGray: '#292828',
        spotifyGreen: '#1db954',
        blackTint: 'rgba(0, 0, 0, 0.5)',
        miniHover: '#535353',
        lighterGray: '#8a8888',
        lightGreen: '#37c769'
      }
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
}

