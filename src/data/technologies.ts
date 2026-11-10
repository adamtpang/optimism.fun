/**
 * Enabling technologies. These are tools, not ranked problems.
 * A tag exists only when a company record already cites a URL and its stored
 * description contains the evidence phrase. Nothing here is a new company,
 * a new link, or a new problem.
 */
import { companies } from '@/data/companies'

export const TECHNOLOGIES = [
  {
    id: 'ai',
    name: 'AI',
    blurb: 'Software that learns, predicts, or generates. A tool for other problems, not a problem on the ranked index.',
  },
  {
    id: 'biotech',
    name: 'Biotech',
    blurb: 'Cells, genes, mRNA, or biologics used as engineering.',
  },
  {
    id: 'energy-tech',
    name: 'Energy tech',
    blurb: 'Machines that make, move, or store energy, including fission, fusion, geothermal, and solar.',
  },
  {
    id: 'robotics',
    name: 'Robotics',
    blurb: 'Machines that act in the physical world.',
  },
] as const

export type TechnologyId = (typeof TECHNOLOGIES)[number]['id']

export type TechnologyTag = {
  companySlug: string
  technologyId: TechnologyId
  /** Substring of the company description already stored in this repo. */
  evidence: string
  sourceUrl: string
}

/**
 * Evidence phrases are copied from company descriptions already in
 * src/data/companies.ts and src/data/health-companies.ts. The URL is that
 * company's existing source, not a new citation.
 */
