import { describe, expect, it } from 'vitest'
import { matchWhere } from '@/lib/where-match'
import { whereCatalog } from '@/lib/where'
import { computeRadarRows } from '@/lib/radar'

describe('where matcher', () => {
  const catalog = whereCatalog()

  it('returns the current top 3 when the visitor picks nothing', () => {
    const matches = matchWhere({ ...catalog, skills: [], interests: [], offers: [] })
    expect(matches.map((m) => m.entry.id)).toEqual(computeRadarRows().slice(0, 3).map((row) => row.slug))
    expect(matches.every((m) => m.entry.kind === 'problem')).toBe(true)
    expect(matches[0].reasons).toEqual(['Highest on the current ranking'])
  })

  it('keeps a health interest inside health problems', () => {
    const matches = matchWhere({ ...catalog, skills: [], interests: ['health'], offers: [] })
    expect(matches.length).toBeGreaterThan(0)
    expect(matches.every((m) => m.entry.kind === 'problem' && m.entry.domain === 'health')).toBe(true)
  })

  it('surfaces AI control for an AI interest', () => {
    const matches = matchWhere({ ...catalog, skills: [], interests: ['ai'], offers: [] })
    expect(matches.map((m) => m.entry.id)).toEqual(['ai-control'])
    expect(matches[0].ctas.length).toBeGreaterThan(0)
    expect(matches[0].ctas.every((c) => (c.riskSlugs ?? []).includes('ai-control'))).toBe(true)
  })

  it('prefers problems with a fund action when the offer is money', () => {
    const matches = matchWhere({ ...catalog, skills: [], interests: [], offers: ['money'] })
    expect(matches).toHaveLength(3)
    for (const match of matches) {
      expect(match.ctas.length).toBeGreaterThan(0)
      expect(match.ctas.every((c) => c.kind === 'fund')).toBe(true)
    }
  })

  it('ignores an unknown skill', () => {
    const matches = matchWhere({
      ...catalog,
      skills: ['not-a-skill' as 'engineering'],
      interests: [],
      offers: [],
    })
    expect(matches.map((m) => m.entry.id)).toEqual(computeRadarRows().slice(0, 3).map((row) => row.slug))
  })
})
