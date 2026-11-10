/**
 * Placeholder companies for problems, and for sourced constraint gaps, that
 * have no named supplier. They are not companies. They are not supply.
 * They carry no revenue, funding, or valuation.
 */
import { problems } from '@/data/problems'
import { DOMAIN_LABEL } from '@/data/problems'
import { constraintTrees, type Constraint } from '@/data/constraints'
import { SKILLS } from '@/lib/where-match'
import { NOT_SOURCED } from '@/lib/quest-types'
import { technologiesForProblem } from '@/data/technologies'
import { balanceBySlug, hasNamedExternalCompany, sourcedCompanyCount, type ScoreInput } from '@/lib/sourced-balance'

export type OpenQuest = {
  id: string
  /** Always true. Callers must not count these as companies. */
  placeholder: true
  kind: 'problem' | 'sub-gap'
  problemSlug: string
  problemName: string
  name: string
  gap: string
  gapSourceUrl: string | null
  gapSource: string | null
  demand: ScoreInput[]
  fit: { label: string; value: string }[]
  href: string
  marketCap: null
  valuation: null
  revenue: null
}

function walk(nodes: Constraint[], out: Constraint[]) {
  for (const node of nodes) {
    out.push(node)
    if (node.children) walk(node.children, out)
  }
}

function fitFor(slug: string): { label: string; value: string }[] {
  const problem = problems.find((row) => row.slug === slug)
  const domain = problem?.domain ?? null
  const skills = domain ? SKILLS.filter((skill) => skill.domains.includes(domain)).map((skill) => skill.label) : []
  const techs = [...new Set(technologiesForProblem(slug).map((tag) => tag.name))]
  return [
    { label: 'Skills', value: skills.length ? skills.join(', ') : NOT_SOURCED },
    { label: 'Domains', value: domain ? DOMAIN_LABEL[domain] : NOT_SOURCED },
    { label: 'Technologies', value: techs.length ? techs.join(', ') : NOT_SOURCED },
    { label: 'Places', value: NOT_SOURCED },
    { label: 'Networks', value: NOT_SOURCED },
  ]
}

function demandInputs(slug: string): ScoreInput[] {
  return balanceBySlug().get(slug)?.inputs ?? []
}

export function openQuestPlaceholders(): OpenQuest[] {
  const out: OpenQuest[] = []
  for (const problem of problems) {
    if (sourcedCompanyCount(problem.slug) === 0 && !hasNamedExternalCompany(problem.slug)) {
      out.push({
        id: `open:${problem.slug}`,
        placeholder: true,
        kind: 'problem',
        problemSlug: problem.slug,
        problemName: problem.name,
        name: `Acme ${problem.name} Co. (open quest, not a real company)`,
        gap: 'No sourced company is on file for this problem.',
        gapSourceUrl: null,
        gapSource: null,
        demand: demandInputs(problem.slug),
        fit: fitFor(problem.slug),
        href: `/where?quest=${encodeURIComponent(problem.slug)}`,
        marketCap: null,
        valuation: null,
        revenue: null,
      })
    }
  }
  for (const tree of constraintTrees) {
    const problem = problems.find((row) => row.slug === tree.problemSlug)
    if (!problem) continue
    const nodes: Constraint[] = []
    walk(tree.root, nodes)
    for (const node of nodes) {
      if (node.suppliers.length > 0) continue
      if (node.sources.length === 0) continue
      const source = node.sources[0]
      if (!source?.url) continue
      out.push({
        id: `open:${problem.slug}:${node.id}`,
        placeholder: true,
        kind: 'sub-gap',
        problemSlug: problem.slug,
        problemName: problem.name,
        name: `Acme ${problem.name} Co. (open quest, not a real company)`,
        gap: node.claim,
        gapSourceUrl: source.url,
        gapSource: source.label,
        demand: demandInputs(problem.slug),
        fit: fitFor(problem.slug),
        href: `/where?quest=${encodeURIComponent(problem.slug)}&gap=${encodeURIComponent(node.id)}`,
        marketCap: null,
        valuation: null,
        revenue: null,
      })
    }
  }
  return out
}

export function openQuestsFor(slug: string): OpenQuest[] {
  return openQuestPlaceholders().filter((quest) => quest.problemSlug === slug)
}
