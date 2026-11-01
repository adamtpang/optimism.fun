import HeroMedia, { type MediaSource } from './HeroMedia'

type Kind = 'bluemarble' | 'blackmarble' | 'sunrise' | 'cdc' | 'solar'

const MEDIA: Record<Kind, { alt: string; sources: MediaSource[]; width: number; height: number }> = {
  bluemarble: {
    alt: 'Apollo 17, NASA',
    width: 1280,
    height: 1280,
    sources: [
      { media: '(max-width: 767px)', avif: '/media/bluemarble-828.avif', webp: '/media/bluemarble-828.webp' },
      { avif: '/media/bluemarble-1280.avif', webp: '/media/bluemarble-1280.webp' },
    ],
  },
  blackmarble: {
    alt: 'Black Marble, City Lights 2012, NASA Earth Observatory/NASA GSFC',
    width: 1600,
    height: 800,
    sources: [
      { media: '(max-width: 767px)', avif: '/media/blackmarble-828.avif', webp: '/media/blackmarble-828.webp' },
      { avif: '/media/blackmarble-1600.avif', webp: '/media/blackmarble-1600.webp' },
    ],
  },
  sunrise: {
    alt: 'orbital sunrise, NASA',
    width: 1600,
    height: 900,
    sources: [
      { media: '(max-width: 767px)', avif: '/media/iss_sunrise-828.avif', webp: '/media/iss_sunrise-828.webp' },
      { avif: '/media/iss_sunrise-1600.avif', webp: '/media/iss_sunrise-1600.webp' },
    ],
  },
  cdc: {
    alt: 'CDC scientist transfers H7N9, James Gathany / CDC',
    width: 1280,
    height: 720,
    sources: [
      { media: '(max-width: 767px)', avif: '/media/cdc_lab-640.avif', webp: '/media/cdc_lab-640.webp' },
      { avif: '/media/cdc_lab-1280.avif', webp: '/media/cdc_lab-1280.webp' },
    ],
  },
  solar: {
    alt: 'Mead, Nebraska solar farm aerial 2026, AllTheUsernamesAreInUse',
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

/** Header photograph. Public-domain credit lines stay in public/media/CREDITS.md. */
export default function PageBand({ kind }: { kind: Kind }) {
  const media = MEDIA[kind]
  return (
    <div className="site-shell pt-20">
      <div className="relative h-[200px] md:h-[320px] max-h-[360px] overflow-hidden rounded-xl bg-neutral-900">
        <HeroMedia alt={media.alt} sources={media.sources} width={media.width} height={media.height} />
      </div>
    </div>
  )
}
