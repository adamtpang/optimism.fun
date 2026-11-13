import { ImageResponse } from 'next/og'
import { figures, getFigure } from '@/data/figures'

/**
 * The figure as a shareable image: the hero number, the finding, the bars,
 * and the source and credit inside the picture, so it still cites itself
 * after it has been screenshotted and passed around.
 */
export const alt = 'A sourced figure from optimism.fun'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return figures.map((f) => ({ slug: f.slug }))
}

const INK = 'rgb(18, 25, 32)'
const MUTED = 'rgb(76, 88, 100)'
const RULE = 'rgb(201, 209, 216)'
const PAPER = 'rgb(247, 249, 250)'
const GRID = 'rgb(225, 230, 234)'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const figure = getFigure(slug)

  if (!figure) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', color: INK, fontSize: 64 }}>
          optimism.fun
        </div>
      ),
      size,
    )
  }

  const max = Math.max(...figure.bars.map((b) => b.value))
  const sources = figure.sources.map((s) => s.label).join('; ')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'white',
          padding: '48px 56px',
          fontFamily: 'sans-serif',
          color: INK,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 22, color: MUTED }}>
            Fig. {figure.number} · {figure.topic}
          </div>
          <div style={{ display: 'flex', fontSize: 50, fontWeight: 700, lineHeight: 1.1, marginTop: 10, maxWidth: 1040 }}>
            {figure.finding}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 330 }}>
            <div style={{ display: 'flex', fontSize: 104, fontWeight: 700, lineHeight: 1 }}>{figure.hero.value}</div>
            <div style={{ display: 'flex', fontSize: 24, color: MUTED, marginTop: 10, lineHeight: 1.25 }}>{figure.hero.label}</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
              flex: 1,
              padding: '24px 28px',
              background: PAPER,
              border: `1px solid ${RULE}`,
              backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          >
            {figure.bars.map((b) => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', width: 170, fontSize: 24 }}>{b.label}</div>
                <div style={{ display: 'flex', flex: 1 }}>
                  <div style={{ display: 'flex', height: 32, width: `${(b.value / max) * 100}%`, background: b.value === max ? INK : MUTED }} />
                </div>
                <div style={{ display: 'flex', width: 130, fontSize: 24, justifyContent: 'flex-end' }}>{b.display}</div>
              </div>
            ))}
            <div style={{ display: 'flex', fontSize: 19, color: MUTED }}>{figure.chartCaption}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${RULE}`, paddingTop: 16, gap: 32 }}>
          <div style={{ display: 'flex', fontSize: 19, color: MUTED, maxWidth: 800, lineHeight: 1.3 }}>Source: {sources}</div>
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 700 }}>optimism.fun/figures</div>
        </div>
      </div>
    ),
    size,
  )
}
