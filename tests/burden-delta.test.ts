/**
 * The burden layer changes the demand model, and a ranking change made
 * silently is the one thing this repo's discipline forbids. This test makes
 * the change auditable: it recomputes every problem's demand score with the
 * mortality blend switched off, compares, and prints both orders.
 *
 * Two guarantees are asserted. A problem with no mortality dimension must
 * score exactly as before. A problem with one may move, but its burden
 * component must land between the editorial estimate and the mortality
 * signal, which is what "blended half and half" means.
 */
import { describe, it, expect } from 'vitest'
import { problems } from '@/data/problems'
import { buildComponents, composeDemand, demandScore } from '@/lib/demand'
import { quantityScore, severityScore } from '@/lib/priority'
import { mortalitySignal } from '@/lib/burden'

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

function withoutMortality(slug: string) {
  const p = problems.find((x) => x.slug === slug)!
  const comps = buildComponents(p).map((c) =>
    c.class === 'burden'
      ? { ...c, strength: clamp01(0.6 * quantityScore(p) + 0.4 * severityScore(p)) }
      : c,
  )
  return composeDemand(comps).score
}

describe('what the burden layer changed in the demand ranking', () => {
  const rows = problems.map((p) => {
    const after = demandScore(p)
    const before = withoutMortality(p.slug)
    return {
      slug: p.slug,
      before,
      after: after.score,
      delta: after.score - before,
      mortality: mortalitySignal(p.slug),
      burden: after.components.find((c) => c.class === 'burden')!.strength as number,
      editorial: clamp01(0.6 * quantityScore(p) + 0.4 * severityScore(p)),
    }
  })

  it('leaves every problem with no mortality dimension exactly where it was', () => {
    for (const r of rows.filter((r) => r.mortality == null)) {
      expect(r.delta, r.slug).toBe(0)
    }
  })

  it('keeps every blended burden between the editorial estimate and the mortality signal', () => {
    for (const r of rows.filter((r) => r.mortality != null)) {
      const lo = Math.min(r.editorial, r.mortality!)
      const hi = Math.max(r.editorial, r.mortality!)
      expect(r.burden, r.slug).toBeGreaterThanOrEqual(lo - 1e-9)
      expect(r.burden, r.slug).toBeLessThanOrEqual(hi + 1e-9)
    }
  })

  it('prints the before and after order so the change is on the record', () => {
    const order = (key: 'before' | 'after') =>
      [...rows].sort((a, b) => b[key] - a[key]).map((r, i) => `${i + 1}. ${r.slug} ${r[key]}`)
    const moved = rows.filter((r) => r.delta !== 0).map((r) => `${r.slug} ${r.before} -> ${r.after}`)
    console.log('\nDEMAND RANKING, before the burden layer:\n' + order('before').join('\n'))
    console.log('\nDEMAND RANKING, after the burden layer:\n' + order('after').join('\n'))
    console.log('\nMOVED:\n' + (moved.length ? moved.join('\n') : 'nothing'))
    expect(rows.length).toBe(problems.length)
  })
})
