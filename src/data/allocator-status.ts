/**
 * Allocator operational status — the fields a founder actually needs and that
 * a static file goes stale on fastest: cheque size, whether applications are
 * open right now, the deadline, what the application physically consists of,
 * and who is eligible.
 *
 * Seeded 2026-07-20 from each funder's own page via live research. The Exa
 * sourcer (lib/sources/exa.ts → sourceAllocatorProfiles, exercised by
 * /api/cron/refresh-allocators) refreshes these automatically once
 * EXA_API_KEY and CRON_SECRET are wired.
 *
 * Honesty rules: `asOf` on every row, `sourceUrl` pointing at the funder's own
 * page, and `status` reflecting what that page said on that date — not what we
 * wish were true. A closed programme is recorded as closed.
 */

export type ApplicationStatus = 'open' | 'closed' | 'not-yet-open' | 'rolling'

export type AllocatorStatus = {
  /** Matches a slug in data/ecosystem.ts. */
  slug: string
  status: ApplicationStatus
  /** Human-readable cheque size, exactly as the funder states it. */
  chequeSize: string
  /** What the application physically is. The friction, stated plainly. */
  applicationIs: string
  /** Typical time to hear back. */
  responseTime: string | null
  /** Hard eligibility gates. The reason most applications are wasted. */
  eligibility: string
  deadline: string | null
  applyUrl: string | null
  sourceUrl: string
  asOf: string
  /** Editorial note on fit — why this is or is not worth the effort. */
  note?: string
}

const ASOF = '2026-07-20'

export const allocatorStatus: AllocatorStatus[] = [
  {
    slug: '1517-medici',
    status: 'rolling',
    chequeSize: 'Minimum $1,000, no strings, no equity, no IP claim (paid by Venmo)',
    applicationIs: 'A ~5 minute Loom video emailed to any partner at firstname@1517fund.com',
    responseTime: '~2 weeks',
    eligibility:
      'High-school or college students, dropouts, and deep-tech scientists. Project must be a passion project, explicitly NOT for school credit. North America only.',
    deadline: null,
    applyUrl: 'https://www.1517fund.com/medici',
    sourceUrl: 'https://www.1517fund.com/medici',
    asOf: ASOF,
    note: 'The lowest-friction money on the board: a video, not an essay. Founded by the Thiel Fellowship cofounders; earlier $100k versions backed Vitalik Buterin, Dylan Field, Laura Deming. Getting on 1517 radar is worth more than the $1k.',
  },
  {
    slug: 'emergent-ventures',
    status: 'rolling',
    chequeSize: 'No typical range — "funding is project specific", from very small to large',
    applicationIs:
      'A proposal of 1,500 words max that must stand alone. Three parts: your personal story, one consensus view you agree with, and the idea. No PDFs accepted.',
    responseTime: '~1 week',
    eligibility: 'Age 13+, anywhere in the world. Credentials explicitly do not matter.',
    deadline: null,
    applyUrl: 'https://mercatus.tfaforms.net/5099527',
    sourceUrl: 'https://www.mercatus.org/emergent-ventures',
    asOf: ASOF,
    note: 'Has a dedicated Progress Studies tranche. Reporting burden is a 1-2 page note a year later. The best-fit open programme for a legibility/progress project.',
  },
  {
    slug: 'oshaughnessy-fellowships',
    status: 'closed',
    chequeSize: '$100,000 over one year, and you keep 100% ownership',
    applicationIs: 'Online application via osv.llc/fellowships',
    responseTime: null,
    eligibility: '"Researchers, builders and creatives advancing civilization"',
    deadline: 'Cycle closed 2026-04-30; watch for the next cohort',
    applyUrl: 'https://www.osv.llc/fellowships',
    sourceUrl: 'https://www.osv.llc/fellowships',
    asOf: ASOF,
    note: 'Past awardees include a musician recording viral music and a documentarian filming the future of humanity. The only programme that funds art, research, and building as one thing.',
  },
  {
    slug: '776-fellowship',
    status: 'not-yet-open',
    chequeSize: 'Up to $100,000 over two years',
    applicationIs: 'Application opens per cohort; email waitlist in the meantime',
    responseTime: null,
    eligibility:
      'Ages 18-24, anywhere in the world. Must skip or stop out of university to work full time. Climate-focused.',
    deadline: '2026 cohort not yet announced',
    applyUrl: 'https://www.776.org',
    sourceUrl: 'https://www.776.org',
    asOf: ASOF,
    note: 'Hard age ceiling at 24, so this expires soon for most applicants. Only a fit through an energy or climate framing.',
  },
  {
    slug: 'thiel-fellowship',
    status: 'rolling',
    chequeSize: '$250,000 over two years',
    applicationIs: 'Online application',
    responseTime: null,
    eligibility:
      'Young people who skip or stop out of college. Historically aimed at 22-and-under — confirm the current age ceiling before investing effort.',
    deadline: null,
    applyUrl: 'https://thielfellowship.org',
    sourceUrl: 'https://thielfellowship.org',
    asOf: ASOF,
    note: 'Largest cheque on the board. The age gate is the thing to verify first, by direct email, before writing anything.',
  },
]

/** Status for one allocator, or null when we have not researched it yet. */
export function getAllocatorStatus(slug: string): AllocatorStatus | null {
  return allocatorStatus.find((a) => a.slug === slug) ?? null
}

/** Everything a founder could apply to today, hardest deadline first. */
export function openNow(): AllocatorStatus[] {
  return allocatorStatus.filter((a) => a.status === 'open' || a.status === 'rolling')
}
