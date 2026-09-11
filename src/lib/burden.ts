/**
 * The burden layer's arithmetic. Pure functions over data/mortality.ts.
 *
 * Two outputs matter:
 *   deathsByProblem   how many annual deaths sit in the causes each problem
 *                     addresses, and which of those causes have no count.
 *   unmappedCauses    the killers no problem on the index addresses, largest
 *                     first. This is the coverage audit stated in deaths rather
 *                     than in list membership.
 *
 * Plus one signal for the demand model, mortalitySignal, on the same 0..1
 * log scale the model already uses, so it can be blended into the burden
 * component without changing that component's units.
 *
 * Overlap is deliberate and disclosed: a cause mapped to two problems counts
 * under both. Aggregates never count. Null counts never count, but they are
 * carried through so a page can say "and two more, unmeasured".
 */
import { mortalityCauses, type MortalityCause } from '@/data/mortality'

/**
 * Anchors the log scale. Set to the largest cause GROUP on Earth (all
 * cardiovascular disease, 19.2M deaths in 2023) rather than the largest single
 * cause, because a problem's mapped causes are summed and overlap: hypertension
 * and longevity both carry ischaemic heart disease plus stroke, 15.9M and 17.7M
 * respectively, and a 10M ceiling would clamp both to 1 and lose the ordering.
 */
export const MORTALITY_CEILING = 20_000_000

/**
 * Deaths per year in a well-covered problem's causes. A problem whose mapped
 * causes have no counts at all gets no signal rather than a zero, so it is
 * not penalised for the source's silence.
 */
export type ProblemBurden = {
  problemSlug: string
  /** Sum of counted deaths across mapped, non-aggregate causes. */
  deaths: number
  /** Mapped causes with a count, largest first. */
  counted: MortalityCause[]
  /** Mapped causes the source ranks but does not count. */
  unmeasured: MortalityCause[]
  /** The aggregates that name this problem, for display only. */
  aggregates: MortalityCause[]
}

export const DISCLOSURE =
  'Deaths in the causes this problem addresses, from WHO 2021 and GBD 2023. Not deaths this problem would prevent. A cause shared by two problems is counted under both, so sums across problems overlap.'

const isSingle = (c: MortalityCause) => !c.aggregate

const byDeathsDesc = (a: MortalityCause, b: MortalityCause) =>
  (b.deaths.value ?? -1) - (a.deaths.value ?? -1)

export function burdenForProblem(problemSlug: string): ProblemBurden | null {
  const mapped = mortalityCauses.filter((c) => c.problemSlugs.includes(problemSlug))
  if (mapped.length === 0) return null

  const singles = mapped.filter(isSingle)
  const counted = singles.filter((c) => c.deaths.value != null).sort(byDeathsDesc)
  const unmeasured = singles.filter((c) => c.deaths.value == null)
  const aggregates = mapped.filter((c) => c.aggregate)

  return {
    problemSlug,
    deaths: counted.reduce((s, c) => s + (c.deaths.value ?? 0), 0),
    counted,
    unmeasured,
    aggregates,
  }
}

export function deathsByProblem(): Map<string, ProblemBurden> {
  const out = new Map<string, ProblemBurden>()
  const slugs = new Set(mortalityCauses.flatMap((c) => c.problemSlugs))
  for (const slug of slugs) {
    const b = burdenForProblem(slug)
    if (b) out.set(slug, b)
  }
  return out
}

/**
 * Top killers with no problem on the index. Aggregates are included here on
 * purpose: "all cancers, 9.7M, nothing on the index" is the finding, and
 * nothing is being summed.
 */
export function unmappedCauses(): MortalityCause[] {
  return mortalityCauses.filter((c) => c.problemSlugs.length === 0).sort(byDeathsDesc)
}

/** Counted deaths across all single causes. Aggregates excluded. */
export function totalCountedDeaths(): number {
  return mortalityCauses
    .filter(isSingle)
    .reduce((s, c) => s + (c.deaths.value ?? 0), 0)
}

/**
 * 0..1 on a log scale against MORTALITY_CEILING, matching lib/demand.ts's
 * logNorm convention. Null when the problem has no counted mapped deaths.
 */
export function mortalitySignal(problemSlug: string): number | null {
  const b = burdenForProblem(problemSlug)
  if (!b || b.deaths <= 0) return null
  const v = Math.log10(b.deaths) / Math.log10(MORTALITY_CEILING)
  return Math.max(0, Math.min(1, v))
}

/** Every slug the data maps to must exist in the ranked index. */
export function mappingIntegrity(knownSlugs: string[]): string[] {
  const known = new Set(knownSlugs)
  const bad = new Set<string>()
  for (const c of mortalityCauses) for (const s of c.problemSlugs) if (!known.has(s)) bad.add(s)
  return [...bad]
}
