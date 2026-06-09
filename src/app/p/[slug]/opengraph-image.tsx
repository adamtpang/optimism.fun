import { ImageResponse } from 'next/og'
import { problems, getProblemBySlug } from '@/data/problems'
import { TIER_LABEL } from '@/data/types'

export const alt = 'A ranked humanity-scale problem on optimism.fun'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }))
}

const TREND = {
  improving: { arrow: '↗', label: 'improving', color: '#15803d' },
  worsening: { arrow: '↘', label: 'worsening', color: '#be123c' },
  flat: { arrow: '→', label: 'flat', color: '#475569' },
} as const

function compact(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  if (n <= 1 && n > 0) return `${(n * 100).toFixed(0)}%`
  return n.toLocaleString()
}

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProblemBySlug(slug)
  const accent = '#0ea5e9'
  const ink = '#0f172a'
  const muted = '#64748b'

  if (!p) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: ink, fontSize: 64 }}>
          optimism.fun
        </div>
      ),
      size,
    )
  }

  const scale = p.scale
  const trend = scale?.trend ? TREND[scale.trend] : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          backgroundImage:
            'radial-gradient(1200px 600px at 60% -20%, rgba(14,165,233,0.10), transparent 70%)',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* top: brand + tier */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: ink, fontSize: 26, fontWeight: 600 }}>
            <span style={{ color: accent }}>◆</span> optimism.fun
          </div>
          <div style={{ display: 'flex', fontSize: 20, letterSpacing: 2, textTransform: 'uppercase', color: accent, border: `1px solid ${accent}`, borderRadius: 4, padding: '6px 14px' }}>
            {TIER_LABEL[p.tier]}
          </div>
        </div>

        {/* middle: name + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, color: ink, lineHeight: 1.02, letterSpacing: -1 }}>
            {p.name}
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: muted, lineHeight: 1.3, maxWidth: 980 }}>
            {p.tagline}
          </div>
        </div>

        {/* bottom: the scale stat + trend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {scale ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <span style={{ fontSize: 64, fontWeight: 700, color: accent }}>{compact(scale.value)}</span>
                {trend ? (
                  <span style={{ fontSize: 30, color: trend.color }}>{trend.arrow} {trend.label}</span>
                ) : null}
              </div>
              <span style={{ fontSize: 22, color: muted }}>{scale.unit}</span>
            </div>
          ) : (
            <div style={{ fontSize: 24, color: muted }}>A ranked problem worth your life.</div>
          )}
          <div style={{ display: 'flex', fontSize: 22, color: muted }}>humanity&apos;s requests for startups</div>
        </div>
      </div>
    ),
    size,
  )
}
