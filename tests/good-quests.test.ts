import { describe, it, expect } from 'vitest'
import { placeOnQuestGrid, problemHardness, quadrant } from '@/lib/quest-grid'
import { computeQuestRankings } from '@/lib/rankings'
import { constraintTrees } from '@/data/constraints'
import { problems } from '@/data/problems'

describe('your current quest', () => {
  it('names the four boxes', () => {
    expect(quadrant(80, 80).name).toBe('hard and good')
    expect(quadrant(80, 20).name).toBe('easy and good')
    expect(quadrant(20, 80).name).toBe('hard and not good')
    expect(quadrant(20, 20).name).toBe('easy and not good')
  })
})
describe('quest grid hardness', () => {
  it('comes from the problem fields, not from the slug', () => {
    expect(problemHardness({})).toBeNull()
    const easy = problemHardness({ tractability: { score: 10 } } as never)!
    const hard = problemHardness({ tractability: { score: 1 } } as never)!
    expect(easy.value).toBe(0)
    expect(hard.value).toBe(100)
    expect(hard.why).toContain('tractability 1/10')
  })

  it('plots every quest inside the grid with its inputs in words', () => {
    const plotted = placeOnQuestGrid(computeQuestRankings())
    expect(plotted.length).toBeGreaterThan(0)
    for (const q of plotted) {
      expect(q.hard, q.slug).toBeGreaterThanOrEqual(3)
      expect(q.hard, q.slug).toBeLessThanOrEqual(97)
      expect(q.hardWhy, q.slug).toMatch(/tractability/)
      expect(q.good, q.slug).toBeGreaterThanOrEqual(50)
      expect(q.good, q.slug).toBe(50 + Math.round(q.opportunity / 2))
    }
  })
})

describe('constraint trees', () => {
  it('has one tree per problem, each with a binding node that exists', () => {
    const slugs = constraintTrees.map((t) => t.problemSlug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const p of problems) expect(slugs, p.slug).toContain(p.slug)
    for (const t of constraintTrees) {
      expect(t.root.map((n) => n.id), t.problemSlug).toContain(t.bindingId)
      for (const n of t.root) {
        expect(n.sources.length, `${t.problemSlug}/${n.id}`).toBeGreaterThan(0)
        for (const s of n.sources) expect(s.url, `${t.problemSlug}/${n.id}`).toMatch(/^https?:\/\//)
      }
    }
  })

  it('uses no em dashes', () => {
    expect(JSON.stringify(constraintTrees)).not.toContain('\u2014')
  })
})
