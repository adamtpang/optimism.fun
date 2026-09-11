/**
 * The burden layer: why people actually die, with counts, mapped onto the
 * problems this index ranks.
 *
 * This is the site's own GBD cross-check made numeric. /coverage already asks
 * whether the index touches the top causes of death; this file says how many
 * deaths sit behind each answer, and which killers have no problem on the index
 * at all. It feeds the demand model's burden signal (lib/burden.ts) and renders
 * on problem pages. It does not create routes.
 *
 * Honesty rules, because mortality data is easy to inflate:
 *  - Counts are the latest complete WHO Global Health Estimates (2021, 68M
 *    deaths). Where WHO's public summary gives a rank but no count, the count is
 *    null and stays null. Nothing is interpolated.
 *  - GBD 2023 (published October 2025) supplies the newer rank order. It is
 *    recorded separately and never blended into the 2021 counts.
 *  - `problemSlugs` says "this problem addresses this cause", not "this problem
 *    would prevent these deaths". Two problems can share a cause. Sums across
 *    problems therefore overlap, and every display says so.
 *  - Aggregates (all cancers, all cardiovascular) are recorded for display and
 *    excluded from every sum, so a member cause is never counted twice.
 *  - An empty `problemSlugs` is a finding, not a formatting gap: it is a top
 *    killer with no problem on the index. Cancer is the largest of these.
 */
import type { Confidence } from './types'

export type MortalityCause = {
  slug: string
  name: string
  deaths: {
    /** Annual deaths. Null when the source gives a rank but no count. */
    value: number | null
    year: number
    /** Share of all deaths that year, when the source states it. */
    shareOfDeaths?: number
    source: string
    sourceUrl: string
    confidence: Confidence
    asOf: string
  }
  /** Rank in WHO's 2021 top-10 list, when present. */
  whoRank2021?: number
  /** Rank in IHME's GBD 2023 list, when the public release states it. */
  gbdRank2023?: number
  /** Plain-English trend, quoting the source's own framing. */
  trend: string
  /** Why it happens: the causal chain in two sentences. */
  mechanism: string
  /** Problems on the index that address this cause. Empty means a coverage gap. */
  problemSlugs: string[]
  /** How the mapping should be read, for the honest footnote on the page. */
  mappingNote?: string
  /** A roll-up whose members are listed separately. Excluded from all sums. */
  aggregate?: boolean
  members?: string[]
}

const WHO_GHE = {
  source: 'WHO Global Health Estimates 2021, top 10 causes of death',
  sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/the-top-10-causes-of-death',
  asOf: '2026-09-11',
}

const GBD_2023 = {
  source: 'IHME Global Burden of Disease 2023, causes of death capstone (The Lancet, October 2025)',
  sourceUrl: 'https://www.healthdata.org/news-events/newsroom/news-releases/report-cardiovascular-diseases-caused-1-3-global-deaths-2023',
  asOf: '2026-09-11',
}

const GLOBOCAN = {
  source: 'IARC GLOBOCAN 2022, global cancer statistics',
  sourceUrl: 'https://www.uicc.org/news-and-updates/news/globocan-2022-latest-global-cancer-data-shows-rising-incidence-and-stark',
  asOf: '2026-09-11',
}

