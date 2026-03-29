import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Optimistic fun palette
        gold: {
          DEFAULT: '#f5c542',
          dim: '#c9a23a',
          bright: '#ffe066',
        },
        violet: {
          DEFAULT: '#b48eff',
          dim: '#8b6cc4',
          bright: '#d4b8ff',
        },
        cream: '#f0ece2',
        warm: '#b8b2a8',
        muted: '#7a7568',
        deep: '#0c0e1a',
      },
    },
  },
  plugins: [],
}

export default config
