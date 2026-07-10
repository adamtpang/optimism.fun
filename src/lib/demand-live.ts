/**
 * Live demand composition — the static demand model (lib/demand.ts) overlaid
 * with signals fetched from free statistical APIs at render time.
 *
 * Rules of the overlay:
 *   - research + queues: the live number IS the strength (these classes are
 *     null in the static path, so a live fetch genuinely lights them up and
 *     raises corroboration).
 *   - burden: the static strength (humans × severity, from sourced seeds)
 *     stays authoritative; the live observation rides along as the cold hard
 *     number + freshness shown in the UI. A live series corroborates burden,
 *     it does not re-derive it.
 *   - Every fetch degrades to null → the class simply stays as the static
 *     path had it. The page renders correctly with zero network access.
 */
import { problems, DOMAIN_LABEL } from '@/data/problems'
import type { Problem } from '@/data/types'
import {
  buildComponents,
  composeDemand,
  type DemandComponent,
} from '@/lib/demand'
import { demandSignalRegistry } from '@/data/demand-signals'
import { fetchGho } from '@/lib/sources/who'
import { fetchOwid } from '@/lib/sources/owid'
import { fetchWdi } from '@/lib/sources/worldbank'
import { fetchNihProjectCount } from '@/lib/sources/nih'
import { fetchFdaShortages } from '@/lib/sources/openfda'

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

/**
 * log-normalize a positive count against a reference ceiling. Returns null
 * for a zero/negative count — same convention as demand.ts: a measurement of
 * zero is an ABSENT signal, never a present strength-0 that would flip the
 * corroboration gate and raise a score on zero evidence.
 */
function logNorm(value: number, ceiling: number): number | null {
  if (value <= 0) return null
  return clamp01(Math.log10(1 + value) / Math.log10(1 + ceiling))
}

/** A live observation attached to a demand class for display + auditing. */
export type LiveValue = {
  value: number
  unit: string
  label: string
  /** Year or date the observation refers to. */
  asOf: string
  source: string
  url: string | null
}

export type LiveDemandComponent = DemandComponent & { live?: LiveValue | null }

export type DemandRow = {
  slug: string
  name: string
  tagline: string
  domainLabel: string | null
  score: number
  corroboration: number
  considered: number
  components: LiveDemandComponent[]
}

async function liveComponentsFor(p: Problem): Promise<LiveDemandComponent[]> {
  const feeds = demandSignalRegistry[p.slug]
  const comps: LiveDemandComponent[] = buildComponents(p)
  if (!feeds) return comps

  const [burden, nih, fda] = await Promise.all([
    feeds.burden
      ? feeds.burden.kind === 'gho'
        ? fetchGho(feeds.burden.code)
        : feeds.burden.kind === 'owid'
          ? fetchOwid(feeds.burden.slug, { extraParams: feeds.burden.extraParams })
          : fetchWdi('WLD', feeds.burden.indicator)
      : Promise.resolve(null),
    feeds.nihSearch ? fetchNihProjectCount(feeds.nihSearch) : Promise.resolve(null),
    feeds.fdaCategory ? fetchFdaShortages({ category: feeds.fdaCategory }) : Promise.resolve(null),
  ])

  const burdenMeta = feeds.burden
    ? feeds.burden.kind === 'gho'
      ? { source: 'WHO GHO', url: `https://ghoapi.azureedge.net/api/${feeds.burden.code}` }
      : feeds.burden.kind === 'owid'
        ? { source: 'Our World in Data', url: `https://ourworldindata.org/grapher/${feeds.burden.slug}` }
        : {
            source: 'World Bank WDI',
            url: `https://data.worldbank.org/indicator/${feeds.burden.indicator}`,
          }
    : null

  return comps.map((c): LiveDemandComponent => {
    if (c.class === 'burden' && burden?.latest && feeds.burden && burdenMeta) {
      // Corroborate, don't re-derive: static strength stays, live number rides along.
      return {
        ...c,
        live: {
          value: burden.latest.value,
          unit: feeds.burden.unit,
          label: feeds.burden.label,
          asOf: String(burden.latest.year),
          source: burdenMeta.source,
          url: burdenMeta.url,
        },
      }
    }
    if (c.class === 'research' && nih) {
      // ~20k funded projects/yr on a topic ≈ the NIH frontier fully saturated.
      const strength = logNorm(nih.projectCount, 20_000)
      if (strength == null) return c // zero matches = absent signal, keep static
      return {
        ...c,
        strength,
        source: 'NIH RePORTER (live)',
        live: {
          value: nih.projectCount,
          unit: 'funded projects',
          label: `NIH projects matching “${nih.searchText}”`,
          asOf: `FY${nih.fiscalYear}`,
          source: 'NIH RePORTER',
          url: nih.url,
        },
      }
    }
    if (c.class === 'queues' && fda) {
      // ~50 DISTINCT drugs concurrently short in one area ≈ systemic failure.
      const strength = logNorm(fda.currentCount, 50)
      if (strength == null) return c // zero shortages = absent signal, keep static
      return {
        ...c,
        strength,
        source: 'openFDA drug shortages (live)',
        live: {
          value: fda.currentCount,
          unit: 'drugs in shortage',
          label: `Current FDA ${fda.category} shortages (distinct drugs)`,
          asOf: fda.sourceLastUpdated ?? 'today',
          source: 'openFDA',
          url: 'https://open.fda.gov/apis/drug/drugshortages/',
        },
      }
    }
    return c
  })
}

/**
 * All problems with live-overlaid demand readouts, ranked by composite score
 * — the power law of demand. Fetches fan out per problem and every failure
 * degrades to the static readout, so this never throws.
 */
export async function computeDemandRows(): Promise<DemandRow[]> {
  const rows = await Promise.all(
    problems.map(async (p) => {
      const components = await liveComponentsFor(p)
      const composed = composeDemand(components)
      return {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        domainLabel: p.domain ? DOMAIN_LABEL[p.domain] : null,
        ...composed,
        components,
      }
    }),
  )
  return rows.sort((a, b) => b.score - a.score)
}
