import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#69C991',
        'mint-bright': '#9FFFB0',
        'surface-deep': '#08090A',
        surface: '#121415',
        'surface-raised': '#16191B',
        'border-subtle': '#24282B',
        'text-primary': '#F5F2EB',
        'text-secondary': '#ADB5BC',
        'text-muted': '#8E979F',
        'on-surface-variant': '#C8D0CA',
        brutal: '#000000',
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '2px',
        xl: '4px',
        full: '9999px',
      },
      borderWidth: {
        3: '3px',
      },
      spacing: {
        'margin-desktop': '48px',
        'margin-mobile': '24px',
        gutter: '24px',
        base: '4px',
      },
      maxWidth: {
        'container-max': '1440px',
      },
      boxShadow: {
        'brutal-primary': '4px 4px 0 0 #69C991',
        'brutal-primary-lg': '6px 6px 0 0 #69C991',
        'brutal-primary-sm': '2px 2px 0 0 #69C991',
        'brutal-dark': '4px 4px 0 0 #24282B',
        'brutal-dark-lg': '8px 8px 0 0 #24282B',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        'label-mono': ['"Geist Mono"', 'ui-monospace', 'monospace'],
        'body-lg': ['Geist', 'system-ui', 'sans-serif'],
        'headline-lg': ['Geist', 'system-ui', 'sans-serif'],
        'headline-md': ['Geist', 'system-ui', 'sans-serif'],
        'display-lg': ['Geist', 'system-ui', 'sans-serif'],
        'label-caps': ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'label-mono': [
          '11px',
          { lineHeight: '16px', letterSpacing: '0.1em', fontWeight: '500' },
        ],
        'body-lg': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'headline-lg': [
          '38px',
          { lineHeight: '42px', letterSpacing: '-0.03em', fontWeight: '600' },
        ],
        'headline-md': [
          '24px',
          { lineHeight: '30px', letterSpacing: '-0.02em', fontWeight: '600' },
        ],
        'display-lg': [
          '68px',
          { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '700' },
        ],
        'label-caps': [
          '10px',
          { lineHeight: '14px', letterSpacing: '0.16em', fontWeight: '700' },
        ],
      },
    },
  },
  plugins: [],
} satisfies Config
