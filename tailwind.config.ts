import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

/**
 * Design tokens from the 2026-11-01 design spec.
 * Teal is action. Blue is information. Neutrals carry body text.
 * Gold, vermilion and blue are the three visitor classes: patron, founder, researcher.
 * xs/sm are pinned to 14px so existing utilities cannot render below the floor.
 */
const hsl = (name: string) => `hsl(var(${name}) / <alpha-value>)`
const rgb = (name: string) => `rgb(var(${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/visitor-classes.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        figure: ['var(--font-figure)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
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
        teal: {
          50: '#EFFCF9',
          100: '#CDF5EC',
          200: '#9BE9DA',
          300: '#5FD4C3',
          400: '#2BB8A8',
          500: '#12998C',
          600: '#0B7A71',
          700: '#0C625B',
          800: '#0E4F4A',
          900: '#0F3F3C',
        },
        blue: {
          50: '#EFF5FF',
          100: '#DBE8FE',
          200: '#BCD4FD',
          300: '#8AB5FA',
          400: '#5590F4',
          500: '#2F6FE6',
          600: '#1F56C9',
          700: '#1B45A3',
          800: '#1B3B82',
          900: '#1A3165',
        },
        neutral: {
          50: '#F7F9FA',
          100: '#EFF2F4',
          200: '#E1E6EA',
          300: '#C9D1D8',
          400: '#97A3AE',
          500: '#677480',
          600: '#4C5864',
          700: '#36414B',
          800: '#232C35',
          900: '#121920',
        },
        terminal: {
          green: rgb('--terminal-green'),
          rose: rgb('--terminal-rose'),
          violet: rgb('--terminal-violet'),
          cyan: rgb('--terminal-cyan'),
        },
        amber: {
          50: '#EFFCF9',
          100: '#CDF5EC',
          200: '#0C625B',
          300: '#0C625B',
          400: '#0B7A71',
          500: '#0B7A71',
          600: '#0E4F4A',
        },
        paper: {
          DEFAULT: rgb('--paper'),
          50: '#F7F9FA',
          100: '#EFF2F4',
          200: '#E1E6EA',
          copper: '#0C625B',
        },
        background: hsl('--background'),
        foreground: hsl('--foreground'),
        card: { DEFAULT: hsl('--card'), foreground: hsl('--card-foreground') },
        popover: { DEFAULT: hsl('--popover'), foreground: hsl('--popover-foreground') },
        primary: { DEFAULT: hsl('--primary'), foreground: hsl('--primary-foreground') },
        secondary: { DEFAULT: hsl('--secondary'), foreground: hsl('--secondary-foreground') },
        muted: { DEFAULT: hsl('--muted'), foreground: hsl('--muted-foreground') },
        accent: { DEFAULT: hsl('--accent'), foreground: hsl('--accent-foreground') },
        destructive: { DEFAULT: hsl('--destructive'), foreground: hsl('--destructive-foreground') },
        border: hsl('--border'),
        input: hsl('--input'),
        ring: hsl('--ring'),
        info: hsl('--info'),
        patron: {
          DEFAULT: 'var(--class-patron-fill)',
          on: 'var(--class-patron-on)',
          ink: 'var(--class-patron-ink)',
          tint: 'var(--class-patron-tint)',
        },
        founder: {
          DEFAULT: 'var(--class-founder-fill)',
          on: 'var(--class-founder-on)',
          ink: 'var(--class-founder-ink)',
          tint: 'var(--class-founder-tint)',
        },
        researcher: {
          DEFAULT: 'var(--class-researcher-fill)',
          on: 'var(--class-researcher-on)',
          ink: 'var(--class-researcher-ink)',
          tint: 'var(--class-researcher-tint)',
        },
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
          other: 'var(--chart-other)',
        },
      },
      fontSize: {
        xs: ['14px', { lineHeight: '20px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        'display-1': ['64px', { lineHeight: '68px', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-2': ['48px', { lineHeight: '52px', letterSpacing: '-0.025em', fontWeight: '600' }],
        h1: ['36px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        h2: ['28px', { lineHeight: '34px', letterSpacing: '-0.015em', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        body: ['16px', { lineHeight: '24px' }],
        small: ['14px', { lineHeight: '20px' }],
        label: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        table: ['14px', { lineHeight: '20px' }],
        'data-xl': ['48px', { lineHeight: '52px', fontWeight: '600' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(16, 24, 40, 0.06)',
        DEFAULT: '0 1px 2px rgba(16, 24, 40, 0.06)',
        md: '0 4px 12px -2px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04)',
        lg: '0 16px 40px -8px rgba(16, 24, 40, 0.12)',
      },
      transitionDuration: {
        150: '120ms',
        200: '200ms',
        300: '320ms',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
