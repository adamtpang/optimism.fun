import { describe, expect, it } from 'vitest'
import { problems } from '@/data/problems'
import { computeRadarRows } from '@/lib/radar'
import {
  DATA_LICENSE,
  problemRows,
  seriesRows,
  toCsv,
  problemDataset,
} from '@/lib/open-data'

describe('open data', () => {
  it('exports csv with quotes and commas escaped', () => {
    const csv = toCsv([
      { name: 'A, B', note: 'say "hi"', n: 1 },
      { name: 'plain', note: 'line\nbreak', n: 2 },
    ])
    expect(csv).toBe('name,note,n\n"A, B","say ""hi""",1\nplain,"line\nbreak",2\n')
  })

  it('keeps homepage rank order and does not invent series points', () => {
    const rows = problemRows()
    const ranked = computeRadarRows()
    expect(rows.map((row) => row.slug)).toEqual(problems.map((p) => p.slug))
    const byRank = [...rows].sort((a, b) => Number(a.rank) - Number(b.rank))
    expect(byRank.map((row) => row.slug)).toEqual(ranked.map((row) => row.slug))
    expect(rows.every((row) => row.license === DATA_LICENSE.id)).toBe(true)

    const exported = seriesRows()
    const stored = problems.flatMap((p) =>
      (p.scale?.series ?? []).map((point) => ({
        slug: p.slug,
        year: point.year,
        value: point.value,
        source: p.scale?.source,
      })),
    )
    expect(exported.map((row) => [row.problem_slug, row.year, row.value, row.source])).toEqual(
      stored.map((row) => [row.slug, row.year, row.value, row.source]),
    )
    const longevity = problemDataset('longevity')
    expect(longevity?.series.map((point) => point.value)).toEqual([32, 47, 67, 73])
    expect(problemDataset('housing-construction')?.series).toEqual([])
    expect(problemDataset('housing-construction')?.seriesNote).toMatch(/No time series/)
  })

  it('puts a source on every headline measure', () => {
    for (const row of problemRows()) {
      if (row.scale_value !== '') {
        expect(String(row.scale_source).length, row.slug).toBeGreaterThan(0)
        const url = String(row.scale_source_url)
        if (url) expect(url.startsWith('https://'), row.slug).toBe(true)
      }
    }
  })
})
