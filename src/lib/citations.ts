import type { CitedCount, MortalityPair, Problem } from '@/data/types'
import { displayDeathCitation } from '@/lib/burden'

export type Citation = { text: string; href?: string }

const SITE = 'https://optimism.fun'

/** The pair that was actually scored, if this problem has a death-rate severity. */
export function deathRatePair(problem: Problem): MortalityPair | undefined {
  return problem.mortalityPairs?.find((pair) => !pair.notScoredBecause)
}

function yearOf(asOf: string): string {
  return asOf.slice(0, 4)
}

function apaCount(count: CitedCount): Citation {
  const year = count.year == null ? 'n.d.' : String(count.year)
  const doi = count.doi ? ` https://doi.org/${count.doi}` : ''
  return {
    text: `${count.source} (${year}). ${count.label}: ${count.value.toLocaleString('en-US')}.${doi} ${count.sourceUrl}`,
    href: count.doi ? `https://doi.org/${count.doi}` : count.sourceUrl,
  }
}

function apaSourced(
  label: string,
  n: { source: string; sourceUrl?: string; asOf: string } | null | undefined,
): Citation | null {
  if (!n?.source) return null
  const year = yearOf(n.asOf)
  const url = n.sourceUrl ? ` ${n.sourceUrl}` : ''
  return {
    text: `${n.source} (${year}). ${label}.${url}`,
    href: n.sourceUrl,
  }
}

/**
 * APA citation of this problem on optimism.fun, then each underlying source.
 * URLs are deduped. A source with no URL is still listed, once.
 */
export function citationsForProblem(problem: Problem): Citation[] {
  const seen = new Set<string>()
  const out: Citation[] = []
  const add = (c: Citation | null) => {
    if (!c) return
    const key = c.href ?? c.text
    if (seen.has(key)) return
    seen.add(key)
    out.push(c)
  }

  add({
    text: `optimism.fun. (${yearOf(problem.asOf)}). ${problem.name}. ${SITE}/p/${problem.slug}`,
    href: `${SITE}/p/${problem.slug}`,
  })

  for (const s of problem.sources) {
    add({ text: `${s.title}. ${s.url}`, href: s.url })
  }

  add(apaSourced('People affected', problem.humansAffected))
  add(apaSourced('Severity', problem.severity))
  add(apaSourced('Scale', problem.scale))
  add(apaSourced('Market size', problem.marketSize))
  add(apaSourced('Solution quality', problem.currentSolutionQuality))
  add(apaSourced('Neglectedness', problem.neglectedness))
  add(apaSourced('Tractability', problem.tractability))
  for (const lens of [problem.scores.welfareBCR, problem.scores.xriskITN, problem.scores.utilityDelta]) {
    add(apaSourced('Lens score', lens ?? undefined))
  }

  for (const pair of problem.mortalityPairs ?? []) {
    add(apaCount(pair.deaths))
    add(apaCount(pair.affected))
  }

  const deaths = displayDeathCitation(problem.slug)
  if (deaths) {
    add({
      text: `${deaths.source} (${deaths.year}). Related deaths shown on this page: ${deaths.value.toLocaleString('en-US')}. ${deaths.sourceUrl}`,
      href: deaths.sourceUrl,
    })
  }

  return out
}
