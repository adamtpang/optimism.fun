import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Providers from '@/components/Providers'
import { PostHogProvider } from './providers'
import './globals.css'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex-sans',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fraunces',
})

export const metadata: Metadata = {
  title: "optimism.fun | Humanity's Quest Log",
  description:
    "A ranked dashboard of humanity's most important problems. All problems are explainable, all solutions are creatable. Companies, founders, countries, crypto, and capital mapped to the quest they serve.",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} ${fraunces.variable}`}
    >
      <body className="antialiased">
        <PostHogProvider>
          <Providers>{children}</Providers>
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
        <footer style={{padding: '1.5rem 1rem', textAlign: 'center', fontSize: '0.75rem', opacity: 0.6}}>
          Built by <a href="https://adampang.com" style={{textDecoration: 'underline'}}>Adam Pangelinan</a>
          {' · '}<a href="https://anchormarianas.com" style={{textDecoration: 'underline'}}>Anchor Marianas LLC</a>
          {' · '}<a href="https://sellsniper.com" style={{textDecoration: 'underline'}}>More projects</a>
        </footer>
      </body>
    </html>
  )
}
