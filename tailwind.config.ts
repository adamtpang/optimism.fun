import type { Config } from 'tailwindcss'

/**
 * Colors use CSS variables so we can flip theme on <html data-theme="light|dark">.
 * Format: var(--ink-100) → "246 245 242" (space-separated RGB).
 * Tailwind reads this via `rgb(var(--ink-100) / <alpha-value>)`.
 */
const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
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
        // Surfaces + text (theme-swappable)
        ink: {
          DEFAULT: rgb('--bg'),
          100: rgb('--ink-100'),
          200: rgb('--ink-200'),
          300: rgb('--ink-300'),
          400: rgb('--ink-400'),
          500: rgb('--ink-500'),
          600: rgb('--ink-600'),
          700: rgb('--ink-700'),
          800: rgb('--ink-800'),
          900: rgb('--ink-900'),
        },
        // Primary accent, same in both themes
        amber: {
          50: '#fef5e7',
          100: '#fbe3bd',
          200: '#f5c97a',
          300: '#e5a13c',
          400: '#c97f1f',
          500: '#a25f15',
          600: '#7a4410',
        },
        // Semantic signals, same in both themes (adjusted for contrast by usage)
        terminal: {
          green: rgb('--terminal-green'),
          rose: rgb('--terminal-rose'),
          violet: rgb('--terminal-violet'),
          cyan: rgb('--terminal-cyan'),
        },
        paper: {
          DEFAULT: rgb('--paper'),
          50: '#f5ede0',
          100: '#e6d9c1',
          200: '#c9b795',
          copper: '#b45309',
        },
      },
      fontSize: {
        xs: ['0.72rem', { lineHeight: '1rem' }],
        sm: ['0.82rem', { lineHeight: '1.25rem' }],
        base: ['0.92rem', { lineHeight: '1.5rem' }],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
      },
      borderRadius: {
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
