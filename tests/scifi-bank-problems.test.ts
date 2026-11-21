import { describe, expect, it } from 'vitest'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { mortalityCauses } from '@/data/mortality'
import { inLimitCaps } from '@/data/in-limit'
import { ctas } from '@/data/ctas'
import { getConstraintTree } from '@/data/constraints'
import { deathRatePair } from '@/lib/citations'
import { burdenForProblem } from '@/lib/burden'

const SLUGS = [
  'organ-banking',
  'organ-shortage',
  'brain-computer-interface',
  'ai-clinical-care',
  'artificial-womb',
] as const

const proseOf = (slug: string) => {
  const problem = problems.find((item) => item.slug === slug)!
  return JSON.stringify({
    name: problem.name,
    tagline: problem.tagline,
    description: problem.description,
    severityNote: problem.severityNote,
    sciFiOrigin: problem.sciFiOrigin,
    transformation: problem.transformation,
    neglectedness: problem.neglectedness?.rationale,
    tractability: problem.tractability?.rationale,
  })
}

describe('sci-fi bank problems', () => {
  it('adds the five slugs once, with a lineage and no prize ceiling', () => {
    for (const slug of SLUGS) {
      const matches = problems.filter((problem) => problem.slug === slug)
      expect(matches, slug).toHaveLength(1)
      const problem = matches[0]!
      expect(problem.sciFiOrigin, slug).toBeTruthy()
      expect(problem.severity, slug).toBeUndefined()
      expect(deathRatePair(problem), slug).toBeUndefined()
      expect(problem.marketSize, slug).toBeUndefined()
      expect(problem.humansAffected.sourceUrl, slug).toMatch(/^https:\/\//)
      expect(proseOf(slug), slug).not.toMatch(/[—–]/)
      expect(getConstraintTree(slug)?.bindingId, slug).toBeTruthy()
    }
    expect(inLimitCaps.some((cap) => (SLUGS as readonly string[]).includes(cap.problemSlug))).toBe(false)
  })

  it('does not assign these rows a cause of death', () => {
    for (const cause of mortalityCauses) {
      for (const slug of SLUGS) {
        expect(cause.problemSlugs, cause.slug).not.toContain(slug)
      }
    }
    for (const slug of SLUGS) expect(burdenForProblem(slug), slug).toBeNull()
  })

  it('shares the US waiting list without storing a valuation', () => {
    const banking = problems.find((problem) => problem.slug === 'organ-banking')!
    const shortage = problems.find((problem) => problem.slug === 'organ-shortage')!
    expect(banking.humansAffected.value).toBe(109_817)
    expect(shortage.humansAffected.value).toBe(109_817)
    expect(banking.relatedProblemSlugs).toEqual(['organ-shortage'])
    expect(shortage.relatedProblemSlugs).toEqual(['organ-banking'])
    const womb = problems.find((problem) => problem.slug === 'artificial-womb')!
    expect(womb.relatedProblemSlugs).toEqual(['newborn-survival'])
    expect(womb.humansAffected.value).toBe(900_000)
    expect(womb.humansAffected.countKind).toBe('annual-deaths')
    expect(womb.severityNote).toMatch(/newborn survival/i)
    for (const company of companies.filter((item) =>
      item.problemSlugs.some((slug) => (SLUGS as readonly string[]).includes(slug)),
    )) {
      expect(company.marketCap, company.slug).toBeNull()
      expect(company.valuation, company.slug).toBeNull()
    }
  })

  it('keeps the new calls to action inside the checked set', () => {
    const rows = ctas.filter((cta) => cta.problemSlugs.some((slug) => (SLUGS as readonly string[]).includes(slug)))
    expect(rows.length).toBeGreaterThanOrEqual(SLUGS.length)
    for (const row of rows) {
      expect(row.checkedDate).toBe('2026-11-20')
      expect(row.oneLiner.length).toBeLessThanOrEqual(240)
      expect(`${row.name} ${row.oneLiner}`).not.toMatch(/[—–]/)
      expect(row.amount).toBeUndefined()
    }
    expect(rows.some((row) => row.kind === 'fund')).toBe(false)
  })
})
