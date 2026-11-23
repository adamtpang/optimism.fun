import { readFile } from 'node:fs/promises'
import { ImageResponse } from 'next/og'
import { problems } from '@/data/problems'
import { computeRadarRows } from '@/lib/radar'
import { formatMeasure, logBarPercent, neglectColor } from '@/lib/charts'

/**
 * The homepage link preview: the top five rows of the live ranking, drawn
 * from the same data as the homepage. Every figure is read at render time.
 * Sized to stay readable at LinkedIn's roughly 400px thumbnail.
 */
export const alt = 'Bar chart of the top problems on optimism.fun, sized by people reached and colored by neglectedness'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PAPER = 'rgb(244, 241, 234)'
const INK = '#121920'
const MUTED = '#4a5560'
const TEAL = '#0B7A71'

const NAME_MAX = 28

/** One line, never wrapped: keep the part before "&" or "and", then cut at a word. */
function cardName(name: string): string {
  const head = name.split(/\s(?:&|and)\s/)[0].trim()
  if (head.length <= NAME_MAX) return head
  const cut = head.slice(0, NAME_MAX)
  return cut.slice(0, cut.lastIndexOf(' ')).trim()
}

export default async function Image() {
  const [interRegular, interSemi, plexMono] = await Promise.all([
    // Literal paths, resolved from this file, so the bundler traces only these
    // three fonts and the route works wherever the server is started.
    readFile(new URL('../../assets/fonts/Inter-Regular.ttf', import.meta.url)),
    readFile(new URL('../../assets/fonts/Inter-SemiBold.ttf', import.meta.url)),
    readFile(new URL('../../assets/fonts/IBMPlexMono-Medium.ttf', import.meta.url)),
  ])

  const bySlug = new Map(problems.map((p) => [p.slug, p]))
  const all = computeRadarRows()
    .map((row) => {
      const problem = bySlug.get(row.slug)
      const people = problem?.humansAffected?.value
      if (!problem || people == null) return null
      return {
        slug: row.slug,
        name: cardName(problem.name),
        people,
        neglectedness: problem.neglectedness?.score ?? null,
      }
    })
    .filter((row): row is NonNullable<typeof row> => row != null)

  const rows = all.slice(0, 5)
  // Bar scale across the whole ranking, so a short bar means few people, not "smallest of five".
  const values = all.map((row) => row.people)
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
          background: PAPER,
          color: INK,
          padding: '56px 64px',
          fontFamily: 'Inter',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="40" height="40" viewBox="0 0 32 32">
            <defs>
              <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0B7A71" />
                <stop offset="100%" stopColor="#1F56C9" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="#ffffff" />
            <path
              d="M 8 16 C 8 12 11 11 13 13 L 15 15 Q 16 16 17 15 L 19 13 C 21 11 24 12 24 16 C 24 20 21 21 19 19 L 17 17 Q 16 16 15 17 L 13 19 C 11 21 8 20 8 16 Z"
              fill="none"
              stroke="url(#mark)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 600 }}>optimism.fun</div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginTop: 22,
          }}
        >
          Humanity&apos;s hardest problems, ranked
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 30, gap: 14 }}>
          {rows.map((row) => (
            <div key={row.slug} style={{ display: 'flex', alignItems: 'center', height: 42 }}>
              <div style={{ display: 'flex', width: 470, fontSize: 30, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {row.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: 120,
                  marginRight: 24,
                  fontFamily: 'Plex Mono',
                  fontSize: 28,
                  fontWeight: 500,
                }}
              >
                {formatMeasure(row.people)}
              </div>
              <div style={{ display: 'flex', flex: 1, height: 22 }}>
                {/* The low end of the neglect scale is near white, so every bar gets an ink edge. */}
                <div
                  style={{
                    display: 'flex',
                    width: `${logBarPercent(row.people, min, max)}%`,
                    height: 22,
                    background: neglectColor(row.neglectedness),
                    border: '2px solid rgba(18, 25, 32, 0.55)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', fontSize: 22, color: MUTED }}>
            Bar = people reached (log scale). Color = neglectedness.
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: MUTED }}>
            <span>CC BY 4.0</span>
            <span style={{ color: TEAL, fontWeight: 600 }}>optimism.fun</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interSemi, weight: 600, style: 'normal' },
        { name: 'Plex Mono', data: plexMono, weight: 500, style: 'normal' },
      ],
    },
  )
}
