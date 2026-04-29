/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        ion: {
          primary: 'var(--ion-color-primary, #3880ff)',
          'primary-tint': 'var(--ion-color-primary-tint, #4c8dff)',
          'primary-shade': 'var(--ion-color-primary-shade, #3171e0)',
          base: 'var(--ion-background-color, #ffffff)',
        },
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 12px 40px -10px rgba(0, 0, 0, 0.14)',
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
