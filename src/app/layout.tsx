import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
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
  title: 'optimism.fun | The Infinite Game',
  description:
    'Money is finite. Problems and solutions are infinite. Apply critical rationalism to capitalism, find your economic superpower, and solve problems for humanity.',
  keywords: [
    'optimism',
    'capitalism',
    'critical rationalism',
    'David Deutsch',
    'economics',
    'entrepreneurship',
  ],
  openGraph: {
    title: 'optimism.fun | The Infinite Game',
    description:
      'Money is finite. Problems and solutions are infinite. Apply critical rationalism to capitalism and find your economic superpower.',
    url: 'https://optimism.fun',
    siteName: 'optimism.fun',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'optimism.fun | The Infinite Game',
    description:
      'Money is finite. Problems and solutions are infinite. Apply critical rationalism to capitalism and find your economic superpower.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
