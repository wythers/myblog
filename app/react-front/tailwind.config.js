/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            pre: {
              background: 'currentcolor',
            },
          },
        },
      },
      screens: {
        'desktop': '1860px',
        'lg': '1280px',
        'mini': '450px'
      },
      backgroundImage: {
        'gradient-y-to-r-100': "linear-gradient(330deg, #fff59a 20%, #ff6d6d 100%)",
        'gradient-y-to-r-60': "linear-gradient(330deg, #fff59a66 20%, #ff6d6d 100%)",
        'gradient-b-to-g-100': "linear-gradient(150deg, #569AFF 10.21%, #88DFAB 84.57%)",
        'gradient-b-to-g-60': "linear-gradient(150deg, #569AFF66 10.21%, #88DFAB 84.57%)",
      },
      boxShadow: {
        'r-cir-light': "inset 0 0 100px -30px #fafafa, inset 0px 0px 40vw 40vw rgb(255 109 109), 0 0 120px 80px rgb(255 109 109)",
        'r-cir-dark': "inset 0 0 100px -40px #fafafa, inset 0px 0px 40vw 40vw rgb(255 109 109), 0 0 70px 40px rgb(255 109 109)",
        'y-cir-light': "inset 0 0 100px -30px #fafafa, inset 0px 0px max(60px, 6vw) max(60px, 6vw) #FFB74B, 0 0 120px 80px #FFB74B",
        'y-cir-dark': "inset 0 0 100px -40px #fafafa, inset 0px 0px max(60px, 6vw) max(60px, 6vw) #FFB74B, 0 0 70px 40px #FFB74B",
        'g-cir-light': "inset 0 0 100px -30px #fafafa, inset 0px 0px max(70px, 12vw) max(70px, 12vw) #88DFAB, 0 0 120px 80px #88DFAB",
        'g-cir-dark': "inset 0 0 100px -40px #fafafa, inset 0px 0px max(70px, 12vw) max(70px, 12vw) #88DFAB, 0 0 70px 40px #88DFAB",
        'b-cir-light': "inset 0 0 100px -30px #fafafa, inset 0px 0px max(70px, 8vw) max(70px, 8vw) #569AFFB3, 0 0 120px 80px #569AFFB3",
        'b-cir-dark': "inset 0 0 100px -40px #fafafa, inset 0px 0px max(70px, 8vw) max(70px, 8vw) #569AFF, 0 0 70px 40px #569AFF"
      },
      inset: {
        'rm': 'max(-720px, -50vw)',
        'yl': 'min(-20px, -2vw)',
        'yt': '40vh',
        'gt': '-50vh',
        'gb': '',
        'gr': '20vw',
        'grl': '10vw',
        'bb': '40px',
        'bl': '100px',
        'st': 'calc(70%-1px)',
      },
      width: {
        'rw': 'min(1440px, 100%)',
        'yw': 'max(240px, 20vw)',
        'gw': 'min(576px, 40vw)',
        'bw': 'min(200px, 30vw)',
        'globalw':'max(180px, 20vw)',
   
      },
      height: {
        'globalw':'max(180px, 20vw)',
        'sideh': 'calc(100vh - 120px)',
      },
      minHeight: {
        'mkh': 'calc(100vh - 150px)',
      },
      colors: {
        'zonic-default': 'rgb(24 24 27)'
      },
      cursor: {
        'fancy': `url(/imgs/cursor.png) 39 39, auto`,
      },
      animation: {
        'fast-pulse': 'pulseplus 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'medi-pulse': 'pulseplus 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slow-pulse': 'pulseplus 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slow-ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;'
      },
      keyframes: {
        'pulseplus': {
          '50%': {
            opacity: .6
          },
        },
      },
      gridTemplateRows: {
        '3r': '150px 50px 1fr'
      },
      fontSize: {
        'footer': ['13px', '18px']
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
  ],
  darkMode: 'selector',
})