export const mortalityCauses: MortalityCause[] = [
  {
    slug: 'ischaemic-heart-disease',
    name: 'Ischaemic heart disease',
    deaths: { value: 9_100_000, year: 2021, shareOfDeaths: 0.13, confidence: 'high', ...WHO_GHE },
    whoRank2021: 1,
    gbdRank2023: 1,
    trend: 'Rising: up 2.7 million deaths a year since 2000 (WHO).',
    mechanism:
      'LDL-driven plaque narrows the coronary arteries over decades. A plaque ruptures, a clot forms, and heart muscle downstream dies. Blood pressure, cholesterol, smoking, diabetes and age drive it.',
    problemSlugs: ['hypertension', 'longevity'],
    mappingNote:
      'High blood pressure is the leading modifiable risk for ischaemic heart disease and age is the largest non-modifiable one, so both problems address it. The deaths are counted under each, not split.',
  },
  {
    slug: 'covid-19',
    name: 'COVID-19',
    deaths: { value: 8_800_000, year: 2021, confidence: 'high', ...WHO_GHE },
    whoRank2021: 2,
    gbdRank2023: 20,
    trend: 'Newly emerged in 2020. Second cause of death in 2021, twentieth by 2023 (GBD).',
    mechanism:
      'A novel respiratory virus met a population with no prior immunity. Severe disease came from lung injury and systemic inflammation, concentrated in the old and those with chronic conditions.',
    problemSlugs: ['biosecurity'],
    mappingNote: 'The single largest recent demonstration of what pandemic preparedness is for.',
  },
  {
    slug: 'stroke',
    name: 'Stroke',
    deaths: { value: 6_800_000, year: 2021, shareOfDeaths: 0.10, confidence: 'high', ...WHO_GHE },
    whoRank2021: 3,
    gbdRank2023: 2,
    trend: 'Fell from second to third in the WHO ranking between 2019 and 2021, displaced by COVID-19; second in GBD 2023.',
    mechanism:
      'A clot blocks an artery in the brain, or a vessel bursts. High blood pressure is the dominant driver of both forms, and the tissue starved of blood dies within minutes.',
    problemSlugs: ['hypertension', 'longevity'],
    mappingNote: 'Counted under both hypertension and longevity, not split.',
  },
  {
    slug: 'copd',
    name: 'Chronic obstructive pulmonary disease',
    deaths: { value: 3_400_000, year: 2021, shareOfDeaths: 0.05, confidence: 'high', ...WHO_GHE },
    whoRank2021: 4,
    gbdRank2023: 3,
    trend: 'Fell from third to fourth in the WHO ranking between 2019 and 2021; third in GBD 2023.',
    mechanism:
      'Inhaled irritants, above all tobacco smoke and household biomass smoke, inflame and destroy the airways and alveoli over decades until the lungs can no longer move enough air.',
    problemSlugs: [],
    mappingNote: 'No problem on the index addresses tobacco or household air pollution. This is a coverage gap.',
  },
  {
    slug: 'lower-respiratory-infections',
    name: 'Lower respiratory infections',
    deaths: { value: 2_500_000, year: 2021, confidence: 'high', ...WHO_GHE },
    whoRank2021: 5,
    gbdRank2023: 4,
    trend: 'Falling: down 370,000 deaths a year since 2000 (WHO).',
    mechanism:
      'Pneumonia from bacteria and viruses, mostly in the very young, the old and the immunocompromised. The deaths concentrate where vaccines, oxygen and antibiotics are scarce.',
    problemSlugs: ['infectious-disease'],
    mappingNote:
      'Partial. The infectious-disease problem names malaria, TB and HIV; pneumonia, the largest infectious killer of children, is not named there yet.',
  },
  {
    slug: 'lung-cancers',
    name: 'Trachea, bronchus and lung cancers',
    deaths: { value: 1_900_000, year: 2021, confidence: 'high', ...WHO_GHE },
    whoRank2021: 6,
    trend: 'Rising: up 0.7 million deaths a year since 2000 (WHO).',
    mechanism:
      'Carcinogens, overwhelmingly from tobacco, accumulate mutations in airway cells until growth control fails. Symptoms arrive late, so most cases are found after spread.',
    problemSlugs: ['cancer'],
    mappingNote: 'The largest single cancer killer. Counted under the cancer problem; the all-cancers aggregate below is shown for scale and not summed.',
  },
  {
    slug: 'alzheimers-dementias',
    name: "Alzheimer's disease and other dementias",
    deaths: { value: 1_800_000, year: 2021, confidence: 'high', ...WHO_GHE },
    whoRank2021: 7,
    trend: 'Rising. Entered the top 10 as populations age.',
    mechanism:
      'Progressive neurodegeneration with amyloid plaques and tau tangles. The largest risk factor by far is age itself, which is why deaths rise as populations get older.',
    problemSlugs: ['longevity'],
  },
  {
    slug: 'diabetes',
    name: 'Diabetes',
    deaths: { value: null, year: 2021, confidence: 'med', ...WHO_GHE },
    whoRank2021: 8,
    trend: 'Rising: deaths up 95 percent between 2000 and 2021 (WHO). Count not stated in the public summary.',
    mechanism:
      'Insulin resistance or failing insulin production leaves glucose chronically high, which damages blood vessels, nerves and kidneys. The rise tracks obesity.',
    problemSlugs: [],
    mappingNote: 'No metabolic-disease problem exists on the index. This is a coverage gap.',
  },
  {
    slug: 'kidney-diseases',
    name: 'Kidney diseases',
    deaths: { value: null, year: 2021, confidence: 'med', ...WHO_GHE },
    whoRank2021: 9,
    trend: 'Rising: from nineteenth cause in 2000 to ninth in 2021, deaths up 95 percent (WHO). Count not stated.',
    mechanism:
      'Mostly downstream of diabetes and hypertension, which destroy the kidney filters. Survival then depends on access to dialysis or transplant.',
    problemSlugs: ['hypertension'],
    mappingNote: 'Partial. Hypertension is one of the two main upstream causes; diabetes, the other, has no problem on the index.',
  },
  {
    slug: 'tuberculosis',
    name: 'Tuberculosis',
    deaths: { value: null, year: 2021, confidence: 'med', ...WHO_GHE },
    whoRank2021: 10,
    trend: 'Tenth in the WHO 2021 ranking. Count not stated in the public summary.',
    mechanism:
      'A bacterial infection that stays latent in most people and reactivates when immunity weakens, through HIV, malnutrition or age. Drug resistance is growing.',
    problemSlugs: ['infectious-disease'],
  },
  {
    slug: 'neonatal-disorders',
    name: 'Neonatal disorders',
    deaths: { value: null, year: 2023, confidence: 'med', ...GBD_2023 },
    gbdRank2023: 5,
    trend: 'Fifth cause of death globally in GBD 2023. Count not stated in the public release.',
    mechanism:
      'Preterm birth complications, birth asphyxia and neonatal sepsis, almost entirely in the first month of life and almost entirely where skilled care and basic equipment are absent.',
    problemSlugs: ['newborn-survival'],
  },
  {
    slug: 'cancers-all-sites',
    name: 'Cancers, all sites',
    deaths: { value: 9_700_000, year: 2022, confidence: 'high', ...GLOBOCAN },
    trend:
      'Second cause of death worldwide as a group. Lung is the largest share at 1.8 million (18.7 percent), then colorectal, liver, breast and stomach.',
    mechanism:
      'Accumulated DNA damage lets a cell escape growth control. Hundreds of distinct diseases with different causes: tobacco, infections, alcohol, obesity, radiation, and above all the years lived, since mutations accumulate with age.',
    problemSlugs: ['cancer'],
    mappingNote:
      'Mapped to the cancer problem, added 2026-09-11 after this row exposed it as the largest gap on the index by deaths. Aggregate, excluded from sums; lung cancers are listed separately above and are the only member with a WHO count.',
    aggregate: true,
    members: ['lung-cancers'],
  },
  {
    slug: 'cardiovascular-all',
    name: 'Cardiovascular diseases, all',
    deaths: { value: 19_200_000, year: 2023, confidence: 'high', ...GBD_2023 },
    trend: 'One in three deaths worldwide in 2023, up from 13.1 million in 1990 (GBD).',
    mechanism:
      'Ischaemic heart disease and stroke are the bulk of it, both driven by blood pressure, lipids, smoking, diabetes and age.',
    problemSlugs: ['hypertension'],
    mappingNote: 'Aggregate, excluded from sums. Its two largest members are listed separately.',
    aggregate: true,
    members: ['ischaemic-heart-disease', 'stroke'],
  },
]

export const getMortalityCause = (slug: string): MortalityCause | undefined =>
  mortalityCauses.find((c) => c.slug === slug)
