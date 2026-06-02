import type { Sector } from './types'

/**
 * Sectors cluster problems into navigable domains. A problem can belong to
 * multiple sectors (e.g. biosecurity sits in both bio-and-pandemic-risk and
 * ai-and-x-risk). Sectors are user-facing categories; tiers stay as the
 * cause-prioritization label.
 *
 * Inspired by:
 *   - Buildlist's sector taxonomy (robotics, manufacturing, aerospace, energy)
 *   - Our World in Data topic pages (126 topics across population, health, ...)
 *   - Patrick Collison's progress page (dense, linkroll-style further reading)
 */
export const sectors: Sector[] = [
  {
    slug: 'ai-and-x-risk',
    name: 'AI & x-risk',
    tagline: 'Make the transition to transformative AI survivable.',
    description:
      'Frontier AI is the one x-risk currently accelerating rather than slowing. The work is technical (interpretability, evals, corrigibility, sandboxed deployment) and institutional (governance, verification, international coordination). Aligned and corrigible AI unlocks most other quests on the leaderboard; misaligned AI forecloses them.',
    leadVoice: {
      name: '80,000 Hours · AI problem profile',
      url: 'https://80000hours.org/problem-profiles/artificial-intelligence/',
    },
    accent: 'rose',
    furtherReading: [
      { title: 'AI problem profile', url: 'https://80000hours.org/problem-profiles/artificial-intelligence/', by: '80,000 Hours' },
      { title: 'Conjecture Institute', url: 'https://www.conjectureinstitute.com' },
      { title: 'Anthropic — core views on AI safety', url: 'https://www.anthropic.com/news/core-views-on-ai-safety' },
    ],
  },
  {
    slug: 'bio-and-pandemic-risk',
    name: 'Bio & pandemic risk',
    tagline: 'Prevent engineered and natural pandemics from ending civilization.',
    description:
      'COVID-19 demonstrated the tail risk from a single pathogen; cheap gene synthesis raises the ceiling. The tractable agenda is pathogen-agnostic detection, broad-spectrum countermeasures, far-UVC sterilization, rapid-vaccine platforms, and global stockpiles capable of reaching every human in weeks.',
    leadVoice: {
      name: '80,000 Hours · biosecurity profile',
      url: 'https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/',
    },
    accent: 'rose',
    furtherReading: [
      { title: 'Preventing catastrophic pandemics', url: 'https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/', by: '80,000 Hours' },
      { title: 'NTI biosecurity programs', url: 'https://www.nti.org/area/biological/' },
    ],
  },
  {
    slug: 'energy-and-abundance',
    name: 'Energy & abundance',
    tagline: 'Drive the energy cost curve toward physics, not politics.',
    description:
      "Cheap, clean, abundant energy is upstream of nearly every other quest — desalination, vertical farming, computation, transportation, and habitable climate all bottleneck on it. The frontier spans the full stack: solar + storage, advanced fission, fusion, transmission, and the grid software to make it dispatchable. Stephens' Founders Fund framing of 'good quests' anchors the e/acc lens here.",
    leadVoice: {
      name: 'Founders Fund · Choose Good Quests',
      url: 'https://foundersfund.com/2023/06/choose-good-quests/',
    },
    accent: 'amber',
    furtherReading: [
      { title: 'Choose Good Quests', url: 'https://foundersfund.com/2023/06/choose-good-quests/', by: 'Trae Stephens · Founders Fund' },
      { title: 'IEA Net Zero by 2050', url: 'https://www.iea.org/reports/net-zero-by-2050' },
      { title: 'Construction Physics', url: 'https://www.construction-physics.com' },
    ],
  },
  {
    slug: 'shelter-and-construction',
    name: 'Shelter & construction',
    tagline: 'Industrialize what we put roofs over our heads with.',
    description:
      'Construction productivity has been flat for fifty years while every other manufactured good has gotten an order of magnitude cheaper. Zoning, permitting, and the fragmented supply chain are the bottlenecks. Factory-built housing, modular construction, and reform of land-use law would re-couple shelter cost to physics.',
    accent: 'indigo',
    furtherReading: [
      { title: 'McKinsey · Reinventing construction', url: 'https://www.mckinsey.com/business-functions/operations/our-insights/reinventing-construction-through-a-productivity-revolution' },
      { title: 'Works in Progress — housing essays', url: 'https://worksinprogress.co' },
    ],
  },
  {
    slug: 'education-and-pedagogy',
    name: 'Education & pedagogy',
    tagline: '1:1 tutoring at marginal-cost-zero, for every child on earth.',
    description:
      "Bloom's two-sigma problem has stood since 1984: students taught one-to-one outperform classroom peers by two standard deviations, but tutoring at scale was unaffordable. LLM tutors can finally close the gap. The remaining work is curriculum, evaluation, deployment to schools, and managing the transition for teachers.",
    accent: 'cyan',
    furtherReading: [
      { title: "Bloom · The 2-Sigma Problem", url: 'https://web.mit.edu/5.95/readings/bloom-two-sigma.pdf', by: 'Benjamin Bloom · 1984' },
      { title: 'Khan Academy · Khanmigo', url: 'https://www.khanmigo.ai/' },
    ],
  },
  {
    slug: 'physical-health-and-disease',
    name: 'Physical health & disease',
    tagline: 'Eliminate the infectious diseases we already know how to beat.',
    description:
      'Malaria, TB, and HIV still kill millions every year despite proven interventions. The bottleneck is coverage and delivery, not science. Pair that with the next-gen agenda — broad-spectrum antivirals, CRISPR therapeutics, mRNA platforms — and the floor for civilizational health rises a full order of magnitude.',
    accent: 'green',
    furtherReading: [
      { title: 'Global Fund', url: 'https://www.theglobalfund.org/' },
      { title: 'Gavi — the Vaccine Alliance', url: 'https://www.gavi.org/' },
      { title: 'GiveWell top charities', url: 'https://www.givewell.org/charities/top-charities' },
    ],
  },
  {
    slug: 'science-and-progress',
    name: 'Science & progress',
    tagline: 'Make research productivity compound instead of decay.',
    description:
      "Bloom, Jones, Van Reenen and others have shown ideas are getting harder to find: per-researcher productivity has declined across nearly every domain. The agenda is institutional — focused research orgs (FROs), better grantmaking, replication infrastructure, AI-for-science tooling, and the dense citation/community fabric Collison and Cowen have been calling for since 2019.",
    leadVoice: {
      name: 'Patrick Collison · Progress',
      url: 'https://patrickcollison.com/progress',
    },
    accent: 'amber',
    furtherReading: [
      { title: 'We Need a New Science of Progress', url: 'https://www.theatlantic.com/science/archive/2019/07/we-need-new-science-progress/594946/', by: 'Collison & Cowen · The Atlantic' },
      { title: 'Progress page', url: 'https://patrickcollison.com/progress', by: 'Patrick Collison' },
      { title: 'Are Ideas Getting Harder to Find?', url: 'https://web.stanford.edu/~chadj/IdeaPF.pdf', by: 'Bloom, Jones, Van Reenen, Webb · 2020' },
      { title: 'Roots of Progress', url: 'https://rootsofprogress.org' },
    ],
  },
  {
    slug: 'aging-and-longevity',
    name: 'Aging & longevity',
    tagline: 'Treat aging as the disease that drives every other disease.',
    description:
      "Most chronic disease — cancer, cardiovascular, Alzheimer's — has aging as its dominant risk factor. Targeting aging upstream (senolytics, rapamycin analogues, partial reprogramming, NAD+ restoration) compounds across every downstream condition. The frontier is regulatory as much as scientific: FDA does not yet treat 'aging' as an indication.",
    accent: 'violet',
    furtherReading: [
      { title: 'Hallmarks of Aging (2023 update)', url: 'https://www.cell.com/cell/fulltext/S0092-8674(22)01377-0' },
      { title: 'Hevolution Foundation', url: 'https://hevolution.com/' },
    ],
  },
  {
    slug: 'demographics-and-society',
    name: 'Demographics & society',
    tagline: 'Stop the collapse of family formation before it compounds.',
    description:
      'Total fertility rates have fallen below replacement in nearly every developed economy and most of the rest of the world. Once the trend sets in it compounds — fewer children means fewer future parents. The agenda spans childcare infrastructure, housing affordability, family-formation incentives, and reproductive technology to make the choice tractable.',
    accent: 'cyan',
    furtherReading: [
      { title: 'Our World in Data · fertility', url: 'https://ourworldindata.org/fertility-rate' },
      { title: 'More Births · Pronatalism', url: 'https://morebirths.com' },
    ],
  },
  {
    slug: 'mental-health',
    name: 'Mental health',
    tagline: 'Rebuild the social fabric and the third spaces it lived in.',
    description:
      'Loneliness, anxiety, and depression are at multi-decade highs across cohorts. Therapy and app-based interventions show modest effects; the deeper agenda is structural — third spaces, civic infrastructure, and a rebalancing of digital toward physical interaction. Hard to measure, harder to manufacture, but possibly upstream of everything from fertility to political polarization.',
    accent: 'violet',
    furtherReading: [
      { title: 'Our Epidemic of Loneliness', url: 'https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf', by: 'U.S. Surgeon General · 2023' },
      { title: 'Bowling Alone', url: 'https://en.wikipedia.org/wiki/Bowling_Alone', by: 'Robert Putnam · 2000' },
    ],
  },
]

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug)
}

/** Tag map: problem slug → list of sector slugs. Defined here so problems.ts
 *  doesn't have to know about sectors. Single source of truth. */
export const PROBLEM_TO_SECTORS: Record<string, string[]> = {
  'ai-safety': ['ai-and-x-risk'],
  'biosecurity': ['bio-and-pandemic-risk', 'ai-and-x-risk'],
  'energy-abundance': ['energy-and-abundance'],
  'housing-construction': ['shelter-and-construction'],
  'pedagogy': ['education-and-pedagogy'],
  'infectious-disease': ['physical-health-and-disease'],
  'scientific-productivity': ['science-and-progress'],
  'longevity': ['aging-and-longevity', 'physical-health-and-disease'],
  'fertility-decline': ['demographics-and-society'],
  'loneliness': ['mental-health', 'demographics-and-society'],
}

export function getSectorsForProblem(problemSlug: string): string[] {
  return PROBLEM_TO_SECTORS[problemSlug] ?? []
}
