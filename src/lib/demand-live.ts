/**
 * Demand composition. Research, policy, queues, capital observations, and
 * Wikipedia attention come from the render snapshot, the same object the
 * export returns. This module does not call those APIs.
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
import { RENDER_SNAPSHOT_ID, burdenFromSnapshot, demandCapture } from '@/lib/render-snapshot'

type OpenAlexDetail = { search: string; fromDate: string; workCount: number; url: string }
type EdgarDetail = { filingCount: number; capped: boolean; fromDate: string; url: string }
type FedDetail = { term: string; documentCount: number; rulemakingCount: number | null; fromDate: string; url: string }
type UsaDetail = { term: string; awardCount: number; fromDate: string; url: string }
type WikiDetail = { article: string; monthlyAverage: number; months: number; url: string }
type NihDetail = { searchText: string; projectCount: number; fiscalYear: number; url: string | null }
type FdaDetail = { category: string | null; currentCount: number; sourceLastUpdated: string | null }

function captured<T>(problem: string, provider: string, configured: boolean): T | 'unavailable' | null {
  if (!configured) return null
  const row = demandCapture(problem, provider)
  if (!row || row.status !== 'ok' || row.detail == null) return 'unavailable'
  return row.detail as T
}

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

export type LiveDemandComponent = DemandComponent & {
  live?: LiveValue | null
  /** Set when a mapped feed has no published equivalent. The word the UI shows. */
  unavailable?: 'unavailable'
}

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

  const burden = feeds.burden ? burdenFromSnapshot(feeds.burden) : null
  const openalex = captured<OpenAlexDetail>(p.slug, 'openalex', Boolean(feeds.openAlexSearch))
  const edgar = captured<EdgarDetail>(p.slug, 'edgar', Boolean(feeds.edgar))
  const fedreg = captured<FedDetail>(p.slug, 'federal-register', Boolean(feeds.federalRegisterTerm))
  const usaspend = captured<UsaDetail>(p.slug, 'usaspending', Boolean(feeds.usaSpendingTerm))
  const wiki = captured<WikiDetail>(p.slug, 'wikipedia', Boolean(feeds.wikipediaArticle))
  const nih = captured<NihDetail>(p.slug, 'nih', Boolean(feeds.nihSearch))
  const fda = captured<FdaDetail>(p.slug, 'openfda', Boolean(feeds.fdaCategory))

  const mapped = comps.map((c): LiveDemandComponent => {
    if (c.class === 'burden' && burden?.status === 'unavailable') {
      return { ...c, unavailable: 'unavailable' }
    }
    if (c.class === 'burden' && burden?.status === 'ok') {
      // Corroborate, don't re-derive: static strength stays, live number rides along.
      return {
        ...c,
        live: {
          value: burden.value,
          unit: burden.unit,
          label: burden.label,
          asOf: String(burden.year),
          source: burden.source,
          url: burden.url,
        },
      }
    }
    if (c.class === 'policy') {
      if (fedreg === 'unavailable') return { ...c, unavailable: 'unavailable' }
      if (!fedreg) return c
      const strength = logNorm(fedreg.documentCount, 800)
      const rules =
        fedreg.rulemakingCount != null ? `, ${fedreg.rulemakingCount} of them rulemaking` : ''
      return {
        ...c,
        ...(strength == null ? {} : { strength, source: `Federal Register (snapshot ${RENDER_SNAPSHOT_ID})` }),
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
    if (c.class === 'capital') {
      if (edgar && edgar !== 'unavailable' && feeds.edgar) {
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
      if (usaspend && usaspend !== 'unavailable') {
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
      if (edgar === 'unavailable' || usaspend === 'unavailable') {
        return { ...c, unavailable: 'unavailable' }
      }
      return c
    }
    if (c.class === 'research') {
      if (openalex && openalex !== 'unavailable') {
      // OpenAlex is preferred: it covers every discipline, so the number is
      // comparable problem-to-problem. Ceiling calibrated to the observed
      // range across all 11 registry terms on 2026-07-20 — metascience 378 at
      // the floor, malaria|tuberculosis 85,516 at the top.
      // A real zero is shown and does not become a strength.
      const strength = logNorm(openalex.workCount, 100_000)
      return {
        ...c,
        ...(strength == null ? {} : { strength, source: `OpenAlex (snapshot ${RENDER_SNAPSHOT_ID})` }),
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
      if (nih && nih !== 'unavailable') {
      // Fallback only, and biomedical-biased — see the registry docstring.
      const strength = logNorm(nih.projectCount, 20_000)
      return {
        ...c,
        ...(strength == null ? {} : { strength, source: `NIH RePORTER (snapshot ${RENDER_SNAPSHOT_ID})` }),
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
      if (openalex === 'unavailable' || nih === 'unavailable') {
        return { ...c, unavailable: 'unavailable' }
      }
      return c
    }
    if (c.class === 'queues') {
      if (fda === 'unavailable') return { ...c, unavailable: 'unavailable' }
      if (!fda) return c
      // ~50 DISTINCT drugs concurrently short in one area ≈ systemic failure.
      // A real zero is shown and does not become a strength.
      const strength = logNorm(fda.currentCount, 50)
      return {
        ...c,
        ...(strength == null ? {} : { strength, source: `openFDA drug shortages (snapshot ${RENDER_SNAPSHOT_ID})` }),
        live: {
          value: fda.currentCount,
          unit: 'drugs in shortage',
          label: `Current FDA ${fda.category} shortages (distinct drugs)`,
          asOf: fda.sourceLastUpdated ?? RENDER_SNAPSHOT_ID,
          source: 'openFDA',
          url: 'https://open.fda.gov/apis/drug/drugshortages/',
        },
      }
    }
    return c
  })

  return {
    components: mapped,
    attention: wiki && wiki !== 'unavailable'
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
 * All problems with snapshot-overlaid demand readouts, ranked by composite score.
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
