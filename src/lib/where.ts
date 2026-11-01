/**
 * Server catalog for the matcher. The scoring itself is in where-match.ts.
 */
import type { Domain } from '@/data/types'
import { problems, DOMAIN_LABEL } from '@/data/problems'
import { existentialRisks } from '@/data/existential-risks'
import { ctas } from '@/data/ctas'
import { rankBySlug } from '@/lib/open-data'
import { RISK_DOMAINS, type WhereCatalog } from '@/lib/where-match'

export type { OfferId, SkillId, WhereCatalog, WhereEntry, WhereMatch } from '@/lib/where-match'
export { OFFERS, SKILLS, matchWhere } from '@/lib/where-match'

export function whereCatalog(): WhereCatalog {
  const rank = rankBySlug()
  const present = new Set(problems.map((p) => p.domain).filter(Boolean) as Domain[])
  present.add('ai')
  const interests = (Object.keys(DOMAIN_LABEL) as Domain[])
    .filter((id) => present.has(id))
    .map((id) => ({ id, label: DOMAIN_LABEL[id] }))

  return {
    problems: [...problems]
      .map((p) => ({
        id: p.slug,
        kind: 'problem' as const,
        name: p.name,
        tagline: p.tagline,
        domain: p.domain ?? null,
        rank: rank.get(p.slug) ?? 99,
        href: `/p/${p.slug}`,
      }))
      .sort((a, b) => a.rank - b.rank),
    risks: existentialRisks.map((risk) => ({
      id: risk.slug,
      kind: 'risk' as const,
      name: risk.name,
      tagline: risk.bottleneck,
      domain: RISK_DOMAINS[risk.slug][0] ?? null,
      rank: risk.rank,
      href: `/s-tier#${risk.slug}`,
    })),
    ctas,
    interests,
  }
}
