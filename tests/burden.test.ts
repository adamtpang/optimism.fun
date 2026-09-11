/**
 * The burden layer's guarantees.
 *
 * The data is editorial mapping over sourced counts, so what can be tested is
 * the arithmetic and the integrity rules: every mapped slug is a real problem,
 * aggregates never count, null counts never count, overlap is allowed and
 * visible, and the signal lands on the model's 0..1 scale.
 */
import { describe, it, expect } from 'vitest'
import {
  burdenForProblem,
  deathsByProblem,
  unmappedCauses,
  totalCountedDeaths,
  mortalitySignal,
  mappingIntegrity,
  MORTALITY_CEILING,
} from '@/lib/burden'
import { mortalityCauses } from '@/data/mortality'
import { problems } from '@/data/problems'

const slugs = problems.map((p) => p.slug)

describe('mapping integrity', () => {
  it('maps only to problems that exist on the index', () => {
    expect(mappingIntegrity(slugs)).toEqual([])
  })

  it('every aggregate lists members that exist and are not themselves aggregates', () => {
    for (const c of mortalityCauses.filter((c) => c.aggregate)) {
      expect(c.members?.length).toBeGreaterThan(0)
      for (const m of c.members ?? []) {
        const member = mortalityCauses.find((x) => x.slug === m)
        expect(member, `${c.slug} member ${m}`).toBeDefined()
        expect(member?.aggregate).toBeFalsy()
      }
    }
  })

  it('has unique cause slugs', () => {
    const s = mortalityCauses.map((c) => c.slug)
    expect(new Set(s).size).toBe(s.length)
  })

  it('never carries a share of deaths above 1 or a negative count', () => {
    for (const c of mortalityCauses) {
      if (c.deaths.shareOfDeaths != null) expect(c.deaths.shareOfDeaths).toBeLessThanOrEqual(1)
      if (c.deaths.value != null) expect(c.deaths.value).toBeGreaterThan(0)
    }
  })
})

describe('sums', () => {
  it('excludes aggregates from every sum', () => {
    const singles = mortalityCauses.filter((c) => !c.aggregate)
    const expected = singles.reduce((s, c) => s + (c.deaths.value ?? 0), 0)
    expect(totalCountedDeaths()).toBe(expected)
    // The all-cancers and all-cardiovascular roll-ups would add ~29M if counted.
    expect(totalCountedDeaths()).toBeLessThan(40_000_000)
  })

  it('hypertension carries ischaemic heart disease and stroke, and nothing aggregate', () => {
    const b = burdenForProblem('hypertension')
    expect(b).not.toBeNull()
    const names = b!.counted.map((c) => c.slug)
    expect(names).toContain('ischaemic-heart-disease')
    expect(names).toContain('stroke')
    expect(b!.deaths).toBe(9_100_000 + 6_800_000)
    expect(b!.aggregates.map((a) => a.slug)).toContain('cardiovascular-all')
    expect(b!.counted.some((c) => c.aggregate)).toBe(false)
  })

  it('counts a shared cause under both problems, by design', () => {
    const h = burdenForProblem('hypertension')!
    const l = burdenForProblem('longevity')!
    expect(h.counted.map((c) => c.slug)).toContain('stroke')
    expect(l.counted.map((c) => c.slug)).toContain('stroke')
  })

  it('carries ranked-but-uncounted causes as unmeasured, not as zero', () => {
    const inf = burdenForProblem('infectious-disease')!
    expect(inf.unmeasured.map((c) => c.slug)).toContain('tuberculosis')
    expect(inf.counted.map((c) => c.slug)).not.toContain('tuberculosis')
    const nb = burdenForProblem('newborn-survival')!
    expect(nb.deaths).toBe(0)
    expect(nb.unmeasured.map((c) => c.slug)).toContain('neonatal-disorders')
  })

  it('returns null for a problem with no mortality dimension', () => {
    expect(burdenForProblem('pedagogy')).toBeNull()
    expect(burdenForProblem('not-a-problem')).toBeNull()
  })

  it('deathsByProblem covers exactly the mapped problems', () => {
    const m = deathsByProblem()
    const mapped = new Set(mortalityCauses.flatMap((c) => c.problemSlugs))
    expect(new Set(m.keys())).toEqual(mapped)
  })
})

