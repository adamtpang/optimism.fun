/**
 * One quest per ranked problem. Every figure is copied from a sourced field.
 * A missing list or reading is the phrase "not yet sourced".
 */
import type { SourcedNumber } from '@/data/types'
import { problems, DOMAIN_LABEL } from '@/data/problems'
import { companies } from '@/data/companies'
import { founders } from '@/data/founders'
import { ecosystem } from '@/data/ecosystem'
import { listDiscoveries } from '@/data/discoveries'
import { ctas } from '@/data/ctas'
import { getCapitalFlow } from '@/data/capital-flows'
import { expertPriors } from '@/data/expert-priors'
import { demandSignalRegistry, type DemandSignalFeeds } from '@/data/demand-signals'
import { TECHNOLOGIES } from '@/data/technologies'
import { technologyIdsForProblem } from '@/data/technologies'
import { readingsFor } from '@/lib/demand-snapshot'
import { ECOSYSTEM_TYPE_LABEL } from '@/data/types'
import { rankBySlug } from '@/lib/open-data'
import { SKILLS } from '@/lib/where-match'
import type { PlayerOptions } from '@/lib/player-card'
import {
  NOT_SOURCED,
  gapLineFor,
  leastSuppliedGap,
  type DemandFact,
  type QuestFinding,
  type QuestView,
  type SourcedParty,
} from '@/lib/quest-types'

function norm(value: string): string {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim()
}

