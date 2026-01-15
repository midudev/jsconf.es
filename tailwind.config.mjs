/** @type {import('tailwindcss').Config} */
import prose from '@tailwindcss/typography'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      center: true,
      screens: {
        lg: '765px',
        xl: '1024px',
        '2xl': '1424px',
      },
    },
    extend: {
      colors: {
        javascript: '#f7df1e',
        'javascript-dark': '#998c06',
        'light-gray': '#7F7F7F',
      },
      fontFamily: {
        clash: ['Clash', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'javascript-radial': 'radial-gradient(ellipse farthest-corner at 0% 0%, #FFFE65, #F7DF1F)',
      },
      padding: {
        section: '1.5rem',
      },
      gridTemplateColumns: {
        24: 'repeat(24, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-7': 'span 7 / span 7',
        'span-8': 'span 8 / span 8',
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
    },
  },
  plugins: [prose],
}