describe('the coverage finding', () => {
  it('no longer lists cancer as unmapped, since the index gained a cancer problem on 2026-09-11', () => {
    const gaps = unmappedCauses().map((c) => c.slug)
    expect(gaps).not.toContain('cancers-all-sites')
    expect(gaps).not.toContain('lung-cancers')
  })

  it('maps every WHO top-ten cause to a problem, as of 2026-09-11', () => {
    // Cancer, COPD and diabetes were added the day the burden layer counted them.
    expect(unmappedCauses()).toEqual([])
  })

  it('carries COPD under its own problem at the fact sheet count', () => {
    const b = burdenForProblem('copd')
    expect(b).not.toBeNull()
    expect(b!.counted.map((c) => c.slug)).toEqual(['copd'])
    expect(b!.deaths).toBe(3_500_000)
  })

  it('counts diabetes at the WHO direct-cause figure and carries kidney disease as unmeasured', () => {
    const b = burdenForProblem('diabetes')
    expect(b).not.toBeNull()
    expect(b!.counted.map((c) => c.slug)).toEqual(['diabetes'])
    expect(b!.deaths).toBe(1_600_000)
    expect(b!.unmeasured.map((c) => c.slug)).toEqual(['kidney-diseases'])
    expect(mortalitySignal('diabetes')).not.toBeNull()
  })

  it('maps kidney disease to both of its upstream causes without changing their counted totals', () => {
    const kidney = mortalityCauses.find((c) => c.slug === 'kidney-diseases')!
    expect(kidney.problemSlugs).toEqual(['hypertension', 'diabetes'])
    expect(kidney.deaths.value).toBeNull()
    expect(burdenForProblem('hypertension')!.deaths).toBe(9_100_000 + 6_800_000)
  })

  it('carries lung cancer under the cancer problem and the all-cancers roll-up as an aggregate', () => {
    const b = burdenForProblem('cancer')
    expect(b).not.toBeNull()
    expect(b!.counted.map((c) => c.slug)).toEqual(['lung-cancers'])
    expect(b!.deaths).toBe(1_900_000)
    expect(b!.aggregates.map((a) => a.slug)).toEqual(['cancers-all-sites'])
    expect(mortalitySignal('cancer')).not.toBeNull()
  })

  it('orders unmapped causes by deaths with uncounted ones last', () => {
    const gaps = unmappedCauses()
    const counted = gaps.filter((c) => c.deaths.value != null).map((c) => c.deaths.value!)
    expect([...counted].sort((a, b) => b - a)).toEqual(counted)
    const firstNull = gaps.findIndex((c) => c.deaths.value == null)
    if (firstNull >= 0) {
      expect(gaps.slice(firstNull).every((c) => c.deaths.value == null)).toBe(true)
    }
  })
})

describe('the demand signal', () => {
  it('lands on the 0..1 log scale the model uses', () => {
    const h = mortalitySignal('hypertension')!
    expect(h).toBeGreaterThan(0.9)
    expect(h).toBeLessThanOrEqual(1)
    const expected = Math.log10(15_900_000) / Math.log10(MORTALITY_CEILING)
    expect(h).toBeCloseTo(Math.min(1, expected), 6)
  })

  it('is null, not zero, when mapped causes have no counts', () => {
    expect(mortalitySignal('newborn-survival')).toBeNull()
    expect(mortalitySignal('pedagogy')).toBeNull()
  })

  it('ranks the problems by mortality in the order the data implies', () => {
    const order = ['hypertension', 'longevity', 'biosecurity', 'infectious-disease']
      .map((s) => [s, mortalitySignal(s)!] as const)
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s)
    expect(order[0]).toBe('longevity')
    expect(order[1]).toBe('hypertension')
    expect(order[2]).toBe('biosecurity')
    expect(order[3]).toBe('infectious-disease')
  })
})
