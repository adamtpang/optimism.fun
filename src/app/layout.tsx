import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono, Fraunces } from 'next/font/google'
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

const SITE_URL = 'https://optimism.fun'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "optimism.fun | Problems, capital, talent",
  description:
    "Humanity's hardest problems, ranked with sourced numbers. Bring money or work.",
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
    title: "optimism.fun | Problems, capital, talent",
    description:
      "Humanity's hardest problems, ranked with sourced numbers. Bring money or work.",
    url: SITE_URL,
    siteName: 'optimism.fun',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "optimism.fun | Problems, capital, talent",
    description:
      "Humanity's hardest problems, ranked with sourced numbers. Bring money or work.",
  },
}

const organizationLd = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'optimism.fun',
  url: SITE_URL,
  logo: `${SITE_URL}/brand/optimism-mark.svg`,
  sameAs: ['https://github.com/adamtpang/optimism.fun'],
}

const websiteLd = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'optimism.fun',
  description:
    "Humanity's hardest problems, ranked with sourced numbers. Bring money or work.",
  publisher: { '@id': `${SITE_URL}/#organization` },
  creator: { '@id': `${SITE_URL}/#organization` },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [organizationLd, websiteLd],
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PostHogProvider>
          <Providers>{children}</Providers>
        </PostHogProvider>
        <SpeedInsights />
        <footer style={{padding: '1.5rem 1rem', textAlign: 'center', fontSize: '0.75rem', opacity: 0.6}}>
          Built by <a href="https://adampang.com" style={{textDecoration: 'underline'}}>Adam Pangelinan</a>
          {' · '}<a href="https://anchormarianas.com" style={{textDecoration: 'underline'}}>Anchor Marianas LLC</a>
          {' · '}<a href="/about" style={{textDecoration: 'underline'}}>About</a>
          {' · '}<a href="/contact" style={{textDecoration: 'underline'}}>Contact</a>
          {' · '}<a href="/privacy" style={{textDecoration: 'underline'}}>Privacy</a>
          {' · '}<a href="https://sellsniper.com" style={{textDecoration: 'underline'}}>More projects</a>
        </footer>
      </body>
    </html>
  )
}
