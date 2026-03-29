import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'optimism.fun | Choose Your Quest',
  description:
    'The world\'s biggest problems are humanity\'s biggest opportunities. Find your quest. Join the companies solving what matters most. Meaningful work = your passions x objective worth.',
  keywords: [
    'optimism',
    'meaningful work',
    'quests',
    'critical rationalism',
    'David Deutsch',
    'humanity problems',
    'tech careers',
    'mission-driven',
    'entrepreneurship',
  ],
  openGraph: {
    title: 'optimism.fun | Choose Your Quest',
    description:
      'The world\'s biggest problems are humanity\'s biggest opportunities. Find your quest. Meaningful work = your passions x objective worth.',
    url: 'https://optimism.fun',
    siteName: 'optimism.fun',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'optimism.fun | Choose Your Quest',
    description:
      'The world\'s biggest problems are humanity\'s biggest opportunities. Find your quest.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased bg-deep text-cream relative">
        <div className="starfield" aria-hidden="true" />
        <div className="relative z-10">
          <AuthProvider authConfigured={!!process.env.AUTH_GOOGLE_ID}>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
