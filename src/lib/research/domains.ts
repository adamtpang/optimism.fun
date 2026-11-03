/**
 * The only exclude and priority lists for the research demo.
 * Add a known predatory publisher hostname to PREDATORY_PUBLISHER_DOMAINS.
 * It is merged into the Exa excludeDomains list and blocked again in code.
 */

export const PEER_REVIEWED_DOMAINS = [
  'nature.com',
  'science.org',
  'cell.com',
  'thelancet.com',
  'nejm.org',
  'jamanetwork.com',
  'bmj.com',
  'pnas.org',
  'plos.org',
  'elifesciences.org',
  'link.springer.com',
  'sciencedirect.com',
  'onlinelibrary.wiley.com',
  'academic.oup.com',
] as const

export const INDEX_DOMAINS = [
  'pubmed.ncbi.nlm.nih.gov',
  'pmc.ncbi.nlm.nih.gov',
  'europepmc.org',
] as const

export const PREPRINT_DOMAINS = ['arxiv.org', 'biorxiv.org', 'medrxiv.org', 'ssrn.com'] as const

export const TRIAL_DOMAINS = ['clinicaltrials.gov', 'who.int'] as const

/** Publisher mirrors. Resolve them to a DOI, PMID, or arXiv id, or drop them. */
export const MIRROR_DOMAINS = ['springermedizin.de', 'malariaworld.org', 'medscape.com'] as const

/**
 * News and press-release hosts. They may be shown as Coverage links.
 * They are never evidence. Press-release aggregators the research lead
 * named for hard exclusion live in EXCLUDED_HOSTS instead.
 */
export const COVERAGE_DOMAINS = [
  'reuters.com',
  'apnews.com',
  'bbc.com',
  'bbc.co.uk',
  'nytimes.com',
  'theguardian.com',
  'washingtonpost.com',
  'statnews.com',
  'scientificamerican.com',
  'newscientist.com',
  'technologyreview.com',
  'wired.com',
  'arstechnica.com',
  'bloomberg.com',
  'ft.com',
  'economist.com',
  'cnn.com',
  'forbes.com',
  'prnewswire.com',
  'businesswire.com',
  'globenewswire.com',
  'news.google.com',
  'sciencenews.org',
  'livescience.com',
  'medicalnewstoday.com',
  'healthday.com',
  'theconversation.com',
] as const

/** Append known predatory publisher hostnames here. */
export const PREDATORY_PUBLISHER_DOMAINS: string[] = []

const EXCLUDED_HOSTS = [
  'researchgate.net',
  'academia.edu',
  'sciencedaily.com',
  'phys.org',
  'eurekalert.org',
  'medium.com',
  'wikipedia.org',
  'scholar.google.com',
  'scholar.googleusercontent.com',
  'sci-hub.se',
  'sci-hub.st',
  'sci-hub.ru',
  'sci-hub.box',
  'sci-hub.red',
  'sci-hub.al',
  'sci-hub.ee',
  'sci-hub.wf',
  'sci-hub.ren',
  'sci-hub.shop',
  'sci-hub.vg',
  'libgen.rs',
  'libgen.is',
  'libgen.li',
  'libgen.st',
  'libgen.gs',
  'libgen.vg',
  'libgen.lc',
  'libgen.fun',
  'libgen.rocks',
  'library.lol',
]

export function excludeDomains(): string[] {
  return [...new Set([...EXCLUDED_HOSTS, ...PREDATORY_PUBLISHER_DOMAINS])]
}

export function hostOf(raw: string): string | null {
  try {
    return new URL(raw).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}

export function matchesDomain(host: string, domain: string): boolean {
  const h = host.toLowerCase().replace(/^www\./, '')
  const d = domain.toLowerCase().replace(/^\*\./, '')
  return h === d || h.endsWith(`.${d}`)
}

function hostMatchesList(host: string, domains: readonly string[]): boolean {
  return domains.some((domain) => matchesDomain(host, domain))
}

export function isExcludedUrl(raw: string): boolean {
  const host = hostOf(raw)
  if (!host) return true
  if (hostMatchesList(host, excludeDomains())) return true
  if (host.includes('sci-hub')) return true
  if (host.includes('libgen')) return true
  if (host === 'scholar.google.com' || host.startsWith('scholar.google.')) return true
  if (host === 'wikipedia.org' || host.endsWith('.wikipedia.org')) return true
  if (host === 'medium.com' || host.endsWith('.medium.com')) return true
  return false
}

function pathIsCoverage(raw: string): boolean {
  try {
    const path = new URL(raw).pathname.toLowerCase()
    return /\/(news|press|press-release|pressreleases|media-release)(\/|$)/.test(path)
  } catch {
    return false
  }
}

export function isCoverageUrl(raw: string): boolean {
  if (isExcludedUrl(raw)) return false
  if (pathIsCoverage(raw)) return true
  const host = hostOf(raw)
  if (!host) return false
  return hostMatchesList(host, COVERAGE_DOMAINS)
}

export type PriorityBand = 0 | 1 | 2 | 3 | 4

export function priorityBand(raw: string): PriorityBand {
  const host = hostOf(raw)
  if (!host) return 4
  if (hostMatchesList(host, PEER_REVIEWED_DOMAINS)) return 0
  if (hostMatchesList(host, INDEX_DOMAINS)) return 1
  if (hostMatchesList(host, PREPRINT_DOMAINS)) return 2
  if (hostMatchesList(host, TRIAL_DOMAINS)) return 3
  return 4
}

export function isPreprintUrl(raw: string): boolean {
  const host = hostOf(raw)
  return Boolean(host && hostMatchesList(host, PREPRINT_DOMAINS))
}

export function isPeerReviewedUrl(raw: string): boolean {
  const host = hostOf(raw)
  return Boolean(host && hostMatchesList(host, PEER_REVIEWED_DOMAINS))
}

export function isMirrorUrl(raw: string): boolean {
  const host = hostOf(raw)
  return Boolean(host && hostMatchesList(host, MIRROR_DOMAINS))
}

/** Nature news DOIs and Science magazine news pages are not research articles. */
export function isNewsRecord(url: string, doi?: string | null): boolean {
  if (doi && /\/d41586-/i.test(doi)) return true
  if (isCoverageUrl(url)) return true
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '')
    if ((host === 'science.org' || host.endsWith('.science.org')) && parsed.pathname.toLowerCase().includes('/content/article/')) {
      return true
    }
  } catch {
    return false
  }
  return false
}

export function isPerspectiveRecord(url: string, title?: string | null, articleType?: string | null): boolean {
  if (articleType && /perspective/i.test(articleType)) return true
  if (title && /^\s*perspective\b/i.test(title)) return true
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '')
    if ((host === 'nejm.org' || host.endsWith('.nejm.org')) && /perspective/i.test(parsed.pathname)) return true
  } catch {
    return false
  }
  return false
}

export const PRIORITY_QUERY_HINT =
  'Prefer peer-reviewed papers from Nature, Science, Cell, The Lancet, NEJM, JAMA, BMJ, PNAS, PLOS, eLife, Springer, ScienceDirect, Wiley, or Oxford University Press, and records in PubMed, PubMed Central, or Europe PMC. Preprints on arXiv, bioRxiv, medRxiv, and SSRN are in scope when labeled as preprints. Trial records on ClinicalTrials.gov and WHO are in scope.'
