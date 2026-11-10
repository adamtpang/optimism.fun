/**
 * Discoveries: curated findings tagged to ranked problems.
 * "Curated" means an editor added the row. It is not a signed scientific review.
 *
 * Append-only. The page sorts newest first. Schema and the rules for adding
 * a row: research/DISCOVERIES.md.
 *
 * Seed figures come from the 2026-10-28 bounty board. Publish dates and
 * titles were read from Crossref (or arXiv, for the one preprint). Do not
 * invent a figure, a date, or a paper.
 */
import { problems } from './problems'
import { existentialRisks, type ExistentialRisk } from './existential-risks'

export type ReviewStatus = 'peer-reviewed' | 'preprint' | 'trial-result'
export type DiscoveryStatus = 'retracted' | 'challenged'
export type DiscoveryChange = 'scale' | 'neglectedness' | 'tractability'
export type RiskSlug = ExistentialRisk['slug']

export type Discovery = {
  /** Stable id. Never reuse a retired id. */
  id: string
  /** Paper or report title, from the publisher record. */
  title: string
  /** YYYY-MM-DD. Empty string if the date is not in the source and could not be looked up. */
  published: string
  /** YYYY-MM-DD this row was added to the file. */
  added: string
  /** Journal, preprint server, or agency. */
  source: string
  /** DOI without the https://doi.org/ prefix. Omit if there is no DOI. */
  doi?: string
  /** Link to the paper. Required. */
  url: string
  /** Slugs from src/data/problems.ts. May be empty only when riskSlugs is set. */
  problemSlugs: string[]
  /** Slugs from src/data/existential-risks.ts, when the finding bears on an S-tier risk. */
  riskSlugs?: RiskSlug[]
  /** One or two plain sentences. Every number must come from the source. */
  summary: string
  /** Which ranking input this finding moves. */
  changes: DiscoveryChange
  review: ReviewStatus
  /** Set only for a retraction or a published challenge. */
  status?: DiscoveryStatus
  /** Required when status is set. The note states the challenge or retraction. */
  notice?: { note: string; url: string }
}

const ADDED = '2026-10-28'

const doi = (id: string) => `https://doi.org/${id}`

