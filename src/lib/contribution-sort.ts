/**
 * Sort people and public companies by a sourced link to a ranked problem.
 * The link is a frontier bet problem slug, or an exact normalized name match
 * to a tagged company or an organization on a problem. No link stays
 * "not yet sourced" and keeps the original size order behind the linked rows.
 * Problem ranks are read, not recomputed.
 */
import { founders } from '@/data/founders'
import type { Founder, PublicCompany } from '@/data/types'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { publicCompanies } from '@/data/public-companies'
import { rankBySlug } from '@/lib/open-data'

export type ProblemRef = { slug: string; name: string; rank: number }
export type SortMode = 'size' | 'contribution'

export type FounderRow = { founder: Founder; contribution: string }
export type CompanyRow = { company: PublicCompany; contribution: string }

function norm(value: string): string {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim()
}

export function sortByProblemContribution<T>(items: readonly T[], links: (item: T) => ProblemRef[]): T[] {
  return items
    .map((item, index) => {
      const refs = links(item)
      const slugs = new Set(refs.map((ref) => ref.slug))
      const best = refs.reduce((min, ref) => Math.min(min, ref.rank), Number.POSITIVE_INFINITY)
      return { item, index, linked: slugs.size > 0, best, count: slugs.size }
    })
    .sort((a, b) => {
      if (a.linked !== b.linked) return a.linked ? -1 : 1
      if (a.linked && b.linked) {
        if (a.best !== b.best) return a.best - b.best
        if (a.count !== b.count) return b.count - a.count
      }
      return a.index - b.index
    })
    .map((row) => row.item)
}

function namesAndRanks() {
  const rank = rankBySlug()
  const names = new Map(problems.map((problem) => [problem.slug, problem.name]))
  return { rank, names }
}

export function founderLinks(founder: Founder, rank: Map<string, number>, names: Map<string, string>): ProblemRef[] {
  const refs: ProblemRef[] = []
  for (const bet of founder.frontierBets ?? []) {
    if (!bet.problemSlug) continue
    const place = rank.get(bet.problemSlug)
    if (!place) continue
    refs.push({ slug: bet.problemSlug, name: names.get(bet.problemSlug) ?? bet.problemSlug, rank: place })
  }
  return refs
}

export function publicCompanyLinks(
  company: PublicCompany,
  rank: Map<string, number>,
  names: Map<string, string>,
): ProblemRef[] {
  const key = norm(company.name)
  const refs: ProblemRef[] = []
  const push = (slug: string) => {
    const place = rank.get(slug)
    if (!place) return
    refs.push({ slug, name: names.get(slug) ?? slug, rank: place })
  }
  for (const problem of problems) {
    for (const org of problem.organizations ?? []) {
      if (norm(org.name) === key) push(problem.slug)
    }
  }
  for (const tagged of companies) {
    if (norm(tagged.name) !== key) continue
    for (const slug of tagged.problemSlugs) push(slug)
  }
  return refs
}

export function contributionLabel(refs: ProblemRef[]): string {
  if (refs.length === 0) return 'not yet sourced'
  const unique = [...new Map(refs.map((ref) => [ref.slug, ref])).values()].sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
  return unique.map((ref) => ref.name).join(', ')
}

export function founderRows(mode: SortMode): FounderRow[] {
  const { rank, names } = namesAndRanks()
  const ordered =
    mode === 'contribution'
      ? sortByProblemContribution(founders, (founder) => founderLinks(founder, rank, names))
      : founders
  return ordered.map((founder) => ({
    founder,
    contribution: contributionLabel(founderLinks(founder, rank, names)),
  }))
}

export function companyRows(mode: SortMode): CompanyRow[] {
  const { rank, names } = namesAndRanks()
  const ordered =
    mode === 'contribution'
      ? sortByProblemContribution(publicCompanies, (company) => publicCompanyLinks(company, rank, names))
      : publicCompanies
  return ordered.map((company) => ({
    company,
    contribution: contributionLabel(publicCompanyLinks(company, rank, names)),
  }))
}
