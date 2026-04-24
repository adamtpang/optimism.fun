import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      colors: {
        // Terminal palette: true-black surfaces with warm accents
        ink: {
          DEFAULT: '#08080a',
          100: '#f6f5f2', // cream, primary text on dark
          200: '#d9d7d1', // warm gray
          300: '#9c9a93',
          400: '#6d6b65',
          500: '#4a4844',
          600: '#2a2926',
          700: '#18171a',
          800: '#0f0e11',
          900: '#08080a',
        },
        // Primary accent: amber, used for numbers, key CTAs
        amber: {
          50: '#fef5e7',
          100: '#fbe3bd',
          200: '#f5c97a',
          300: '#e5a13c',
          400: '#c97f1f',
          500: '#a25f15',
          600: '#7a4410',
        },
        // Muted semantic signals (Bloomberg-terminal style)
        terminal: {
          green: '#5c9c70', // welfare, positive
          rose: '#c26070', // x-risk, alert
          violet: '#8b7bc2', // voices, aggregated commentary
          cyan: '#6b98a8', // data, neutral
        },
        // Editorial surfaces (for /about, /methodology)
        paper: {
          DEFAULT: '#13100d',
          50: '#f5ede0',
          100: '#e6d9c1',
          200: '#c9b795',
          copper: '#b45309',
        },
      },
      fontSize: {
        // Tighter, more precise scale — terminal density
        xs: ['0.72rem', { lineHeight: '1rem' }],
        sm: ['0.82rem', { lineHeight: '1.25rem' }],
        base: ['0.92rem', { lineHeight: '1.5rem' }],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
      },
      borderRadius: {
        // Sharper corners for terminal feel
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
