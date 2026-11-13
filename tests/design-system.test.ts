import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { figures } from '@/data/figures'

/**
 * Guards the core pages against drifting off the design system
 * (src/styles/ds/reference/README.md, "Ledger with instruments").
 *
 * A file is added to CORE once it has been moved onto the system. The other
 * pages are not held to it yet. If a rule fires on a core file, fix the file;
 * only widen a rule when the system itself has changed.
 */
const CORE = [
  'src/app/page.tsx',
  'src/app/p/[slug]/page.tsx',
  'src/app/quests/page.tsx',
  'src/app/good-quests/page.tsx',
  'src/app/methodology/page.tsx',
  'src/app/figures/[slug]/page.tsx',
  'src/app/problem-index/page.tsx',
  'src/app/problem-index/[slug]/page.tsx',
  'src/components/ProblemIndexTable.tsx',
  'src/components/FigureCard.tsx',
  'src/components/ClassActionBar.tsx',
  'src/components/ActionBar.tsx',
  'src/components/RankedProblems.tsx',
  'src/components/charts/NeglectMeter.tsx',
  'src/components/ProblemNumbers.tsx',
  'src/components/CtaBoard.tsx',
  'src/components/BurdenBlock.tsx',
  'src/components/ConstraintTree.tsx',
  'src/components/CoordinationBoard.tsx',
  'src/components/CommitmentForm.tsx',
  'src/components/CiteThis.tsx',
  'src/components/DiscoveryList.tsx',
  'src/components/OpenQuestCard.tsx',
  'src/components/SupplyDemandTable.tsx',
  'src/components/PlayerCardPanel.tsx',
  'src/components/QuestList.tsx',
  'src/components/QuestFlow.tsx',
  'src/components/QuestGrid.tsx',
  'src/components/PageHeader.tsx',
  'src/components/HeroFigure.tsx',
  'src/components/EmailCapture.tsx',
  'src/components/LiveIndicators.tsx',
]

/** Files that define or demonstrate the class colors, so may name them. */
const MAY_NAME_CLASS_COLORS = ['src/lib/visitor-classes.ts', 'src/app/design-system/page.tsx']

const read = (path: string) => readFileSync(path, 'utf8')

/** Every match with its line number, so a failure says where to look. */
function hits(path: string, pattern: RegExp): string[] {
  return read(path)
    .split('\n')
    .flatMap((line, i) => (pattern.test(line) ? [`${path}:${i + 1}  ${line.trim().slice(0, 110)}`] : []))
}

const all = (pattern: RegExp, files = CORE) => files.flatMap((f) => hits(f, pattern))

const UTILITY = '(?:bg|text|border|fill|stroke|ring|outline|decoration|divide|from|to|via|accent|caret|shadow)'
// Tailwind's stock palettes, plus the two legacy names in tailwind.config.ts
// (blue is now the researcher color; amber is an old alias for teal).
const PALETTE =
  '(?:slate|gray|zinc|stone|red|orange|yellow|lime|green|emerald|cyan|sky|indigo|violet|purple|fuchsia|pink|rose|blue|amber)'

describe('core pages stay on the design system', () => {
  it('uses color tokens, not palette colors', () => {
    expect(all(new RegExp(`(?<![\\w-])${UTILITY}-${PALETTE}-\\d{2,3}(?![\\w])`))).toEqual([])
  })

  it('uses no raw hex or rgb colors', () => {
    expect(all(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-zA-Z])|rgba?\(\s*\d/)).toEqual([])
  })

  it('keeps bold class color in the class buttons only', () => {
    const elsewhere = CORE.filter((f) => !MAY_NAME_CLASS_COLORS.includes(f))
    expect(all(new RegExp(`(?<![\\w-])${UTILITY}-(?:patron|founder|researcher)(?![\\w])`), elsewhere)).toEqual([])
  })

  it('sets words in Inter: no serif or mono font classes', () => {
    expect(all(/(?<![\w-])font-(?:serif|mono|display)(?![\w-])/)).toEqual([])
  })

  it('uses sentence case: no forced capitals', () => {
    expect(all(/(?<![\w:-])uppercase(?![\w-])|textTransform:\s*'uppercase'/)).toEqual([])
  })

  it('uses the named type sizes', () => {
    expect(all(/(?<![\w-])text-(?:xs|sm|lg|xl|[2-9]xl)(?![\w-])/)).toEqual([])
  })

  it('has no em dashes', () => {
    expect(all(/—|&mdash;/)).toEqual([])
  })

  it('keeps figures flat: small corners, no card shadows', () => {
    expect(all(/(?<![\w-])(?:rounded-(?:xl|2xl|3xl)|shadow-(?:sm|md|lg|xl))(?![\w-])/)).toEqual([])
  })
})

describe('figures', () => {
  it('has unique slugs and numbers', () => {
    expect(new Set(figures.map((f) => f.slug)).size).toBe(figures.length)
    expect(new Set(figures.map((f) => f.number)).size).toBe(figures.length)
  })

  it('gives every figure a finding, a hero number, bars and an https source', () => {
    for (const f of figures) {
      expect(f.finding.length, f.slug).toBeGreaterThan(10)
      expect(f.hero.value, f.slug).toBeTruthy()
      expect(f.bars.length, f.slug).toBeGreaterThanOrEqual(2)
      expect(f.sources.length, f.slug).toBeGreaterThan(0)
      for (const s of f.sources) expect(s.url, f.slug).toMatch(/^https:\/\//)
      expect(f.updated, f.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('has no em dashes', () => {
    expect(JSON.stringify(figures)).not.toContain('—')
  })
})
