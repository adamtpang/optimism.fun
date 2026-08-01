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
import { fetchOpenAlexCount } from '@/lib/sources/openalex'
import { fetchFormDCount } from '@/lib/sources/edgar'
import { fetchFederalRegisterCount } from '@/lib/sources/federal-register'
import { fetchUsaSpendingAwards } from '@/lib/sources/usaspending'
import { fetchWikipediaPageviews } from '@/lib/sources/wikipedia'
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
  /**
   * Attention, as CROWDING rather than demand — deliberately NOT a component.
   * Keeping it out of `components` keeps it out of the composite and out of
   * the corroboration count, which is the point: eyeballs are not evidence
   * that a problem matters, and counting them as such would invert the thesis
   * that the best opportunities are high demand with low attention.
   */
  attention: LiveValue | null
}

async function liveComponentsFor(
  p: Problem,
): Promise<{ components: LiveDemandComponent[]; attention: LiveValue | null }> {
  const feeds = demandSignalRegistry[p.slug]
  const comps: LiveDemandComponent[] = buildComponents(p)
  if (!feeds) return { components: comps, attention: null }

  const [burden, openalex, edgar, fedreg, usaspend, wiki, nih, fda] = await Promise.all([
    feeds.burden
      ? feeds.burden.kind === 'gho'
        ? fetchGho(feeds.burden.code)
        : feeds.burden.kind === 'owid'
          ? fetchOwid(feeds.burden.slug, { extraParams: feeds.burden.extraParams })
          : fetchWdi('WLD', feeds.burden.indicator)
      : Promise.resolve(null),
    feeds.openAlexSearch ? fetchOpenAlexCount(feeds.openAlexSearch) : Promise.resolve(null),
    feeds.edgar
      ? fetchFormDCount(feeds.edgar.q, { kind: feeds.edgar.kind })
      : Promise.resolve(null),
    feeds.federalRegisterTerm
      ? fetchFederalRegisterCount(feeds.federalRegisterTerm)
      : Promise.resolve(null),
    feeds.usaSpendingTerm
      ? fetchUsaSpendingAwards(feeds.usaSpendingTerm)
      : Promise.resolve(null),
    feeds.wikipediaArticle
      ? fetchWikipediaPageviews(feeds.wikipediaArticle)
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

  const mapped = comps.map((c): LiveDemandComponent => {
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
    if (c.class === 'policy' && fedreg) {
      // Lights a class that was dark: strength comes straight from regulatory
      // attention, since nothing static ever populated it. ~700 documents in
      // the window is the observed top of the range (nuclear energy), so the
      // ceiling sits just above it.
      const strength = logNorm(fedreg.documentCount, 800)
      if (strength == null) return c // zero documents = absent, not a zero score
      const rules =
        fedreg.rulemakingCount != null ? `, ${fedreg.rulemakingCount} of them rulemaking` : ''
      return {
        ...c,
        strength,
        source: 'Federal Register (live)',
        live: {
          value: fedreg.documentCount,
          unit: 'federal documents',
          label: `US rulemaking mentioning “${fedreg.term}” since ${fedreg.fromDate.slice(0, 4)}${rules}`,
          asOf: `since ${fedreg.fromDate}`,
          source: 'Federal Register',
          url: fedreg.url,
        },
      }
    }
    if (c.class === 'capital' && edgar && feeds.edgar) {
      // Corroborate, do not re-derive. The sourced $/yr in capital-flows.ts
      // covers ALL capital (government, philanthropic, corporate); Form D sees
      // only new US private raises. Letting a filing count set the strength
      // would quietly redefine the class, so the live number rides along and
      // the static strength stands.
      const scope =
        feeds.edgar.kind === 'industry-group'
          ? `industry group ${feeds.edgar.q.replace(/"/g, '')}`
          : `mentioning “${feeds.edgar.q}”`
      return {
        ...c,
        live: {
          value: edgar.filingCount,
          unit: edgar.capped ? 'raises (10k+)' : 'new US private raises',
          label: `Form D filings ${scope}, since ${edgar.fromDate.slice(0, 4)}`,
          asOf: `since ${edgar.fromDate}`,
          source: 'SEC EDGAR',
          url: edgar.url,
        },
      }
    }
    // Public capital, for the 6 problems the SEC's taxonomy cannot see. Same
    // observation-not-strength rule as EDGAR: capital-flows.ts still owns the
    // number, because an award count is not dollars.
    if (c.class === 'capital' && usaspend) {
      return {
        ...c,
        live: {
          value: usaspend.awardCount,
          unit: 'federal awards',
          label: `Federal grants and contracts mentioning “${usaspend.term}” since ${usaspend.fromDate.slice(0, 4)}`,
          asOf: `since ${usaspend.fromDate}`,
          source: 'USAspending',
          url: usaspend.url,
        },
      }
    }
    if (c.class === 'research' && openalex) {
      // OpenAlex is preferred: it covers every discipline, so the number is
      // comparable problem-to-problem. Ceiling calibrated to the observed
      // range across all 11 registry terms on 2026-07-20 — metascience 378 at
      // the floor, malaria|tuberculosis 85,516 at the top.
      const strength = logNorm(openalex.workCount, 100_000)
      if (strength == null) return c // zero matches = absent signal, keep static
      return {
        ...c,
        strength,
        source: 'OpenAlex (live)',
        live: {
          value: openalex.workCount,
          unit: 'papers',
          label: `Papers on “${openalex.search}” since ${openalex.fromDate.slice(0, 4)}`,
          asOf: `since ${openalex.fromDate.slice(0, 4)}`,
          source: 'OpenAlex',
          url: openalex.url,
        },
      }
    }
    if (c.class === 'research' && nih) {
      // Fallback only, and biomedical-biased — see the registry docstring.
      const strength = logNorm(nih.projectCount, 20_000)
      if (strength == null) return c
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

  return {
    components: mapped,
    attention: wiki
      ? {
          value: wiki.monthlyAverage,
          unit: 'monthly readers',
          label: `Wikipedia readers of “${wiki.article.replace(/_/g, ' ')}”`,
          asOf: `avg over ${wiki.months} months`,
          source: 'Wikimedia',
          url: wiki.url,
        }
      : null,
  }
}

/**
 * All problems with live-overlaid demand readouts, ranked by composite score
 * — the power law of demand. Fetches fan out per problem and every failure
 * degrades to the static readout, so this never throws.
 */
export async function computeDemandRows(): Promise<DemandRow[]> {
  const rows = await Promise.all(
    problems.map(async (p) => {
      const { components, attention } = await liveComponentsFor(p)
      const composed = composeDemand(components)
      return {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        domainLabel: p.domain ? DOMAIN_LABEL[p.domain] : null,
        ...composed,
        components,
        attention,
      }
    }),
  )
  return rows.sort((a, b) => b.score - a.score)
}
