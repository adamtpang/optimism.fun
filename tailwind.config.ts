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
        // Primary accent — sky blue. Class name kept as `amber-*` for legacy
        // continuity (~86 call sites); semantic role is "the bright accent."
        // Rename to `accent-*` later if it bothers anyone.
        amber: {
          50: '#f0f9ff',  // sky-50
          100: '#e0f2fe', // sky-100
          200: '#bae6fd', // sky-200
          300: '#0ea5e9', // sky-500 — primary punch on white
          400: '#0284c7', // sky-600 — hover / pressed
          500: '#0369a1', // sky-700 — heavy borders / focus rings
          600: '#075985', // sky-800
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
          50: '#f1f5f9',  // slate-100
          100: '#e2e8f0', // slate-200
          200: '#cbd5e1', // slate-300
          copper: '#0369a1', // sky-700 — used as paper-copper accent on .surface-paper sections
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
