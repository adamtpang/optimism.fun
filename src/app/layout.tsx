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
  title: "optimism.fun | Humanity's Quest Log",
  description:
    "A ranked dashboard of humanity's most important problems. All problems are explainable, all solutions are creatable. Companies, founders, and capital mapped to the quest they serve.",
  keywords: [
    'optimism',
    'critical rationalism',
    'David Deutsch',
    'choose good quests',
    'effective altruism',
    'e/acc',
    'progress studies',
    'techno-capitalism',
  ],
  openGraph: {
    title: "optimism.fun | Humanity's Quest Log",
    description:
      "A ranked dashboard of humanity's most important problems, scored on welfare, x-risk, and utility delta. Infinite problems, infinite solutions.",
    url: 'https://optimism.fun',
    siteName: 'optimism.fun',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "optimism.fun | Humanity's Quest Log",
    description:
      "All problems are explainable. All solutions are creatable. A ranked dashboard of humanity's most important problems.",
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