export const discoveries: Discovery[] = [
  {
    id: 'hultgren-crop-calories-2025',
    title: 'Impacts of climate change on global agriculture accounting for adaptation',
    published: '2025-06-18',
    added: ADDED,
    source: 'Nature',
    doi: '10.1038/s41586-025-09085-w',
    url: doi('10.1038/s41586-025-09085-w'),
    problemSlugs: ['climate-change'],
    summary:
      'Global crop calories fall about 120 kcal per person per day for each 1 C of warming. Adaptation offsets only 23% of losses by 2050.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'kestin-ai-tutor-2025',
    title:
      'AI tutoring outperforms in-class active learning: an RCT introducing a novel research-based design in an authentic educational setting',
    published: '2025-06-03',
    added: ADDED,
    source: 'Scientific Reports',
    doi: '10.1038/s41598-025-97652-6',
    url: doi('10.1038/s41598-025-97652-6'),
    problemSlugs: ['pedagogy'],
    summary:
      'In a college RCT, students learned significantly more in less time with a pedagogy-designed AI tutor than in an active-learning class.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'eyting-shingles-dementia-2025',
    title: 'A natural experiment on the effect of herpes zoster vaccination on dementia',
    published: '2025-04-02',
    added: ADDED,
    source: 'Nature',
    doi: '10.1038/s41586-025-08800-x',
    url: doi('10.1038/s41586-025-08800-x'),
    problemSlugs: ['longevity'],
    summary:
      'In a Wales natural experiment, the live-attenuated vaccine Zostavax was associated with 3.5 percentage points fewer new dementia diagnoses over 7 years (95% CI 0.6-7.1), a 20.0% relative reduction (95% CI 6.5-33.4). The regression weights people primarily aged 79 to 80. This is one study’s estimate, not proof the vaccine prevents dementia in every population.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'friedlingstein-carbon-budget-2025',
    title: 'Global Carbon Budget 2024',
    published: '2025-03-14',
    added: ADDED,
    source: 'Earth System Science Data',
    doi: '10.5194/essd-17-965-2025',
    url: doi('10.5194/essd-17-965-2025'),
    problemSlugs: ['climate-change'],
    summary:
      'Fossil CO2 hit 10.1 GtC in 2023. Atmospheric CO2 reached 422.5 ppm in 2024.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'greenblatt-alignment-faking-2024',
    title: 'Alignment faking in large language models',
    published: '2024-12-18',
    added: ADDED,
    source: 'arXiv',
    url: 'https://arxiv.org/abs/2412.14093',
    problemSlugs: [],
    riskSlugs: ['ai-control'],
    summary:
      'A frontier model complied with harmful requests 14% of the time when it believed it was in training. Alignment-faking reasoning rose to 78% after reinforcement learning.',
    changes: 'tractability',
    review: 'preprint',
  },
  {
    id: 'zhou-diabetes-treatment-2024',
    title:
      'Worldwide trends in diabetes prevalence and treatment from 1990 to 2022: a pooled analysis of 1108 population-representative studies with 141 million participants',
    published: '2024-11-01',
    added: ADDED,
    source: 'The Lancet',
    doi: '10.1016/S0140-6736(24)02317-1',
    url: doi('10.1016/S0140-6736(24)02317-1'),
    problemSlugs: ['diabetes'],
    summary:
      '828M adults had diabetes in 2022. Of those aged 30 and older, 445M (59%) were untreated.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'bekker-lenacapavir-2024',
    title: 'Twice-Yearly Lenacapavir or Daily F/TAF for HIV Prevention in Cisgender Women',
    published: '2024-10-03',
    added: ADDED,
    source: 'New England Journal of Medicine',
    doi: '10.1056/NEJMoa2407001',
    url: doi('10.1056/NEJMoa2407001'),
    problemSlugs: ['infectious-disease'],
    summary:
      'A twice-yearly lenacapavir injection produced zero HIV infections among 2,134 young women in PURPOSE 1.',
    changes: 'tractability',
    review: 'trial-result',
  },
  {
    id: 'naghavi-amr-burden-2024',
    title:
      'Global burden of bacterial antimicrobial resistance 1990-2021: a systematic analysis with forecasts to 2050',
    published: '2024-09-01',
    added: ADDED,
    source: 'The Lancet',
    doi: '10.1016/S0140-6736(24)01867-1',
    url: doi('10.1016/S0140-6736(24)01867-1'),
    problemSlugs: ['infectious-disease'],
    summary:
      'Bacterial AMR caused 1.14M attributable deaths in 2021 (4.71M associated), with a forecast of 1.91M attributable deaths in 2050. Better care and antibiotic access could avert 92.0M deaths from 2025 to 2050.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'islami-modifiable-cancer-2024',
    title:
      'Proportion and number of cancer cases and deaths attributable to potentially modifiable risk factors in the United States, 2019',
    published: '2024-07-11',
    added: ADDED,
    source: 'CA: A Cancer Journal for Clinicians',
    doi: '10.3322/caac.21858',
    url: doi('10.3322/caac.21858'),
    problemSlugs: ['cancer'],
    summary:
      'In the US, 40% of cancer cases and 44% of cancer deaths in adults 30 and older are attributable to modifiable risks, led by smoking.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'bengio-extreme-ai-risk-2024',
    title: 'Managing extreme AI risks amid rapid progress',
    published: '2024-05-24',
    added: ADDED,
    source: 'Science',
    doi: '10.1126/science.adn0117',
    url: doi('10.1126/science.adn0117'),
    problemSlugs: [],
    riskSlugs: ['ai-control'],
    summary:
      'Leading researchers call for technical R&D plus adaptive governance to manage extreme AI risks.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'datoo-r21-malaria-2024',
    title:
      'Safety and efficacy of malaria vaccine candidate R21/Matrix-M in African children: a multicentre, double-blind, randomised, phase 3 trial',
    published: '2024-02-01',
    added: ADDED,
    source: 'The Lancet',
    doi: '10.1016/S0140-6736(23)02511-4',
    url: doi('10.1016/S0140-6736(23)02511-4'),
    problemSlugs: ['infectious-disease'],
    summary:
      'R21/Matrix-M showed 75% efficacy at seasonal sites and 68% at standard sites in a phase 3 trial of 4,800+ children.',
    changes: 'tractability',
    review: 'trial-result',
  },
  {
    id: 'weber-mrna-melanoma-2024',
    title:
      'Individualised neoantigen therapy mRNA-4157 (V940) plus pembrolizumab versus pembrolizumab monotherapy in resected melanoma (KEYNOTE-942): a randomised, phase 2b study',
    published: '2024-02-01',
    added: ADDED,
    source: 'The Lancet',
    doi: '10.1016/S0140-6736(23)02268-7',
    url: doi('10.1016/S0140-6736(23)02268-7'),
    problemSlugs: ['cancer'],
    summary:
      'A personalized mRNA vaccine plus pembrolizumab reached 18-month recurrence-free survival of 79% versus 62% in resected melanoma (phase 2b).',
    changes: 'tractability',
    review: 'trial-result',
  },
  {
    id: 'zampaloni-zosurabalpin-2024',
    title: 'A novel antibiotic class targeting the lipopolysaccharide transporter',
    published: '2024-01-03',
    added: ADDED,
    source: 'Nature',
    doi: '10.1038/s41586-023-06873-0',
    url: doi('10.1038/s41586-023-06873-0'),
    problemSlugs: ['infectious-disease'],
    summary:
      'Zosurabalpin is a new class against carbapenem-resistant A. baumannii. No new class against it had reached patients in over 50 years.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'wong-antibiotic-class-2023',
    title: 'Discovery of a structural class of antibiotics with explainable deep learning',
    published: '2023-12-20',
    added: ADDED,
    source: 'Nature',
    doi: '10.1038/s41586-023-06887-8',
    url: doi('10.1038/s41586-023-06887-8'),
    problemSlugs: ['infectious-disease'],
    summary:
      'Explainable deep learning screened 12M compounds and found a new structural class active against MRSA in mice.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'lincoff-select-2023',
    title: 'Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes',
    published: '2023-12-14',
    added: ADDED,
    source: 'New England Journal of Medicine',
    doi: '10.1056/NEJMoa2307563',
    url: doi('10.1056/NEJMoa2307563'),
    problemSlugs: ['hypertension', 'diabetes'],
    summary:
      'Semaglutide cut major cardiovascular events 20% (HR 0.80) in 17,604 people with heart disease and overweight or obesity, but no diabetes.',
    changes: 'tractability',
    review: 'trial-result',
  },
  {
    id: 'moqri-aging-biomarkers-2023',
    title: 'Biomarkers of aging for the identification and evaluation of longevity interventions',
    published: '2023-08-01',
    added: ADDED,
    source: 'Cell',
    doi: '10.1016/j.cell.2023.08.003',
    url: doi('10.1016/j.cell.2023.08.003'),
    problemSlugs: ['longevity'],
    summary:
      'The paper sets out a consensus framework for biomarkers of aging, the missing tool for testing longevity drugs in humans within realistic timeframes.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'wang-loneliness-mortality-2023',
    title:
      'A systematic review and meta-analysis of 90 cohort studies of social isolation, loneliness and mortality',
    published: '2023-06-19',
    added: ADDED,
    source: 'Nature Human Behaviour',
    doi: '10.1038/s41562-023-01617-6',
    url: doi('10.1038/s41562-023-01617-6'),
    problemSlugs: ['loneliness'],
    summary:
      'A meta-analysis of 90 prospective cohort studies, which are observational, found social isolation was associated with a 32% higher all-cause mortality risk and loneliness with a 14% higher risk. Association in cohorts is not proof that isolation or loneliness caused the deaths.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'richterman-cash-mortality-2023',
    title:
      'The effects of cash transfers on adult and child mortality in low- and middle-income countries',
    published: '2023-05-31',
    added: ADDED,
    source: 'Nature',
    doi: '10.1038/s41586-023-06116-2',
    url: doi('10.1038/s41586-023-06116-2'),
    problemSlugs: ['extreme-poverty', 'newborn-survival'],
    summary:
      'Government cash transfer programs were associated with significant drops in mortality among women and children under 5.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'asquith-new-buildings-2023',
    title: 'Local Effects of Large New Apartment Buildings in Low-Income Areas',
    published: '2023-03-01',
    added: ADDED,
    source: 'The Review of Economics and Statistics',
    doi: '10.1162/rest_a_01055',
    url: doi('10.1162/rest_a_01055'),
    problemSlugs: ['housing-construction'],
    summary:
      'New market-rate buildings lowered rents in nearby units by about 6% in low-income areas.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'park-disruptive-science-2023',
    title: 'Papers and patents are becoming less disruptive over time',
    published: '2023-01-04',
    added: ADDED,
    source: 'Nature',
    doi: '10.1038/s41586-022-05543-x',
    url: doi('10.1038/s41586-022-05543-x'),
    problemSlugs: ['scientific-productivity'],
    summary:
      'Across 45M papers and 3.9M patents, work is less likely to break with the past.',
    changes: 'scale',
    review: 'peer-reviewed',
    status: 'challenged',
    notice: {
      note: 'A 2026 Nature comment says dataset artefacts partly drive this.',
      url: doi('10.1038/s41586-026-10787-y'),
    },
  },
  {
    id: 'castellano-polypill-2022',
    title: 'Polypill Strategy in Secondary Cardiovascular Prevention',
    published: '2022-09-15',
    added: ADDED,
    source: 'New England Journal of Medicine',
    doi: '10.1056/NEJMoa2208275',
    url: doi('10.1056/NEJMoa2208275'),
    problemSlugs: ['hypertension'],
    summary:
      'A polypill (aspirin, ramipril, atorvastatin) after a heart attack reduced major events versus usual care (HR 0.76).',
    changes: 'tractability',
    review: 'trial-result',
  },
  {
    id: 'watson-covid-vaccines-2022',
    title:
      'Global impact of the first year of COVID-19 vaccination: a mathematical modelling study',
    published: '2022-09-01',
    added: ADDED,
    source: 'The Lancet Infectious Diseases',
    doi: '10.1016/S1473-3099(22)00320-6',
    url: doi('10.1016/S1473-3099(22)00320-6'),
    problemSlugs: ['biosecurity'],
    riskSlugs: ['engineered-pandemics'],
    summary:
      'COVID-19 vaccines averted an estimated 19.8M deaths in their first year (63% of expected deaths), using excess-mortality data.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'way-energy-transition-2022',
    title: 'Empirically grounded technology forecasts and the energy transition',
    published: '2022-09-01',
    added: ADDED,
    source: 'Joule',
    doi: '10.1016/j.joule.2022.08.009',
    url: doi('10.1016/j.joule.2022.08.009'),
    problemSlugs: ['energy-abundance', 'climate-change'],
    summary:
      'Backtested forecasts across 50+ technologies say a fast green transition likely saves many trillions of dollars, even ignoring climate damages.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'xia-nuclear-famine-2022',
    title:
      'Global food insecurity and famine from reduced crop, marine fishery and livestock production due to climate disruption from nuclear war soot injection',
    published: '2022-08-15',
    added: ADDED,
    source: 'Nature Food',
    doi: '10.1038/s43016-022-00573-0',
    url: doi('10.1038/s43016-022-00573-0'),
    problemSlugs: [],
    riskSlugs: ['nuclear-war'],
    summary:
      'A modeled US-Russia nuclear war could kill 5B+ people through famine. Soot injections above 5 Tg would cause mass food shortages in almost all countries.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'fuller-pollution-deaths-2022',
    title: 'Pollution and health: a progress update',
    published: '2022-06-01',
    added: ADDED,
    source: 'The Lancet Planetary Health',
    doi: '10.1016/S2542-5196(22)00090-0',
    url: doi('10.1016/S2542-5196(22)00090-0'),
    problemSlugs: ['copd'],
    summary:
      'All pollution together still causes about 9M deaths a year (1 in 6). Deaths from modern pollution risks (ambient air and chemical pollution) rose over 66% since 2000.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'eadie-far-uvc-2022',
    title: 'Far-UVC (222 nm) efficiently inactivates an airborne pathogen in a room-sized chamber',
    published: '2022-03-23',
    added: ADDED,
    source: 'Scientific Reports',
    doi: '10.1038/s41598-022-08462-z',
    url: doi('10.1038/s41598-022-08462-z'),
    problemSlugs: ['biosecurity'],
    riskSlugs: ['engineered-pandemics'],
    summary:
      'Filtered far-UVC (222 nm) lamps cut a room\'s airborne pathogen load by 98.4%, equal to 184 extra air changes per hour.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'egger-cash-transfers-2022',
    title: 'General Equilibrium Effects of Cash Transfers: Experimental Evidence From Kenya',
    published: '2022-01-01',
    added: ADDED,
    source: 'Econometrica',
    doi: '10.3982/ECTA17945',
    url: doi('10.3982/ECTA17945'),
    problemSlugs: ['extreme-poverty'],
    summary:
      'About $1,000 cash transfers to 10,500+ Kenyan households produced a local multiplier of 2.5, with minimal inflation.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'jumper-alphafold-2021',
    title: 'Highly accurate protein structure prediction with AlphaFold',
    published: '2021-07-15',
    added: ADDED,
    source: 'Nature',
    doi: '10.1038/s41586-021-03819-2',
    url: doi('10.1038/s41586-021-03819-2'),
    problemSlugs: ['scientific-productivity'],
    summary:
      'AlphaFold reached near-experimental accuracy on protein structure, a 50-year open problem.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'scott-value-of-aging-2021',
    title: 'The economic value of targeting aging',
    published: '2021-07-05',
    added: ADDED,
    source: 'Nature Aging',
    doi: '10.1038/s43587-021-00080-0',
    url: doi('10.1038/s43587-021-00080-0'),
    problemSlugs: ['longevity'],
    summary:
      'Slowing aging enough to add 1 year of life expectancy is worth $38T ($367T for 10 years). Targeting aging is worth more than eradicating any single disease.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'hsieh-housing-constraints-2019',
    title: 'Housing Constraints and Spatial Misallocation',
    published: '2019-04-01',
    added: ADDED,
    source: 'American Economic Journal: Macroeconomics',
    doi: '10.1257/mac.20170388',
    url: doi('10.1257/mac.20170388'),
    problemSlugs: ['housing-construction'],
    summary: 'The paper claimed zoning cost US growth 36% from 1964 to 2009.',
    changes: 'scale',
    review: 'peer-reviewed',
    status: 'challenged',
    notice: {
      note: 'A 2026 comment found code errors. The corrected effect is two orders of magnitude smaller.',
      url: doi('10.1257/mac.20230141'),
    },
  },
  {
    id: 'zhang-delta-toxin-cd9-2026',
    title: 'Clostridium perfringens Delta toxin targets CD9 to drive NEC and brain injury',
    published: '2026-10-28',
    added: '2026-11-01',
    source: 'Nature',
    doi: '10.1038/s41586-026-11211-1',
    url: doi('10.1038/s41586-026-11211-1'),
    problemSlugs: ['newborn-survival'],
    summary:
      'Delta-toxin-positive Clostridium perfringens was found in severe and fatal cases of necrotizing enterocolitis, a CRISPR screen identified CD9 as the toxin\'s receptor, and a neutralizing anti-Delta toxin monoclonal antibody protected mice against disease progression.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'perez-garcia-phergain-2026',
    title:
      '5-year outcomes of chemotherapy de-escalation in HER2-positive early breast cancer and exploratory circulating tumor DNA analyses from the randomized phase 2 PHERGain trial',
    published: '2026-10-29',
    added: '2026-11-01',
    source: 'Nature Medicine',
    doi: '10.1038/s41591-026-04723-w',
    url: doi('10.1038/s41591-026-04723-w'),
    problemSlugs: ['cancer'],
    summary:
      'After a median 5.6 years of follow-up, 5-year invasive disease-free survival was 89.5% in the PET-guided arm (n = 267) and 92.4% among PET responders with pathological complete response who skipped chemotherapy entirely (n = 86), with one distant recurrence in that group. The trial was non-comparative (NCT03161353).',
    changes: 'tractability',
    review: 'trial-result',
  },
  {
    id: 'yankova-mettl1-2026',
    title: 'Pharmacological inhibition of METTL1 as a therapy against solid and blood cancers',
    published: '2026-10-28',
    added: '2026-11-01',
    source: 'Nature',
    doi: '10.1038/s41586-026-11178-z',
    url: doi('10.1038/s41586-026-11178-z'),
    problemSlugs: ['cancer'],
    summary:
      'A first-in-class inhibitor of the tRNA methyltransferase METTL1, STM9005, impaired tumour growth and prolonged survival across multiple mouse cancer models; results are preclinical.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'gronska-peski-caloric-mutation-2026',
    title: 'Caloric restriction modulates genome-wide somatic mutation in mice',
    // Online publication date from the Cell page and Europe PMC (2026-09-09).
    // Crossref only issues the month, 2026-10.
    published: '2026-09-09',
    added: '2026-11-01',
    source: 'Cell',
    doi: '10.1016/j.cell.2026.08.013',
    url: doi('10.1016/j.cell.2026.08.013'),
    problemSlugs: ['longevity'],
    summary:
      '30% calorie restriction in 19-month-old male mice reduced somatic substitution and indel burdens, but two restriction regimens with different lifespan effects cut mutations similarly, suggesting mutation burden is not the sole or rate-limiting driver of lifespan.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'romanello-lancet-countdown-2026',
    title:
      'The 2026 report of the Lancet Countdown on health and climate change: a decade of escalating health harms and a decisive moment for all',
    published: '2026-10-27',
    added: '2026-11-01',
    source: 'The Lancet',
    doi: '10.1016/S0140-6736(26)01779-4',
    url: doi('10.1016/S0140-6736(26)01779-4'),
    problemSlugs: ['climate-change'],
    summary:
      'Heat was associated with a record estimated 710,000 deaths globally in 2023, with 71.5% attributed to human-caused climate change, and annual average heat-related deaths rose nearly 36% in the decade after the Paris Agreement compared with the decade before.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'barnes-europe-heat-summer-2026',
    title: 'Heat-related urban mortality attributable to human-induced climate change in Europe in summer 2026',
    published: '2026-10-31',
    added: '2026-11-06',
    source: 'Nature Health',
    doi: '10.1038/s44360-026-00220-z',
    url: doi('10.1038/s44360-026-00220-z'),
    problemSlugs: ['climate-change'],
    summary:
      'Across 854 European cities in June-August 2026, the authors estimate 50,391 heat-related excess deaths (95% eCI 46,026-53,878), of which 32,619 (65%) are attributable to anthropogenic climate change.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'shartova-enso-temperature-mortality-2026',
    title: 'Global temperature-related mortality associated with El-Nino Southern Oscillation',
    published: '2026-11-04',
    added: '2026-11-06',
    source: 'Nature Medicine',
    doi: '10.1038/s41591-026-04793-w',
    url: doi('10.1038/s41591-026-04793-w'),
    problemSlugs: ['climate-change'],
    summary:
      'During very strong El Nino years, global heat-related mortality rose an estimated 28.87% (+107,035 annual deaths; 95% eCI 27,336 to 176,312), while cold-related mortality fell 3.70% (-112,681 annual deaths).',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'gbd-cervical-cancer-2023-2026',
    title:
      'Global, regional and national burden of cervical cancer in 1990-2023 with forecasts to 2050: a Global Burden of Disease study',
    published: '2026-11-02',
    added: '2026-11-06',
    source: 'Nature Medicine',
    doi: '10.1038/s41591-026-04729-4',
    url: doi('10.1038/s41591-026-04729-4'),
    problemSlugs: ['cancer'],
    summary:
      'In 2023 there were an estimated 887,000 new cervical cancer cases and 369,000 deaths globally. Age-standardized incidence and mortality were more than four and seven times higher in low- versus high-income countries, and absolute cases and deaths are forecast to rise by 20.2% and 39.3% by 2050 even as age-standardized rates fall.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'unicorn-botensilimab-colon-2026',
    title:
      'Neoadjuvant botensilimab with or without balstilimab in pMMR and dMMR colon cancer: the phase 2 UNICORN trial',
    published: '2026-11-02',
    added: '2026-11-06',
    source: 'Nature Medicine',
    doi: '10.1038/s41591-026-04710-1',
    url: doi('10.1038/s41591-026-04710-1'),
    problemSlugs: ['cancer'],
    summary:
      'In the phase 2 UNICORN trial of short-course neoadjuvant botensilimab with or without balstilimab (n=56 resectable colon cancers), pathological major response was 100% in dMMR BOT+BAL and 36% in pMMR BOT+BAL, versus 0% with botensilimab alone in pMMR disease.',
    changes: 'tractability',
    review: 'trial-result',
  },
  {
    id: 'potassium-bp-untreated-hypertension-2026',
    title:
      'Oral Potassium Supplementation Lowers Clinic Blood Pressure in Untreated Primary Hypertension: Systematic Review and Meta-Analysis of Randomized Trials',
    // JAHA publication history says Published 2026-10-30. Crossref issue date is 2026-11-03.
    published: '2026-10-30',
    added: '2026-11-06',
    source: 'Journal of the American Heart Association',
    doi: '10.1161/JAHA.125.048590',
    url: doi('10.1161/JAHA.125.048590'),
    problemSlugs: ['hypertension'],
    summary:
      'A meta-analysis of 19 randomized trials (803 adults with untreated primary hypertension) found oral potassium reduced clinic systolic BP by 5.3 mm Hg and diastolic BP by 4.5 mm Hg; 24-hour ambulatory reductions were smaller (2.8 and 3.2 mm Hg).',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'mori-nectin4-rubella-2026',
    title: 'Nectin-4 mediates rubella virus entry in airway and placental cells',
    published: '2026-11-04',
    added: '2026-11-06',
    source: 'Nature',
    doi: '10.1038/s41586-026-11248-2',
    url: doi('10.1038/s41586-026-11248-2'),
    problemSlugs: ['infectious-disease', 'newborn-survival'],
    summary:
      'Nectin-4 is identified as a functional rubella virus entry receptor in airway and placental cells, shared with measles virus; Nectin-4 blockade significantly inhibited viral entry in human placental organoid models of transplacental infection.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'myc-ultraconserved-rna-aso-2026',
    title: 'CRISPR mutagenesis of the MYC locus reveals a druggable ultraconserved RNA element',
    // PubMed electronic date 2026-11-04. Crossref only has the issue month, 2026-11.
    published: '2026-11-04',
    added: '2026-11-06',
    source: 'Cell',
    doi: '10.1016/j.cell.2026.10.002',
    url: doi('10.1016/j.cell.2026.10.002'),
    problemSlugs: ['cancer'],
    summary:
      'Base-pair CRISPR tiling of the 10-kb MYC locus found that 67% of functionally essential base pairs are noncoding; steric-blocking antisense oligonucleotides targeting an ultraconserved 3\' UTR RNA element selectively eliminated MYC-dependent cancer cells and inhibited patient-derived tumor organoid growth.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'wang-fast-frameshifting-cancer-2026',
    title: 'Cancer-selective gene circuits via intrinsic ribosomal frameshifting',
    published: '2026-11-04',
    added: '2026-11-06',
    source: 'Nature',
    doi: '10.1038/s41586-026-11200-4',
    url: doi('10.1038/s41586-026-11200-4'),
    problemSlugs: ['cancer'],
    summary:
      'An engineered FAST gene circuit that exploits cancer-preferential codon-pair -1 ribosomal frameshifting conditionally expresses gasdermin D; with systemic AAV9 delivery in mouse colorectal and pancreatic models it elicited tumour regression, immune activation, and synergy with checkpoint blockade while sparing normal tissues from detectable toxicity.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'heron-lung01-ruzaltatug-2026',
    title:
      'Ruzaltatug rezetecan versus chemotherapy for EGFR-mutated advanced non-small-cell lung cancer progressing after EGFR tyrosine kinase inhibitor therapy (HERON-Lung01): interim analysis of a randomised, open-label, phase 3 trial in China',
    // PubMed electronic date 2026-10-26. Crossref only has the issue month, 2026-11. PubMed journal date is 2026-11-07.
    published: '2026-10-26',
    added: '2026-11-06',
    source: 'The Lancet',
    doi: '10.1016/S0140-6736(26)01899-4',
    url: doi('10.1016/S0140-6736(26)01899-4'),
    problemSlugs: ['cancer'],
    summary:
      'In a China phase 3 interim analysis (n=498), the HER3 ADC ruzaltatug rezetecan prolonged BICR PFS versus pemetrexed plus carboplatin or cisplatin after EGFR-TKI failure (median 8.3 vs 5.4 months; HR 0.47, 95% CI 0.36-0.60).',
    changes: 'tractability',
    review: 'trial-result',
  },
  {
    id: 'fornace-malaria-climate-asia-pacific-2026',
    title: 'Climate change threatens malaria elimination in the Asia Pacific',
    published: '2026-10-30',
    added: '2026-11-06',
    source: 'Nature Medicine',
    doi: '10.1038/s41591-026-04722-x',
    url: doi('10.1038/s41591-026-04722-x'),
    problemSlugs: ['infectious-disease', 'climate-change'],
    // The abstract states a sharp rise, including Pakistan after the 2022 floods.
    // Draft case counts were not in the abstract, and the article body is paywalled, so they are omitted.
    summary:
      'Climate change threatens malaria elimination across the Asia Pacific: reported cases have increased sharply in several regions, including Pakistan following the 2022 floods, through cascading disruptions to health systems, population displacement, and ecological change.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'lou-preprimary-education-laws-2026',
    title:
      'Preprimary education laws and women\'s gender attitudes, empowerment and reproductive autonomy in 117 low- and middle-income countries',
    published: '2026-11-04',
    added: '2026-11-06',
    source: 'Nature Human Behaviour',
    doi: '10.1038/s41562-026-02583-5',
    url: doi('10.1038/s41562-026-02583-5'),
    problemSlugs: ['pedagogy'],
    summary:
      'Across 495 surveys covering nearly 6.7 million women in 117 low- and middle-income countries, eligibility under preprimary education legislation was associated with higher female primary enrolment (+1.21 pp) and completion (+0.75 pp), greater ever use of contraception (+2.96 pp), and lower adolescent childbearing (-2.41 pp) and child marriage (-0.43 pp).',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'mantis-childhood-brain-tumors-2026',
    title: 'AI-based precision prognostics and therapy personalization for childhood brain tumors',
    published: '2026-11-03',
    added: '2026-11-06',
    source: 'Nature Genetics',
    doi: '10.1038/s41588-026-02815-4',
    url: doi('10.1038/s41588-026-02815-4'),
    problemSlugs: ['cancer'],
    summary:
      'MANTIS, built on DNA methylation from 2,786 medulloblastoma and ependymoma patients, reports concordance indices up to 0.80 +/- 0.07. It identifies about 60% of average-risk medulloblastoma patients with no statistically significant survival difference (P = 0.683) under less intensive craniospinal irradiation. A non-significant P value does not show noninferiority or that the lower dose is safe. The DOI was not independently challenged in this pass and is not marked false.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'nad-blood-cvd-not-age-2026',
    title: 'Whole-blood NAD levels track cardiovascular disease but not chronological age',
    published: '2026-11-04',
    added: '2026-11-06',
    source: 'Nature Metabolism',
    doi: '10.1038/s42255-026-01660-3',
    url: doi('10.1038/s42255-026-01660-3'),
    problemSlugs: ['longevity', 'hypertension'],
    summary:
      'In 1,340 measurements from 1,068 adults, whole-blood NAD did not decline with age in healthy people (stable in males, increased in females) but was reduced in cardiovascular disease and hypertension.',
    changes: 'neglectedness',
    review: 'peer-reviewed',
  },
  {
    id: 'harvard-global-cancer-treatment-costs-2026',
    title: 'Estimated global treatment costs for 31 cancer types by stage, year, and follow-up period: a systematic review and modelling study',
    published: '2026-11-02',
    added: '2026-11-08',
    source: 'The Lancet Oncology',
    doi: '10.1016/s1470-2045(26)00388-8',
    url: doi('10.1016/s1470-2045(26)00388-8'),
    problemSlugs: ['cancer'],
    summary:
      'Modelled 10-year treatment costs for cancers diagnosed in 2022 total $771.48 billion globally. Mean cost per patient is $38,650, from $3,380 in eastern Africa to $93,600 in North America. North America and Europe hold 64% of costs but 36% of cases.',
    changes: 'scale',
    review: 'peer-reviewed',
  },
  {
    id: 'fofana-kalumi-ganaplacide-2026',
    title:
      'Ganaplacide plus lumefantrine solid dispersion formulation for children with uncomplicated Plasmodium falciparum malaria (KALUMI): an open-label, multicentre, randomised, controlled, adaptive, phase 2, non-inferiority trial',
    // Europe PMC firstPublicationDate 2026-11-06. Crossref has no published-online date; issued and published-print are 2026-11 only.
    published: '2026-11-06',
    added: '2026-11-10',
    source: 'The Lancet Infectious Diseases',
    doi: '10.1016/s1473-3099(26)00492-5',
    url: doi('10.1016/s1473-3099(26)00492-5'),
    problemSlugs: ['infectious-disease'],
    summary:
      'In the main part, 220 children across Burkina Faso, Mali, Cote d\'Ivoire, Gabon, and DR Congo had PCR-corrected cure on day 29 of 97 of 98 (99%) with ganaplacide plus lumefantrine versus 98 of 99 (99%) with artemether-lumefantrine, a non-inferior result, and vomiting was 29% versus 11%. Ganaplacide is a new non-artemisinin antimalarial class, and a phase 3 trial followed (NCT05842954).',
    changes: 'tractability',
    review: 'trial-result',
  },
  {
    id: 'di-achille-smartwatch-hypertension-2026',
    title: 'Opportunistically Detecting Signs of Hypertension on a Consumer Smartwatch',
    // Crossref published-online 2026-11-05.
    published: '2026-11-05',
    added: '2026-11-10',
    source: 'Nature',
    doi: '10.1038/s41586-026-11336-3',
    url: doi('10.1038/s41586-026-11336-3'),
    problemSlugs: ['hypertension'],
    summary:
      'AI on photoplethysmography and accelerometry from a consumer smartwatch, with no cuff calibration, was validated prospectively in 196 participants against 24-hour ambulatory blood pressure: over seven days, sensitivity was 65.8% and specificity 90.0%, versus initial office blood pressure screening sensitivity 55.3% and specificity 90.0%. Over half of adults with hypertension are unaware of it.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'lucinde-chw-home-bp-2026',
    title:
      'Community health worker-led home blood pressure monitoring in rural sub-Saharan Africa: a diagnostic accuracy study',
    // Europe PMC firstPublicationDate 2026-11-06. Crossref has no published-online date; issued and published-print are 2026-11 only.
    published: '2026-11-06',
    added: '2026-11-10',
    source: 'The Lancet Global Health',
    doi: '10.1016/j.langlo.2026.104097',
    url: doi('10.1016/j.langlo.2026.104097'),
    problemSlugs: ['hypertension'],
    summary:
      'Among 1279 participants in Kilifi, Kenya and Kiang West, The Gambia, community health worker coordinated home blood pressure monitoring had an age-standardised sensitivity of 82.6% and specificity of 82.4% in Kenya against daytime ambulatory monitoring.',
    changes: 'tractability',
    review: 'peer-reviewed',
  },
  {
    id: 'scott-newborn-vitamin-k-2026',
    title: 'Nonreceipt of Newborn Vitamin K and Risk of Bleeding',
    // Crossref published-online 2026-11-05.
    published: '2026-11-05',
    added: '2026-11-10',
    source: 'JAMA',
    doi: '10.1001/jama.2026.21764',
    url: doi('10.1001/jama.2026.21764'),
    problemSlugs: ['newborn-survival'],
    summary:
      'Among 5 240 780 US infants in Epic Cosmos from 2017 to 2025, vitamin K nonreceipt rose from 3.1% in 2017 to 6.8% in 2025. Infants without it had a higher risk of bleeding by 6 months (adjusted risk ratio 1.47) and intracranial bleeding (adjusted risk ratio 2.43).',
    changes: 'scale',
    review: 'peer-reviewed',
  },
]