/** Split a stored compound such as "USA / South Africa". Does not rename a country. */
export function placeParts(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(/\s+\/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function money(figure: SourcedNumber | null | undefined): string | null {
  if (!figure || typeof figure.value !== 'number') return null
  const unit = figure.unit ? ` ${figure.unit}` : ''
  return `${figure.value.toLocaleString('en-US')}${unit}`
}

function fact(label: string, figure: SourcedNumber, unitExtra = ''): DemandFact {
  const unit = [figure.unit, unitExtra].filter(Boolean).join(' ')
  return {
    label,
    value: figure.value.toLocaleString('en-US'),
    unit,
    source: figure.source,
    sourceUrl: figure.sourceUrl ?? null,
    asOf: figure.asOf,
  }
}

function missing(label: string): DemandFact {
  return { label, value: NOT_SOURCED, unit: '', source: '', sourceUrl: null, asOf: '' }
}

export function registeredFeedLabels(feeds: DemandSignalFeeds | undefined): string[] {
  if (!feeds) return []
  const labels: string[] = []
  if (feeds.burden) labels.push(feeds.burden.label)
  if (feeds.openAlexSearch) labels.push(`OpenAlex search "${feeds.openAlexSearch}"`)
  if (feeds.nihSearch) labels.push(`NIH RePORTER search "${feeds.nihSearch}"`)
  if (feeds.fdaCategory) labels.push(`openFDA shortages "${feeds.fdaCategory}"`)
  if (feeds.edgar) labels.push(`SEC EDGAR ${feeds.edgar.kind} "${feeds.edgar.q}"`)
  if (feeds.federalRegisterTerm) labels.push(`Federal Register "${feeds.federalRegisterTerm}"`)
  if (feeds.usaSpendingTerm) labels.push(`USAspending "${feeds.usaSpendingTerm}"`)
  return labels
}

function toFinding(row: ReturnType<typeof listDiscoveries>[number]): QuestFinding {
  return {
    id: row.id,
    title: row.title,
    published: row.published,
    summary: row.summary,
    url: row.url,
    source: row.source,
    changes: row.changes,
    review: row.review,
    status: row.status ?? null,
    notice: row.notice?.note ?? null,
    noticeUrl: row.notice?.url ?? null,
  }
}

export function buildPlayerOptions(): PlayerOptions {
  const places = new Set<string>()
  for (const company of companies) for (const place of placeParts(company.country)) places.add(place)
  for (const founder of founders) for (const place of placeParts(founder.country)) places.add(place)
  return {
    skills: SKILLS.map((skill) => ({ id: skill.id, label: skill.label })),
    domains: (Object.keys(DOMAIN_LABEL) as (keyof typeof DOMAIN_LABEL)[]).map((id) => ({
      id,
      label: DOMAIN_LABEL[id],
    })),
    technologies: TECHNOLOGIES.map((item) => ({ id: item.id, label: item.name })),
    places: [...places].sort((a, b) => a.localeCompare(b)),
    communities: ecosystem
      .map((entry) => ({ id: entry.slug, label: entry.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    networks: [
      ...companies.map((company) => ({
        id: `company:${company.slug}`,
        label: company.name,
        group: 'company' as const,
      })),
      ...founders.map((founder) => ({
        id: `founder:${founder.name}`,
        label: founder.name,
        group: 'founder' as const,
      })),
    ].sort((a, b) => a.label.localeCompare(b.label)),
  }
}

export function buildQuestBoard(): QuestView[] {
  const rank = rankBySlug()
  return problems
    .map((problem) => {
      const findings = listDiscoveries({ problemSlug: problem.slug })
      const live = findings.filter((row) => row.status !== 'retracted')
      const tractability = live.filter((row) => row.changes === 'tractability')
      const possible = tractability.slice(0, 3).map(toFinding)
      const newestFinding = tractability.length === 0 && live[0] ? toFinding(live[0]) : null

      const builders: SourcedParty[] = []
      const seen = new Set<string>()
      const countries: string[] = []
      const companyIds: string[] = []
      for (const company of companies.filter((row) => row.problemSlugs.includes(problem.slug))) {
        const figure = company.marketCap ?? company.valuation
        const bits = [company.stage, company.country ?? '', money(figure) ?? ''].filter(Boolean)
        builders.push({
          name: company.name,
          href: company.url ?? null,
          detail: bits.join(' · '),
          source: figure?.source ?? company.sources[0]?.title ?? company.name,
          sourceUrl: figure?.sourceUrl ?? company.sources[0]?.url ?? company.url ?? null,
        })
        seen.add(norm(company.name))
        countries.push(...placeParts(company.country))
        companyIds.push(`company:${company.slug}`)
      }
      const sourcedCompanies: SourcedParty[] = companies
        .filter((row) => row.problemSlugs.includes(problem.slug))
        .map((company) => {
          const source = company.sources[0]
          return {
            name: company.name,
            href: company.url ?? source?.url ?? null,
            detail: company.stage,
            source: source?.title ?? company.name,
            sourceUrl: source?.url ?? company.url ?? null,
          }
        })
      for (const org of problem.organizations ?? []) {
        if (seen.has(norm(org.name))) continue
        seen.add(norm(org.name))
        builders.push({
          name: org.name,
          href: org.url,
          detail: org.kind,
          source: `Named on ${problem.name}`,
          sourceUrl: org.url,
        })
      }

      const founderIds: string[] = []
      const funders: SourcedParty[] = []
      const funderSlugs: string[] = []
      for (const founder of founders) {
        for (const bet of founder.frontierBets ?? []) {
          if (bet.problemSlug !== problem.slug) continue
          if (!seen.has(norm(bet.vehicle))) {
            seen.add(norm(bet.vehicle))
            builders.push({
              name: bet.vehicle,
              href: bet.sourceUrl,
              detail: `Disclosed vehicle of ${founder.name}`,
              source: bet.source,
              sourceUrl: bet.sourceUrl,
            })
          }
          countries.push(...placeParts(founder.country))
          founderIds.push(`founder:${founder.name}`)
          funders.push({
            name: `${founder.name}, ${bet.vehicle}`,
            href: bet.sourceUrl,
            detail: bet.amount ? (money(bet.amount) ?? NOT_SOURCED) : `Amount: ${NOT_SOURCED}`,
            source: bet.amount?.source ?? bet.source,
            sourceUrl: bet.sourceUrl,
          })
        }
      }
      for (const entry of ecosystem.filter((row) => row.problemSlugs.includes(problem.slug))) {
        funders.push({
          name: entry.name,
          href: entry.url,
          detail: ECOSYSTEM_TYPE_LABEL[entry.type],
          source: 'Capital stack',
          sourceUrl: entry.url,
        })
        funderSlugs.push(entry.slug)
      }

      const namedPeople: SourcedParty[] = (problem.people ?? []).map((person) => ({
        name: person.name,
        href: person.url ?? null,
        detail: person.role,
        source: `Named on ${problem.name}`,
        sourceUrl: person.url ?? null,
      }))

      const demand: DemandFact[] = []
      if (typeof problem.humansAffected?.value === 'number') {
        const kind = problem.humansAffected.countKind ? `(${problem.humansAffected.countKind})` : ''
        demand.push(fact('Humans affected', problem.humansAffected, kind))
      } else {
        demand.push(missing('Humans affected'))
      }
      if (problem.scale) demand.push(fact('Headline scale', problem.scale, `(${problem.scale.trend})`))
      else demand.push(missing('Headline scale'))
      if (problem.marketSize) demand.push(fact('Market size', problem.marketSize))
      else demand.push(missing('Market size'))
      const flow = getCapitalFlow(problem.slug)
      if (flow) demand.push(fact('Annual capital flow', flow.usdPerYear, `(${flow.momentum})`))
      else demand.push(missing('Annual capital flow'))
      const priors = expertPriors.filter((prior) => prior.problemSlugs.includes(problem.slug))
      if (priors.length === 0) demand.push(missing('Expert prior'))
      else {
        for (const prior of priors) {
          demand.push({
            label: 'Expert prior',
            value: prior.org,
            unit: prior.kind,
            source: prior.note,
            sourceUrl: prior.url,
            asOf: '',
          })
        }
      }
      const stored = readingsFor(problem.slug)
      if (stored.length === 0) demand.push(missing('Live demand feeds'))
      else {
        for (const reading of stored) {
          demand.push({
            label: reading.label,
            value: reading.status === 'ok' && reading.value != null ? reading.value.toLocaleString('en-US') : NOT_SOURCED,
            unit: reading.status === 'ok' ? reading.unit : '',
            source: reading.status === 'ok' ? (reading.query ? `Query: ${reading.query}` : 'Stored reading') : (reading.reason ?? ''),
            sourceUrl: reading.sourceUrl,
            asOf: reading.retrievedOn,
          })
        }
      }

      const teams = builders.length > 0 ? builders.length : null
      const capital = funders.length > 0 ? funders.length : null
      const least = leastSuppliedGap(teams, capital)
      const demandSourced = demand.some((row) => row.value !== NOT_SOURCED)

      const view: QuestView = {
        slug: problem.slug,
        name: problem.name,
        tagline: problem.tagline,
        domain: problem.domain ?? null,
        domainLabel: problem.domain ? DOMAIN_LABEL[problem.domain] : null,
        tier: problem.tier,
        rank: rank.get(problem.slug) ?? problems.length,
        href: `/p/${problem.slug}`,
        possible,
        newestFinding,
        retractedOnly: findings.length > 0 && live.length === 0,
        builders,
        namedPeople,
        funders,
        demand,
        teamCount: teams ?? 0,
        funderCount: capital ?? 0,
        teamsSourced: teams != null,
        capitalSourced: capital != null,
        leastSupplied: least,
        countries: [...new Set(countries)].sort((a, b) => a.localeCompare(b)),
        funderSlugs: [...new Set(funderSlugs)],
        companyIds: [...new Set(companyIds)],
        founderIds: [...new Set(founderIds)],
        technologyIds: technologyIdsForProblem(problem.slug),
        sourcedCompanies,
        sourcedCompanyCount: sourcedCompanies.length,
        actions: ctas
          .filter((cta) => cta.problemSlugs.includes(problem.slug))
          .map((cta) => ({ kind: cta.kind, name: cta.name, url: cta.url, detail: cta.oneLiner })),
        gapLine: gapLineFor({ demandSourced, teams, capital, least }),
      }
      return view
    })
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
}
