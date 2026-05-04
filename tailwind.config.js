/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      // ---------------------------------------------------------------------
      // Stitch "Serene Financial Clarity" design tokens
      // Match the YAML spec exactly so pasted Stitch HTML works verbatim.
      // Kept flat kebab-case so utilities look like `bg-primary-container`,
      // `text-on-surface-variant`, etc.
      // ---------------------------------------------------------------------
      colors: {
        ion: {
          primary: 'var(--ion-color-primary, #3880ff)',
          'primary-tint': 'var(--ion-color-primary-tint, #4c8dff)',
          'primary-shade': 'var(--ion-color-primary-shade, #3171e0)',
          base: 'var(--ion-background-color, #ffffff)',
        },

        // Surfaces
        surface: '#f7faf8',
        'surface-dim': '#d7dbd9',
        'surface-bright': '#f7faf8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f1f4f3',
        'surface-container': '#ebefed',
        'surface-container-high': '#e5e9e7',
        'surface-container-highest': '#e0e3e1',
        'surface-variant': '#e0e3e1',
        'on-surface': '#181c1c',
        'on-surface-variant': '#3e4947',
        'inverse-surface': '#2d3130',
        'inverse-on-surface': '#eef1f0',
        outline: '#6e7977',
        'outline-variant': '#bdc9c6',
        'surface-tint': '#006a63',

        // Primary (teal)
        primary: '#005c55',
        'on-primary': '#ffffff',
        'primary-container': '#0f766e',
        'on-primary-container': '#a3faef',
        'inverse-primary': '#80d5cb',
        'primary-fixed': '#9cf2e8',
        'primary-fixed-dim': '#80d5cb',
        'on-primary-fixed': '#00201d',
        'on-primary-fixed-variant': '#00504a',

        // Secondary (teal-green)
        secondary: '#006b5f',
        'on-secondary': '#ffffff',
        'secondary-container': '#6df5e1',
        'on-secondary-container': '#006f64',
        'secondary-fixed': '#71f8e4',
        'secondary-fixed-dim': '#4fdbc8',
        'on-secondary-fixed': '#00201c',
        'on-secondary-fixed-variant': '#005048',

        // Tertiary (warm copper — for cautions / bilingual accents)
        tertiary: '#7f4025',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#9c573a',
        'on-tertiary-container': '#ffe5db',
        'tertiary-fixed': '#ffdbce',
        'tertiary-fixed-dim': '#ffb598',
        'on-tertiary-fixed': '#370e00',
        'on-tertiary-fixed-variant': '#72361b',

        // Error
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // Background
        background: '#f7faf8',
        'on-background': '#181c1c',
      },

      fontFamily: {
        manrope: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },

      fontSize: {
        // Stitch spec — [size, { lineHeight, letterSpacing, fontWeight }]
        'label-caps': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '700' }],
        'body-sm': ['16px', { lineHeight: '24px', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-md': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-lg': ['20px', { lineHeight: '30px', fontWeight: '500' }],
        'headline-md': ['24px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-lg': ['32px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
      },

      spacing: {
        // Stitch spacing aliases — named so raw Stitch HTML drops in verbatim.
        container_padding: '24px',
        gutter_md: '16px',
        stack_gap_md: '12px',
        stack_gap_lg: '24px',
        touch_target_min: '48px',
      },

      boxShadow: {
        soft: '0 4px 24px -4px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 12px 40px -10px rgba(0, 0, 0, 0.14)',
        // Stitch card elevation — used everywhere cards appear.
        'fin-card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'fin-card-hover': '0 6px 28px rgba(0, 0, 0, 0.08)',
        'fin-nav-top': '0 -4px 20px rgba(0, 0, 0, 0.05)',
      },

      keyframes: {
        'fin-fade': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fin-fade': 'fin-fade 0.48s ease-out both',
        'fin-fade-slow': 'fin-fade 0.65s ease-out both',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('ion-dark', 'body.ion-palette-dark &');
    },
  ],
};