const DATE = /^\d{4}-\d{2}-\d{2}$/

export function discoveryIssues(list: Discovery[] = discoveries): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const problemSlugs = new Set(problems.map((p) => p.slug))
  const riskSlugs = new Set(existentialRisks.map((r) => r.slug))
  const changes = new Set<DiscoveryChange>(['scale', 'neglectedness', 'tractability'])
  const reviews = new Set<ReviewStatus>(['peer-reviewed', 'preprint', 'trial-result'])

  for (const d of list) {
    const at = d.id || '(missing id)'
    if (!d.id || ids.has(d.id)) errors.push(`${at}: id missing or duplicate`)
    ids.add(d.id)
    if (!d.title.trim()) errors.push(`${at}: title required`)
    if (!d.summary.trim()) errors.push(`${at}: summary required`)
    if (!d.source.trim()) errors.push(`${at}: source required`)
    if (!d.url.startsWith('https://')) errors.push(`${at}: url must be https`)
    if (d.doi && d.url !== doi(d.doi)) errors.push(`${at}: url must be the DOI link`)
    if (d.published && !DATE.test(d.published)) errors.push(`${at}: published must be YYYY-MM-DD or empty`)
    if (!DATE.test(d.added)) errors.push(`${at}: added must be YYYY-MM-DD`)
    if (!changes.has(d.changes)) errors.push(`${at}: bad changes value`)
    if (!reviews.has(d.review)) errors.push(`${at}: bad review value`)
    if (d.problemSlugs.length === 0 && (d.riskSlugs?.length ?? 0) === 0) {
      errors.push(`${at}: tag at least one problem or S-tier risk`)
    }
    for (const slug of d.problemSlugs) {
      if (!problemSlugs.has(slug)) errors.push(`${at}: unknown problem ${slug}`)
    }
    for (const slug of d.riskSlugs ?? []) {
      if (!riskSlugs.has(slug)) errors.push(`${at}: unknown risk ${slug}`)
    }
    if (d.status && d.status !== 'retracted' && d.status !== 'challenged') {
      errors.push(`${at}: bad status`)
    }
    if (d.status && (!d.notice?.note.trim() || !d.notice.url.startsWith('https://'))) {
      errors.push(`${at}: status requires a notice note and https url`)
    }
    const prose = [d.title, d.summary, d.notice?.note ?? '', d.source].join('\n')
    if (prose.includes('\u2014') || prose.includes('\u2013')) {
      errors.push(`${at}: no em or en dashes in copy`)
    }
  }
  return errors
}

const issues = discoveryIssues()
if (issues.length > 0) {
  throw new Error(`discoveries.ts failed validation:\n${issues.join('\n')}`)
}

function byNewest(a: Discovery, b: Discovery): number {
  if (!a.published && !b.published) return a.id.localeCompare(b.id)
  if (!a.published) return 1
  if (!b.published) return -1
  return b.published.localeCompare(a.published) || b.added.localeCompare(a.added) || a.id.localeCompare(b.id)
}

export function listDiscoveries(opts: { problemSlug?: string; riskSlug?: string } = {}): Discovery[] {
  return discoveries
    .filter((d) => {
      if (opts.problemSlug && !d.problemSlugs.includes(opts.problemSlug)) return false
      if (opts.riskSlug && !(d.riskSlugs ?? []).includes(opts.riskSlug as RiskSlug)) return false
      return true
    })
    .sort(byNewest)
}

export function discoveryCountByProblem(): Map<string, number> {
  const counts = new Map<string, number>()
  for (const d of discoveries) {
    for (const slug of d.problemSlugs) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1)
    }
  }
  return counts
}
