import { ImageResponse } from 'next/og'
import { problems } from '@/data/problems'
import { computeRadarRows } from '@/lib/radar'
import { formatMeasure, logBarPercent, neglectColor } from '@/lib/charts'

export const alt = 'Humanity’s hardest problems, sized by people reached and colored by neglectedness'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const bySlug = new Map(problems.map((p) => [p.slug, p]))
  const rows = computeRadarRows()
    .map((row, index) => {
      const problem = bySlug.get(row.slug)
      const people = problem?.humansAffected?.value
      if (!problem || people == null) return null
      return {
        rank: index + 1,
        name: problem.name,
        people,
        neglectedness: problem.neglectedness?.score ?? null,
      }
    })
    .filter((row): row is NonNullable<typeof row> => row != null)
    .slice(0, 8)

  const values = rows.map((row) => row.people)
  const min = Math.min(...values)
  const max = Math.max(...values)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgb(244, 241, 234)',
          color: 'rgb(22, 22, 22)',
          padding: '36px 48px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 650 }}>
            <div style={{ width: 14, height: 14, background: 'rgb(14, 165, 233)', transform: 'rotate(45deg)' }} />
            optimism.fun
          </div>
          <div style={{ fontSize: 16, letterSpacing: 1, color: 'rgb(3, 105, 161)' }}>CC BY 4.0</div>
        </div>
        <div style={{ display: 'flex', fontSize: 42, fontWeight: 560, marginTop: 12, lineHeight: 1.05 }}>
          Humanity&apos;s hardest problems
        </div>
        <div style={{ display: 'flex', fontSize: 18, color: 'rgb(63, 63, 70)', marginTop: 6, marginBottom: 14 }}>
          Bar length is people reached, log scale. Color is neglectedness.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {rows.map((row) => (
            <div key={row.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 28, fontSize: 16, color: 'rgb(113, 113, 122)' }}>{String(row.rank).padStart(2, '0')}</div>
              <div style={{ width: 280, fontSize: 20 }}>{row.name}</div>
              <div style={{ width: 90, fontSize: 18, textAlign: 'right' }}>{formatMeasure(row.people)}</div>
              <div style={{ display: 'flex', flex: 1, height: 14, background: 'rgba(0,0,0,0.06)' }}>
                <div
                  style={{
                    width: `${logBarPercent(row.people, min, max)}%`,
                    height: 14,
                    background: neglectColor(row.neglectedness),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, color: 'rgb(82, 82, 91)' }}>
          <span>Top 8 of the full ranking</span>
          <span>optimism.fun/poster</span>
        </div>
      </div>
    ),
    size,
  )
}
