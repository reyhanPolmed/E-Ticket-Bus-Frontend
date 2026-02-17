/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#135bec",
        "primary-hover": "#114ec4",
        "primary-light": "#ebf1fd",
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
        'bebas-neue': ['Bebas Neue', 'sans-serif'], 
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        "DEFAULT": "0.25rem", 
        "lg": "0.5rem", 
        "xl": "0.75rem", 
        "full": "9999px"
      },
      boxShadow: {
        'neobrutalism': '8px 8px 0px black',
        'neobrutalism-sm': '4px 4px 0px black',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}