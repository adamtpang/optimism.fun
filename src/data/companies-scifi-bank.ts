/**
 * Companies named on a page opened for the five new problems.
 * Market cap and valuation are null. No figure was estimated.
 */
import type { Company } from './types'

const AS_OF = '2026-11-20'

export const sciFiBankCompanies: Company[] = [
  {
    slug: 'until-labs',
    name: 'Until',
    url: 'https://www.untillabs.com/roadmap',
    problemSlugs: ['organ-banking'],
    marketCap: null,
    valuation: null,
    stage: 'private',
    country: 'USA',
    description:
      'Developing reversible cryopreservation for human organs. Its 12 May 2026 note says the Mark 1 rewarmed a vitrified pig kidney. No valuation is stored.',
    sources: [{ title: 'Until, Rewarming, 12 May 2026', url: 'https://www.untillabs.com/blog/rewarming' }],
    asOf: AS_OF,
  },
  {
    slug: 'egenesis',
    name: 'eGenesis',
    url: 'https://egenesisbio.com/news-media/press-releases/egenesis-announces-clinical-update-in-ongoing-expanded-access-study-of-egen-2784-in-patients-with-kidney-failure',
    problemSlugs: ['organ-shortage'],
    marketCap: null,
    valuation: null,
    stage: 'private',
    country: 'USA',
    description:
      'Genetically engineered pig kidneys. The 3 September 2026 update says five patients received EGEN-2784 under expanded access. No valuation is stored.',
    sources: [
      {
        title: 'eGenesis clinical update, 3 September 2026',
        url: 'https://egenesisbio.com/news-media/press-releases/egenesis-announces-clinical-update-in-ongoing-expanded-access-study-of-egen-2784-in-patients-with-kidney-failure',
      },
    ],
    asOf: AS_OF,
  },
  {
    slug: 'neuralink',
    name: 'Neuralink',
    url: 'https://www.uclh.nhs.uk/news/seven-gb-prime-patients-now-participating-neuralink-trial',
    problemSlugs: ['brain-computer-interface'],
    marketCap: null,
    valuation: null,
    stage: 'private',
    country: 'USA',
    description:
      'Intracortical implant. UCLH says seven patients received one between October and December 2025. No valuation is stored.',
    sources: [
      {
        title: 'UCLH, seven GB-PRIME patients, 29 January 2026',
        url: 'https://www.uclh.nhs.uk/news/seven-gb-prime-patients-now-participating-neuralink-trial',
      },
    ],
    asOf: AS_OF,
  },
  {
    slug: 'synchron',
    name: 'Synchron',
    url: 'https://clinicaltrials.gov/study/NCT07533903',
    problemSlugs: ['brain-computer-interface'],
    marketCap: null,
    valuation: null,
    stage: 'private',
    country: 'USA',
    description:
      'Endovascular Stentrode. ClinicalTrials.gov lists FOCUS-AUS (NCT07533903) as active, not recruiting. No valuation is stored.',
    sources: [{ title: 'ClinicalTrials.gov NCT07533903', url: 'https://clinicaltrials.gov/study/NCT07533903' }],
    asOf: AS_OF,
  },
  {
    slug: 'doctronic',
    name: 'Doctronic',
    url: 'https://commerce.utah.gov/ai/regulatory-relief-4/authorized-pilots/doctronic/',
    problemSlugs: ['ai-clinical-care'],
    marketCap: null,
    valuation: null,
    stage: 'private',
    country: 'USA',
    description:
      'Utah pilot for renewing medicines a clinician already prescribed. Phase 1 still requires a physician to authorize each renewal. No valuation is stored.',
    sources: [
      {
        title: 'Utah Office of Artificial Intelligence Policy, Doctronic agreement',
        url: 'https://commerce.utah.gov/ai/regulatory-relief-4/authorized-pilots/doctronic/',
      },
    ],
    asOf: AS_OF,
  },
  {
    slug: 'vitara-biomedical',
    name: 'Vitara Biomedical',
    url: 'https://www.vitara.com/',
    problemSlugs: ['artificial-womb'],
    marketCap: null,
    valuation: null,
    stage: 'private',
    country: 'USA',
    description:
      'Describes EXTEND, a fluid-filled system for newborns delivered as early as 22 weeks. The page does not report a human birth. No valuation is stored.',
    sources: [{ title: 'Vitara Biomedical', url: 'https://www.vitara.com/' }],
    asOf: AS_OF,
  },
]
