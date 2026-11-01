import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RankingPoster from '@/components/RankingPoster'

export const metadata: Metadata = {
  title: 'The ranking, as a poster | optimism.fun',
  description:
    'Humanity’s hardest problems, sized by how many people they reach and colored by neglectedness. Every figure is sourced.',
  openGraph: {
    title: 'Humanity’s hardest problems',
    description: 'Sized by people reached. Colored by neglectedness. optimism.fun',
    url: 'https://optimism.fun/poster',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Humanity’s hardest problems',
    description: 'Sized by people reached. Colored by neglectedness.',
  },
}

export default function PosterPage() {
  return (
    <>
      <Navbar />
      <main className="site-shell pt-24 pb-16">
        <p className="font-mono text-small uppercase text-primary mb-3">Poster</p>
        <h1 className="sr-only">The ranking, as a poster</h1>
        <RankingPoster />
        <p className="text-sm text-ink-500 mt-4">
          Share this page. The preview image is the same ranking.
        </p>
      </main>
      <Footer />
    </>
  )
}