export const TECHNOLOGY_TAGS: TechnologyTag[] = [
  { companySlug: 'khan-academy', technologyId: 'ai', evidence: 'AI tutor', sourceUrl: 'https://www.khanacademy.org' },
  { companySlug: 'speak', technologyId: 'ai', evidence: 'AI conversational tutor', sourceUrl: 'https://www.speak.com' },
  { companySlug: 'synthesis-tutor', technologyId: 'ai', evidence: 'AI tutor', sourceUrl: 'https://www.synthesis.com' },
  { companySlug: 'replit', technologyId: 'ai', evidence: 'AI agent', sourceUrl: 'https://replit.com' },
  { companySlug: 'wysa', technologyId: 'ai', evidence: 'AI mental-health', sourceUrl: 'https://www.wysa.com' },
  { companySlug: 'recursion', technologyId: 'ai', evidence: 'AI-driven', sourceUrl: 'https://www.recursion.com' },
  { companySlug: 'insitro', technologyId: 'ai', evidence: 'deep learning', sourceUrl: 'https://www.insitro.com' },
  { companySlug: 'isomorphic-labs', technologyId: 'ai', evidence: 'ML', sourceUrl: 'https://www.isomorphiclabs.com' },

  { companySlug: 'ginkgo-bioworks', technologyId: 'biotech', evidence: 'Cell programming', sourceUrl: 'https://www.ginkgobioworks.com' },
  { companySlug: 'moderna', technologyId: 'biotech', evidence: 'mRNA', sourceUrl: 'https://www.modernatx.com' },
  { companySlug: 'colossal', technologyId: 'biotech', evidence: 'genetic engineering', sourceUrl: 'https://colossal.com' },
  { companySlug: 'conception', technologyId: 'biotech', evidence: 'stem cells', sourceUrl: 'https://www.conception.bio' },
  { companySlug: 'recursion', technologyId: 'biotech', evidence: 'biology', sourceUrl: 'https://www.recursion.com' },
  { companySlug: 'insitro', technologyId: 'biotech', evidence: 'stem-cell', sourceUrl: 'https://www.insitro.com' },
  {
    companySlug: 'regeneron',
    technologyId: 'biotech',
    evidence: 'biologic',
    sourceUrl: 'https://www.pharmaceutical-tech.com/news/dupixent-dupilumab-approved-in-the-us-as-the-first-ever-biologic-medicine',
  },
  {
    companySlug: 'sanofi',
    technologyId: 'biotech',
    evidence: 'biologic',
    sourceUrl: 'https://www.pharmamanufacturing.com/development/drug-approvals/news/55143214/fda-approves-first-biologic-for-copd-treatment',
  },

  { companySlug: 'commonwealth-fusion', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://cfs.energy' },
  { companySlug: 'helion', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://www.helionenergy.com' },
  { companySlug: 'fervo', technologyId: 'energy-tech', evidence: 'geothermal', sourceUrl: 'https://fervoenergy.com' },
  { companySlug: 'kairos-power', technologyId: 'energy-tech', evidence: 'fission', sourceUrl: 'https://kairospower.com' },
  { companySlug: 'oklo', technologyId: 'energy-tech', evidence: 'fission', sourceUrl: 'https://oklo.com' },
  { companySlug: 'tae-technologies', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://tae.com' },
  { companySlug: 'general-fusion', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://generalfusion.com' },
  { companySlug: 'zap-energy', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://zapenergy.com' },
  { companySlug: 'first-light-fusion', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://firstlightfusion.com' },
  { companySlug: 'marvel-fusion', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://marvelfusion.com' },
  { companySlug: 'type-one-energy', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://typeoneenergy.com' },
  { companySlug: 'pacific-fusion', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://pacificfusion.com' },
  { companySlug: 'proxima-fusion', technologyId: 'energy-tech', evidence: 'fusion', sourceUrl: 'https://proximafusion.com' },
  { companySlug: 'aalo-atomics', technologyId: 'energy-tech', evidence: 'microreactor', sourceUrl: 'https://aalo.com' },
  { companySlug: 'radiant-industries', technologyId: 'energy-tech', evidence: 'microreactor', sourceUrl: 'https://radiantnuclear.com' },
  { companySlug: 'eavor', technologyId: 'energy-tech', evidence: 'geothermal', sourceUrl: 'https://eavor.com' },
  { companySlug: 'quaise-energy', technologyId: 'energy-tech', evidence: 'geothermal', sourceUrl: 'https://quaise.energy' },
  { companySlug: 'sage-geosystems', technologyId: 'energy-tech', evidence: 'geothermal', sourceUrl: 'https://sagegeosystems.com' },
  { companySlug: 'first-solar', technologyId: 'energy-tech', evidence: 'solar', sourceUrl: 'https://firstsolar.com' },
  { companySlug: 'heliogen', technologyId: 'energy-tech', evidence: 'solar', sourceUrl: 'https://heliogen.com' },
  { companySlug: 'oxford-pv', technologyId: 'energy-tech', evidence: 'solar', sourceUrl: 'https://oxfordpv.com' },

  { companySlug: 'built-robotics', technologyId: 'robotics', evidence: 'self-operating', sourceUrl: 'https://www.builtrobotics.com' },
  { companySlug: 'dusty-robotics', technologyId: 'robotics', evidence: 'robot', sourceUrl: 'https://www.dustyrobotics.com' },
]

export function technologyName(id: TechnologyId): string {
  return TECHNOLOGIES.find((row) => row.id === id)?.name ?? id
}

export type AppliedTechnology = {
  id: TechnologyId
  name: string
  companyName: string
  companySlug: string
  evidence: string
  sourceUrl: string
}

/** Tags whose evidence phrase and URL are actually on the company record. */
export function appliedTechnologyTags(): AppliedTechnology[] {
  const out: AppliedTechnology[] = []
  for (const tag of TECHNOLOGY_TAGS) {
    const company = companies.find((row) => row.slug === tag.companySlug)
    if (!company) continue
    const text = `${company.description} ${company.sources.map((source) => `${source.title} ${source.url}`).join(' ')}`
    if (!text.toLowerCase().includes(tag.evidence.toLowerCase())) continue
    const urlOk = company.url === tag.sourceUrl || company.sources.some((source) => source.url === tag.sourceUrl)
    if (!urlOk) continue
    out.push({
      id: tag.technologyId,
      name: technologyName(tag.technologyId),
      companyName: company.name,
      companySlug: company.slug,
      evidence: tag.evidence,
      sourceUrl: tag.sourceUrl,
    })
  }
  return out
}

export function technologiesForProblem(slug: string): AppliedTechnology[] {
  const slugs = new Set(companies.filter((company) => company.problemSlugs.includes(slug)).map((company) => company.slug))
  return appliedTechnologyTags().filter((tag) => slugs.has(tag.companySlug))
}

export function technologyIdsForProblem(slug: string): TechnologyId[] {
  return [...new Set(technologiesForProblem(slug).map((tag) => tag.id))]
}
