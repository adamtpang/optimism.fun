/**
 * The ranking inputs are easy to corrupt with a unit mistake: a death count
 * stored where a 0..1 fraction belongs, then silently divided by 10 and
 * clamped. These tests fail if that comes back.
 */
import { describe, it, expect } from 'vitest'
import { problems } from '@/data/problems'
import { computeRadarRows } from '@/lib/radar'
import {
  severityScore,
  solutionQualityScore,
  severityFromDeathRate,
  supplyScore,
  supplyHeadcount,
  existentialWeight,
  priorityScore,
} from '@/lib/priority'
import type { Problem } from '@/data/types'

const fake = (over: Partial<Problem>): Problem =>
  ({ slug: 'fixture', tier: 'welfare', ...over }) as Problem

describe('severity and solution quality stay on 0..1', () => {
  it('rejects any stored severity outside 0..1', () => {
    for (const p of problems) {
      if (p.severity == null) continue
      expect(p.severity.value, p.slug).toBeGreaterThanOrEqual(0)
      expect(p.severity.value, p.slug).toBeLessThanOrEqual(1)
      expect(severityScore(p), p.slug).toBeGreaterThanOrEqual(0)
      expect(severityScore(p), p.slug).toBeLessThanOrEqual(1)
    }
  })

  it('rejects any stored solution quality outside 0..1', () => {
    for (const p of problems) {
      if (p.currentSolutionQuality == null) continue
      expect(p.currentSolutionQuality.value, p.slug).toBeGreaterThanOrEqual(0)
      expect(p.currentSolutionQuality.value, p.slug).toBeLessThanOrEqual(1)
      const q = solutionQualityScore(p)
      expect(q, p.slug).not.toBeNull()
      expect(q!, p.slug).toBeGreaterThanOrEqual(0)
      expect(q!, p.slug).toBeLessThanOrEqual(1)
    }
  })

  it('does not silently rescale a death count or a 0–10 quality', () => {
    expect(() => severityScore(fake({ severity: { value: 3_400_000 } as Problem['severity'] }))).toThrow(
      /outside 0\.\.1/,
    )
    expect(() =>
      solutionQualityScore(fake({ currentSolutionQuality: { value: 7 } as Problem['currentSolutionQuality'] })),
    ).toThrow(/outside 0\.\.1/)
  })

  it('log-normalizes a death rate the same way for every sourced disease', () => {
    // 1 in 10,000 → 0. Certain death this year → 1. Tenfold → +0.25.
    expect(severityFromDeathRate(1, 10_000)).toBeCloseTo(0, 6)
    expect(severityFromDeathRate(1, 1)).toBeCloseTo(1, 6)
    expect(severityFromDeathRate(1, 1_000) - severityFromDeathRate(1, 10_000)).toBeCloseTo(0.25, 6)

    const diabetes = problems.find((p) => p.slug === 'diabetes')!
    const hypertension = problems.find((p) => p.slug === 'hypertension')!
    const copd = problems.find((p) => p.slug === 'copd')!
    const cancer = problems.find((p) => p.slug === 'cancer')!
    expect(diabetes.severity).toBeUndefined()
    expect(hypertension.severity).toBeUndefined()
    expect(copd.severity).toBeUndefined()
    expect(diabetes.mortalityPairs?.[0]?.notScoredBecause).toMatch(/not the same denominator/)
    expect(hypertension.mortalityPairs?.[0]?.notScoredBecause).toMatch(/invent/)
    expect(copd.mortalityPairs?.[0]?.notScoredBecause).toMatch(/not a person-year/)
    expect(cancer.severity).toBeUndefined()
    expect(cancer.mortalityPairs?.[0]?.denominatorKind).toBe('incident-cases')
    expect(cancer.mortalityPairs?.[0]?.notScoredBecause).toMatch(/not an annual individual mortality risk/)
  })

  it('leaves severity empty where the death rate was not sourced, and scores that as one half', () => {
    for (const slug of ['energy-abundance', 'financial-infrastructure', 'extreme-poverty', 'longevity']) {
      const p = problems.find((x) => x.slug === slug)!
      expect(p.severity, slug).toBeUndefined()
      expect(severityScore(p), slug).toBe(0.5)
    }
  })
})

describe('neglectedness, tractability, and unknown supply', () => {
  it('treats zero tags as the neglectedness judgment, not as an empty field', () => {
    const cancer = problems.find((p) => p.slug === 'cancer')!
    expect(cancer.neglectedness!.score).toBe(2)
    // 2/10 neglected → headcount supply 0.8, not 0.
    expect(supplyHeadcount(cancer, { companies: 0, capital: 0 })).toBeCloseTo(0.8, 6)
    const asIfEmpty = 0.5 * 0.5 + 0.5 * 0 // quality 0.5, headcount 0
    expect(supplyScore(cancer, { companies: 0, capital: 0 })).toBeGreaterThan(asIfEmpty)
  })

  it('does not treat tagged companies as coverage of an x-risk', () => {
    const bio = problems.find((p) => p.slug === 'biosecurity')!
    expect(bio.tier).toBe('x-risk')
    expect(bio.severity!.value).toBe(1)
    expect(existentialWeight(bio)).toBe(1)
    expect(supplyHeadcount(bio, { companies: 4, capital: 3 })).toBeCloseTo(
      supplyHeadcount(bio, { companies: 0, capital: 0 }),
      6,
    )
  })

  it('prints the opportunity order so the ranking change is on the record', () => {
    const rows = computeRadarRows()
    const lines = rows.map(
      (r, i) =>
        `${i + 1}. ${r.slug} opportunity ${r.opportunity} priority ${priorityScore(problems.find((p) => p.slug === r.slug)!)}`,
    )
    console.log('\nOPPORTUNITY ORDER:\n' + lines.join('\n'))
    expect(new Set(rows.map((r) => r.slug)).size).toBe(problems.length)
    expect(rows[0]!.opportunity).toBeGreaterThanOrEqual(rows[rows.length - 1]!.opportunity)
  })
})
