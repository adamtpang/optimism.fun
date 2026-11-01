import HeroMedia, { type MediaSource } from './HeroMedia'
import Credit from './Credit'
import { mediaCredit } from './credits'

type Kind = 'bluemarble' | 'blackmarble' | 'sunrise' | 'cdc' | 'solar'

const MEDIA: Record<Kind, { creditId: string; sources: MediaSource[]; width: number; height: number }> = {
  bluemarble: {
    creditId: 'bluemarble',
    width: 1280,
    height: 1280,
    sources: [
      { media: '(max-width: 767px)', avif: '/media/bluemarble-828.avif', webp: '/media/bluemarble-828.webp' },
      { avif: '/media/bluemarble-1280.avif', webp: '/media/bluemarble-1280.webp' },
    ],
  },
  blackmarble: {
    creditId: 'blackmarble',
    width: 1600,
    height: 800,
    sources: [
      { media: '(max-width: 767px)', avif: '/media/blackmarble-828.avif', webp: '/media/blackmarble-828.webp' },
      { avif: '/media/blackmarble-1600.avif', webp: '/media/blackmarble-1600.webp' },
    ],
  },
  sunrise: {
    creditId: 'iss_sunrise',
    width: 1600,
    height: 900,
    sources: [
      { media: '(max-width: 767px)', avif: '/media/iss_sunrise-828.avif', webp: '/media/iss_sunrise-828.webp' },
      { avif: '/media/iss_sunrise-1600.avif', webp: '/media/iss_sunrise-1600.webp' },
    ],
  },
  cdc: {
    creditId: 'cdc_lab',
    width: 1280,
    height: 720,
    sources: [
      { media: '(max-width: 767px)', avif: '/media/cdc_lab-640.avif', webp: '/media/cdc_lab-640.webp' },
      { avif: '/media/cdc_lab-1280.avif', webp: '/media/cdc_lab-1280.webp' },
    ],
  },
  solar: {
    creditId: 'mead_solar',
    width: 1280,
    height: 854,
    sources: [
      { media: '(max-width: 767px)', avif: '/media/mead_solar-640.avif', webp: '/media/mead_solar-640.webp' },
      { avif: '/media/mead_solar-1280.avif', webp: '/media/mead_solar-1280.webp' },
    ],
  },
}

const PROBLEM_KIND: Record<string, Kind> = {
  'infectious-disease': 'cdc',
  biosecurity: 'cdc',
  'energy-abundance': 'solar',
  'ai-datacenter-power': 'solar',
  'extreme-poverty': 'blackmarble',
}

export function problemBandKind(slug: string): Kind | null {
  return PROBLEM_KIND[slug] ?? null
}

/** Header photograph with the credit line from CREDITS.md. */
export default function PageBand({ kind }: { kind: Kind }) {
  const media = MEDIA[kind]
  const credit = mediaCredit(media.creditId)
  return (
    <div className="site-shell pt-20">
      <div className="relative w-full max-w-full min-w-0 h-[200px] md:h-[320px] max-h-[360px] overflow-hidden rounded-xl bg-neutral-900">
        <HeroMedia alt={credit.text} sources={media.sources} width={media.width} height={media.height} />
      </div>
      <Credit credit={credit} className="mt-2" />
    </div>
  )
}
