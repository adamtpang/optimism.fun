/**
 * Pure matcher. No dataset imports, so the browser bundle stays small.
 * Domain labels match DOMAIN_LABEL in src/data/problems.ts.
 */
import type { Domain } from '@/data/types'
import type { Cta, CtaKind } from '@/data/ctas'

export type SkillId = 'engineering' | 'bio' | 'policy' | 'design' | 'sales' | 'research'
export type OfferId = 'time' | 'money' | 'buying'
export type MatchKind = 'problem' | 'risk'
type RiskSlug = 'ai-control' | 'engineered-pandemics' | 'nuclear-war' | 'planetary-catastrophe'

const DOMAIN_LABEL: Record<Domain, string> = {
  ai: 'AI',
  bio: 'Biosecurity',
  health: 'Health',
  energy: 'Energy',
  climate: 'Climate',
  poverty: 'Poverty',
  education: 'Education',
  science: 'Science',
  longevity: 'Longevity',
  social: 'Social',
  governance: 'Governance',
}

export const SKILLS: { id: SkillId; label: string; domains: Domain[] }[] = [
  { id: 'engineering', label: 'Engineering', domains: ['energy', 'climate', 'science', 'ai'] },
  { id: 'bio', label: 'Biology', domains: ['bio', 'health', 'longevity'] },
  { id: 'policy', label: 'Policy', domains: ['governance', 'bio', 'climate', 'poverty'] },
  { id: 'design', label: 'Design', domains: ['education', 'social', 'health'] },
  { id: 'sales', label: 'Sales', domains: ['poverty', 'health', 'energy', 'education'] },
  { id: 'research', label: 'Research', domains: ['science', 'health', 'longevity', 'bio'] },
]

export const OFFERS: { id: OfferId; label: string; detail: string; kinds: CtaKind[] }[] = [
  { id: 'time', label: 'Time', detail: 'Build or learn', kinds: ['build', 'learn'] },
  { id: 'money', label: 'Money', detail: 'Fund', kinds: ['fund'] },
  { id: 'buying', label: 'Buying power', detail: 'Buy or back', kinds: ['buy'] },
]

export const RISK_DOMAINS: Record<RiskSlug, Domain[]> = {
  'ai-control': ['ai'],
  'engineered-pandemics': ['bio', 'health'],
  'nuclear-war': ['governance'],
  'planetary-catastrophe': ['climate'],
}

const RISK_SKILLS: Record<RiskSlug, SkillId[]> = {
  'ai-control': ['engineering', 'research', 'policy'],
  'engineered-pandemics': ['bio', 'research', 'policy'],
  'nuclear-war': ['policy', 'research'],
  'planetary-catastrophe': ['engineering', 'research', 'policy'],
}

export type WhereEntry = {
  id: string
  kind: MatchKind
  name: string
  tagline: string
  domain: Domain | null
  rank: number
  href: string
}

export type WhereMatch = {
  entry: WhereEntry
  reasons: string[]
  ctas: Cta[]
}

export type WhereCatalog = {
  problems: WhereEntry[]
  risks: WhereEntry[]
  ctas: Cta[]
  interests: { id: Domain; label: string }[]
}

function ctasFor(entry: WhereEntry, list: Cta[], kinds: Set<CtaKind>): Cta[] {
  const rows = list.filter((c) =>
    entry.kind === 'problem' ? c.problemSlugs.includes(entry.id) : (c.riskSlugs ?? []).includes(entry.id as RiskSlug),
  )
  if (kinds.size === 0) return rows
  return rows.filter((c) => kinds.has(c.kind))
}

function skillHit(entry: WhereEntry, skills: SkillId[]): boolean {
  if (skills.length === 0) return false
  if (entry.kind === 'risk') {
    const allowed = RISK_SKILLS[entry.id as RiskSlug] ?? []
    return skills.some((skill) => allowed.includes(skill))
  }
  const domains = new Set(skills.flatMap((skill) => SKILLS.find((s) => s.id === skill)?.domains ?? []))
  return entry.domain != null && domains.has(entry.domain)
}

export function matchWhere(input: {
  skills: SkillId[]
  interests: Domain[]
  offers: OfferId[]
  problems: WhereEntry[]
  risks: WhereEntry[]
  ctas: Cta[]
}): WhereMatch[] {
  const skills = input.skills.filter((id) => SKILLS.some((s) => s.id === id))
  const interests = input.interests
  const offers = input.offers.filter((id) => OFFERS.some((o) => o.id === id))
  const kinds = new Set(offers.flatMap((id) => OFFERS.find((o) => o.id === id)?.kinds ?? []))
  const narrowed = skills.length > 0 || interests.length > 0
  let pool = narrowed ? [...input.problems, ...input.risks] : [...input.problems]

  if (interests.length > 0) {
    const want = new Set(interests)
    pool = pool.filter((entry) => {
      if (entry.kind === 'risk') return (RISK_DOMAINS[entry.id as RiskSlug] ?? []).some((d) => want.has(d))
      return entry.domain != null && want.has(entry.domain)
    })
  }

  const scored = pool.map((entry) => {
    const base = entry.kind === 'problem' ? 30 - entry.rank : 10 - entry.rank
    let score = base
    const reasons: string[] = []
    if (skillHit(entry, skills)) {
      score += 30
      for (const skill of skills) {
        const label = SKILLS.find((s) => s.id === skill)?.label
        if (label && skillHit(entry, [skill])) reasons.push(label)
      }
    }
    if (interests.length > 0) {
      const matched =
        entry.kind === 'risk'
          ? (RISK_DOMAINS[entry.id as RiskSlug] ?? []).filter((d) => interests.includes(d))
          : entry.domain && interests.includes(entry.domain)
            ? [entry.domain]
            : []
      if (matched.length > 0) {
        score += 10
        for (const domain of matched) reasons.push(DOMAIN_LABEL[domain])
      }
    }
    const rows = ctasFor(entry, input.ctas, kinds)
    if (offers.length > 0 && rows.length > 0) {
      score += 20
      for (const offer of offers) reasons.push(OFFERS.find((o) => o.id === offer)?.label ?? offer)
    }
    if (reasons.length === 0) reasons.push('Highest on the current ranking')
    return { entry, score, reasons: [...new Set(reasons)], ctas: rows }
  })

  scored.sort(
    (a, b) => b.score - a.score || a.entry.rank - b.entry.rank || a.entry.name.localeCompare(b.entry.name),
  )
  return scored.slice(0, 3).map(({ entry, reasons, ctas: rows }) => ({ entry, reasons, ctas: rows }))
}
