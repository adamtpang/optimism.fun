import { describe, expect, it } from 'vitest'
import { problems } from '@/data/problems'
import { existentialRisks } from '@/data/existential-risks'
import {
  discoveries,
  discoveryIssues,
  listDiscoveries,
} from '@/data/discoveries'

describe('discoveries', () => {
  it('passes the schema checks', () => {
    expect(discoveryIssues()).toEqual([])
  })

  it('is newest first, with undated rows last', () => {
    const listed = listDiscoveries()
    expect(listed.map((d) => d.id)).toEqual(
      [...discoveries].sort((a, b) => {
        if (!a.published && !b.published) return a.id.localeCompare(b.id)
        if (!a.published) return 1
        if (!b.published) return -1
        return b.published.localeCompare(a.published) || b.added.localeCompare(a.added) || a.id.localeCompare(b.id)
      }).map((d) => d.id),
    )
    expect(listed[0].published >= listed[1].published).toBe(true)
  })

  it('flags the two published challenges and labels the preprint', () => {
    const challenged = discoveries.filter((d) => d.status === 'challenged').map((d) => d.id).sort()
    expect(challenged).toEqual([
      'hsieh-housing-constraints-2019',
      'park-disruptive-science-2023',
    ])
    const preprint = discoveries.filter((d) => d.review === 'preprint')
    expect(preprint.map((d) => d.id)).toEqual(['greenblatt-alignment-faking-2024'])
    expect(preprint[0].url).toBe('https://arxiv.org/abs/2412.14093')
  })

  it('tags only real problems and real S-tier risks', () => {
    const problemSlugs = new Set(problems.map((p) => p.slug))
    const riskSlugs = new Set(existentialRisks.map((r) => r.slug))
    for (const d of discoveries) {
      for (const slug of d.problemSlugs) expect(problemSlugs.has(slug)).toBe(true)
      for (const slug of d.riskSlugs ?? []) expect(riskSlugs.has(slug)).toBe(true)
    }
  })

  it('covers every problem the seed set can support, and does not invent the rest', () => {
    const covered = new Set(discoveries.flatMap((d) => d.problemSlugs))
    for (const slug of [
      'biosecurity',
      'energy-abundance',
      'housing-construction',
      'pedagogy',
      'infectious-disease',
      'scientific-productivity',
      'longevity',
      'loneliness',
      'extreme-poverty',
      'climate-change',
      'newborn-survival',
      'hypertension',
      'cancer',
      'copd',
      'diabetes',
    ]) {
      expect(covered.has(slug), slug).toBe(true)
    }
    for (const slug of [
      'fertility-decline',
      'neglected-tropical-diseases',
      'ai-datacenter-power',
      'financial-infrastructure',
    ]) {
      expect(covered.has(slug), slug).toBe(false)
    }
  })

  it('filters by problem without dropping other tags on the same row', () => {
    const rows = listDiscoveries({ problemSlug: 'diabetes' })
    expect(rows.map((d) => d.id).sort()).toEqual([
      'lincoff-select-2023',
      'zhou-diabetes-treatment-2024',
    ])
  })
})
