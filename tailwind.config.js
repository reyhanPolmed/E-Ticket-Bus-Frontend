/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,tsx}"],
    theme: {
      extend: {
        backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      fontFamily: {
        // 'bebas-neue' adalah nama custom yang kamu gunakan di Tailwind
        'bebas-neue': ['Bebas Neue', 'sans-serif'], 
        // 'roboto-mono' adalah nama custom yang kamu gunakan di Tailwind
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
      // Kamu bisa menambahkan custom shadow di sini
      boxShadow: {
        // 'neobrutalism' adalah nama custom shadow yang kamu definisikan
        'neobrutalism': '8px 8px 0px black',
        'neobrutalism-sm': '4px 4px 0px black',
      },
      
      },
    },
    plugins: [],
  }