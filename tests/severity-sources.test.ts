import { describe, it, expect } from 'vitest'
import { problems } from '@/data/problems'
import { citationsForProblem, deathRatePair } from '@/lib/citations'
import { severityFromDeathRate, severityScore, priorityScore } from '@/lib/priority'
import { displayDeathCitation, displayDeaths } from '@/lib/burden'
import { computeRadarRows } from '@/lib/radar'

describe('sourced severity', () => {
  it('scores a death rate only from one opened pair, and leaves the rest empty', () => {
    for (const p of problems) {
      const scored = deathRatePair(p)
      if (scored) {
        expect(p.severity, p.slug).toBeDefined()
        expect(p.severity!.value, p.slug).toBeCloseTo(
          severityFromDeathRate(scored.deaths.value, scored.affected.value),
          3,
        )
        expect(scored.deaths.value, p.slug).toBeGreaterThan(0)
        expect(scored.affected.value, p.slug).toBeGreaterThan(0)
        expect(scored.deaths.sourceUrl, p.slug).toMatch(/^https:\/\//)
        expect(scored.affected.sourceUrl, p.slug).toMatch(/^https:\/\//)
      } else if (p.tier === 'x-risk') {
        expect(p.severity?.value, p.slug).toBe(1)
        expect(p.severityNote, p.slug).toBeTruthy()
      } else {
        expect(p.severity, p.slug).toBeUndefined()
        expect(severityScore(p), p.slug).toBe(0.5)
        expect(p.severityNote, p.slug).toBeTruthy()
      }
    }
  })

  it('does not add malaria, tuberculosis, and HIV into one rate', () => {
    const p = problems.find((x) => x.slug === 'infectious-disease')!
    expect(p.severity).toBeUndefined()
    expect(p.mortalityPairs).toHaveLength(3)
    expect(p.mortalityPairs!.every((pair) => pair.notScoredBecause)).toBe(true)
    const malaria = p.mortalityPairs![0]!
    expect(malaria.deaths).toMatchObject({ value: 610_000, year: 2024 })
    expect(malaria.affected).toMatchObject({ value: 282_000_000, year: 2024 })
    const tb = p.mortalityPairs![1]!
    expect(tb.deaths.value).toBe(1_230_000)
    expect(tb.deaths.label).toMatch(/150,000/)
    const hiv = p.mortalityPairs![2]!
    expect(hiv.deaths).toMatchObject({ value: 570_000, year: 2025 })
    expect(hiv.affected).toMatchObject({ value: 41_000_000, year: 2025 })
  })

  it('records the NTD counts and does not score them', () => {
    const p = problems.find((x) => x.slug === 'neglected-tropical-diseases')!
    expect(p.severity).toBeUndefined()
    const pair = p.mortalityPairs![0]!
    expect(pair.notScoredBecause).toBeTruthy()
    expect(pair.yearMismatch).toBeTruthy()
    expect(pair.deaths).toMatchObject({ value: 119_000, year: 2021 })
    expect(pair.affected).toMatchObject({ value: 1_495_000_000, year: 2023 })
    expect(severityFromDeathRate(pair.deaths.value, pair.affected.value)).toBe(0)
  })

  it('flags mismatched years on the scored pairs that have them', () => {
    expect(deathRatePair(problems.find((p) => p.slug === 'diabetes')!)!.yearMismatch).toMatch(/2021/)
    expect(deathRatePair(problems.find((p) => p.slug === 'copd')!)!.yearMismatch).toMatch(/2023/)
    expect(deathRatePair(problems.find((p) => p.slug === 'hypertension')!)!.yearMismatch).toBeTruthy()
    expect(deathRatePair(problems.find((p) => p.slug === 'cancer')!)!.yearMismatch).toBeUndefined()
    expect(deathRatePair(problems.find((p) => p.slug === 'copd')!)!.affected.doi).toBe(
      '10.1186/s12931-024-03051-2',
    )
  })

  it('links every displayed death figure to the source of that figure', () => {
    for (const p of problems) {
      const n = displayDeaths(p.slug)
      const c = displayDeathCitation(p.slug)
      if (n == null) {
        expect(c, p.slug).toBeNull()
      } else {
        expect(c?.value, p.slug).toBe(n)
        expect(c?.sourceUrl, p.slug).toMatch(/^https:\/\//)
      }
    }
  })

  it('cites optimism.fun and at least one underlying source on every problem', () => {
    for (const p of problems) {
      const cites = citationsForProblem(p)
      expect(cites[0]?.text, p.slug).toMatch(/^optimism\.fun\. \(\d{4}\)\./)
      expect(cites[0]?.href, p.slug).toBe(`https://optimism.fun/p/${p.slug}`)
      expect(cites.length, p.slug).toBeGreaterThan(1)
      const hrefs = cites.map((c) => c.href).filter(Boolean)
      expect(new Set(hrefs).size, p.slug).toBe(hrefs.length)
    }
  })

  it('prints the severity account and the opportunity order', () => {
    const lines = problems.map((p) => {
      const scored = deathRatePair(p)
      const deaths = scored ? scored.deaths.value : '—'
      const affected = scored ? scored.affected.value : '—'
      return [
        p.slug,
        p.severity?.value ?? 'null',
        deaths,
        affected,
        scored ? 'scored' : p.tier === 'x-risk' ? 'x-risk stake' : 'not scored',
      ].join('\t')
    })
    const rows = computeRadarRows()
    const order = rows.map(
      (r, i) =>
        `${i + 1}. ${r.slug} opportunity ${r.opportunity} priority ${priorityScore(problems.find((p) => p.slug === r.slug)!)}`,
    )
    console.log('\nSEVERITY ACCOUNT:\n' + lines.join('\n'))
    console.log('\nOPPORTUNITY ORDER:\n' + order.join('\n'))
    expect(rows).toHaveLength(problems.length)
  })
})
