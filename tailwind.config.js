const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  darkMode: 'class', // or 'media'

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      spacing: {
        '2px': '2px',
        '4px': '4px',
        '6px': '6px',
        '10px': '10px',
        '12px': '12px',
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
        fhir: {
          header: '#f9fafb',
          border: '#e5e7eb',
          hover: '#f3f4f6',
        },
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require('daisyui'),

    plugin(function ({ addVariant, addUtilities }) {
      // Custom variants
      addVariant('not-first', '&:not(:first-child)');
      addVariant('not-last', '&:not(:last-child)');

      // Resizer grip for column resizing
      addUtilities({
        '.resizer': {
          display: 'inline-block',
          'user-select': 'none',
          'font-size': '14px',
          padding: '0 4px',
          'line-height': '1',
          cursor: 'col-resize',
          height: '100%',
        },
      });
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
};
