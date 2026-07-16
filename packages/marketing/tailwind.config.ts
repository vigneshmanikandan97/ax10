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
      keyframes: {
        'glow-drift': {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)', opacity: '0.5' },
          '50%': { transform: 'scale(1.08) translate(2%, -2%)', opacity: '0.8' },
        },
        'mesh-a': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(5%, 8%, 0) scale(1.1)' },
        },
        'mesh-b': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-8%, -5%, 0) scale(1.05)' },
        },
        'mesh-c': {
          '0%, 100%': { transform: 'translate3d(0, -50%, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -45%, 0) scale(1.15)' },
        },
        'mesh-drift': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '33%': { transform: 'translate3d(3%, -2%, 0) scale(1.05)' },
          '66%': { transform: 'translate3d(-2%, 3%, 0) scale(1.03)' },
        },
      },
      animation: {
        'glow-drift': 'glow-drift 8s ease-in-out infinite',
        'mesh-a': 'mesh-a 14s ease-in-out infinite',
        'mesh-b': 'mesh-b 18s ease-in-out infinite',
        'mesh-c': 'mesh-c 12s ease-in-out infinite',
        'mesh-drift': 'mesh-drift 28s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
