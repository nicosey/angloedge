/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A2540',
        brass: '#B8956A',
      },
      fontFamily: {
        serif: ['"Source Serif Pro"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '680px',
      },
      lineHeight: {
        tight: '1.4',
      },
      spacing: {
        prose: '1.5rem',
      },
    },
  },
  plugins: [],
};
