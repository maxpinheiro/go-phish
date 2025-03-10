/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        red: '#D45252',
        blue: '#5769C8',
        green: '#A9BA42',
        purple: '#975EC3',
      },
      opacity: {
        15: '0.15',
      },
      fontSize: {
        'title-light': [
          '36px',
          {
            fontWeight: '300',
          },
        ],
        'title-regular': [
          '36px',
          {
            fontWeight: '400',
          },
        ],
        'title-medium': [
          '36px',
          {
            fontWeight: '500',
          },
        ],
        'title-semibold': [
          '36px',
          {
            fontWeight: '600',
          },
        ],
        'title-bold': [
          '36px',
          {
            fontWeight: '700',
          },
        ],
        'subtitle-light': [
          '26px',
          {
            fontWeight: '300',
          },
        ],
        'subtitle-regular': [
          '26px',
          {
            fontWeight: '400',
          },
        ],
        'subtitle-medium': [
          '26px',
          {
            fontWeight: '500',
          },
        ],
        'subtitle-semibold': [
          '26px',
          {
            fontWeight: '600',
          },
        ],
        'subtitle-bold': [
          '26px',
          {
            fontWeight: '700',
          },
        ],
        'header-light': [
          '22px',
          {
            fontWeight: '300',
          },
        ],
        'header-regular': [
          '22px',
          {
            fontWeight: '400',
          },
        ],
        'header-medium': [
          '22px',
          {
            fontWeight: '500',
          },
        ],
        'header-semibold': [
          '22px',
          {
            fontWeight: '600',
          },
        ],
        'header-bold': [
          '22px',
          {
            fontWeight: '700',
          },
        ],
      },
    },
  },
  safelist: [
    {
      pattern: /bg-(red|blue|green|purple)/,
      variants: ['hover', 'marker'],
    },
    {
      pattern: /bg-(red|blue|green|purple)\/(10|20|30|40|50)/,
      variants: ['hover', 'marker'],
    },
    {
      pattern: /text-(red|blue|green|purple)/,
      variants: ['hover', 'marker'],
    },
    {
      pattern: /border-(red|blue|green|purple)/,
      variants: ['hover', 'marker'],
    },
    {
      pattern: /fill-(red|blue|green|purple)/,
      variants: ['hover', 'marker', '[&_*]'],
    },
  ],
  plugins: [],
};
