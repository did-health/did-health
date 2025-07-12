const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  darkMode: 'class', // Use 'media' for prefers-color-scheme

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
      },
      colors: {
        brand: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#f05252',
          600: '#e02424',
          700: '#c81e1e',
          800: '#9b1c1c',
          900: '#771d1d',
        },
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'), // Better form element styles
    require('@tailwindcss/typography'), // Prose/markdown
    require('@tailwindcss/aspect-ratio'), // Aspect-ratio utilities
    require('@tailwindcss/container-queries'), // Responsive components
    require('daisyui'), // Component library
    plugin(({ addVariant }) => {
      // Custom variants (like first-child, not-last, etc.)
      addVariant('not-first', '&:not(:first-child)')
      addVariant('not-last', '&:not(:last-child)')
    }),
  ],

  daisyui: {
    themes: ['light', 'dark', 'cyberpunk'],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
  },
}
