/**
 * Editorial briefs for optimism.fun visual artifacts. These are source-first
 * and approval-gated: Figma renders the design, humans approve the claim and
 * final copy, and social publishing remains a separate explicit action.
 */

export type InfographicBrief = {
  slug: string
  status: 'ready-for-design' | 'in-review' | 'published'
  title: string
  kicker: string
  claim: string
  problemSlug: string
  visual: { format: 'square' | 'portrait' | 'landscape'; chart: string; direction: string }
  facts: { value: string; label: string; source: string; sourceUrl: string }[]
  sourceNote: string
  xDraft: string
  instagramDraft: string
  altText: string
}

export const FIGMA_ARTIFACT_FACTORY_URL =
  'https://www.figma.com/design/emnqikIIIYMzzRarPASwIx'

export const infographicBriefs: InfographicBrief[] = [
  {
    slug: 'ntds-biggest-health-market-failure',
    status: 'in-review',
    title: 'The biggest health market failure you have never heard of',
    kicker: 'NEGLECTED TROPICAL DISEASES',
    claim: '1.7 billion people need treatment for diseases that receive under 2% of pharmaceutical R&D.',
    problemSlug: 'neglected-tropical-diseases',
    visual: {
      format: 'portrait',
      chart: '100-unit allocation bar',
      direction: 'A single 100-block bar: fewer than two illuminated blocks for NTD R&D, then a human-scale 1.7B figure and the financing/delivery gap below.',
    },
    facts: [
      { value: '1.7B', label: 'people need NTD interventions', source: 'WHO Global report on NTDs 2025', sourceUrl: 'https://www.who.int/teams/control-of-neglected-tropical-diseases/global-report-on-neglected-tropical-diseases-2025' },
      { value: '<2%', label: 'of pharmaceutical R&D reaches NTDs', source: '2026 pharmaceutical-industry NTD review', sourceUrl: 'https://link.springer.com/article/10.1186/s41182-026-00951-5' },
      { value: '−41%', label: 'NTD aid, 2018–2023', source: 'WHO, June 2025', sourceUrl: 'https://www.who.int/news/item/04-06-2025-neglected-tropical-diseases-further-neglected-due-to-oda-cuts' },
    ],
    sourceNote: 'Claim is about funding and delivery failure, not a lack of treatable disease science.',
    xDraft: '1.7B people need treatment for neglected tropical diseases. They receive under 2% of pharmaceutical R&D, while aid fell 41% in five years.\n\nThe frontier is not only new drugs. It is manufacturing, pooled procurement, and last-mile delivery.\n\nSources: WHO + 2026 NTD review. optimism.fun',
    instagramDraft: 'The biggest health market failure you have never heard of:\n\n1.7 billion people need treatment for neglected tropical diseases. Yet they receive under 2% of pharmaceutical R&D, and aid fell 41% from 2018 to 2023.\n\nThe opportunity is not abstract: build the financing, manufacturing, and delivery rails that let proven interventions reach people.\n\nSources in the graphic.\n\n#globalhealth #healthinnovation #goodquests',
    altText: 'A 100-unit bar shows fewer than two units of pharmaceutical research and development allocated to neglected tropical diseases, alongside figures showing 1.7 billion people need interventions and aid fell 41 percent between 2018 and 2023.',
  },
  {
    slug: 'poverty-graduation-cost-collapse',
    status: 'ready-for-design',
    title: 'The anti-poverty program that costs too much to scale',
    kicker: 'EXTREME POVERTY',
    claim: 'The Graduation approach has durable income effects, but about $5,000 per household keeps it from reaching vastly more families.',
    problemSlug: 'extreme-poverty',
    visual: {
      format: 'square',
      chart: 'cost waterfall',
      direction: 'Show a $5,000 household program cost flowing into human coaching, then highlight the 30–40% group-coaching cost reduction and the software-led path to lower cost per household.',
    },
    facts: [
      { value: '700M', label: 'people live in extreme poverty', source: 'World Bank Poverty and Inequality Platform', sourceUrl: 'https://pip.worldbank.org' },
      { value: '65%', label: 'decline in extreme poverty since 1990 before the pandemic reversal', source: 'Our World in Data', sourceUrl: 'https://ourworldindata.org/extreme-poverty' },
      { value: '~$5K', label: 'per household in the Graduation model', source: 'BRAC Graduation program data, cited in optimism.fun RFS', sourceUrl: 'https://bracupgi.org' },
    ],
    sourceNote: 'The visual distinguishes the intervention’s evidence base from the still-unproven software cost-collapse thesis.',
    xDraft: 'Extreme poverty fell dramatically. The remaining problem is harder: reaching the people growth and basic aid still miss.\n\nOne of the best-evidenced interventions costs roughly $5,000 per household because human coaching does not scale. The good quest: make that delivery system radically cheaper without losing the outcome.\n\nSources: World Bank, OWID, BRAC.',
    instagramDraft: 'A proven anti-poverty intervention should not stay small because the delivery model is expensive.\n\nThe Graduation approach has durable income effects, but it can cost roughly $5,000 per household. Better field tools, risk triage, and group coaching could let the same evidence reach many more families.\n\nThe quest is not inventing a new theory of poverty. It is scaling what works.\n\n#poverty #development #goodquests',
    altText: 'A cost waterfall explains why the Graduation approach can cost roughly five thousand dollars per household, and highlights coaching as a major cost that group coaching and software can reduce.',
  },
  {
    slug: 'pandemic-warning-before-hospitals',
    status: 'ready-for-design',
    title: 'Pandemics still get a head start',
    kicker: 'BIOSECURITY',
    claim: 'We detect outbreaks after people arrive at hospitals. Continuous environmental sequencing can shift the warning window earlier.',
    problemSlug: 'biosecurity',
    visual: {
      format: 'portrait',
      chart: 'two-lane timeline',
      direction: 'Contrast the current hospital-first detection timeline with wastewater, airport, and air-handler monitoring; label the intervention as earlier warning, not guaranteed prevention.',
    },
    facts: [
      { value: '~20M', label: 'excess deaths in the last major pandemic', source: 'WHO excess-deaths estimates and subsequent totals', sourceUrl: 'https://www.who.int/data/stories/global-excess-deaths-associated-with-covid-19-january-2020-to-december-2021' },
      { value: '8.1B', label: 'people exposed to pandemic risk', source: '80,000 Hours biosecurity profile', sourceUrl: 'https://80000hours.org/problem-profiles/preventing-catastrophic-pandemics/' },
      { value: '100 days', label: 'CEPI target for a new vaccine response', source: 'CEPI 100 Days Mission', sourceUrl: 'https://cepi.net/100-days' },
    ],
    sourceNote: 'Early detection reduces response delay; it does not eliminate the need for manufacturing, public-health infrastructure, or governance.',
    xDraft: 'We still learn about outbreaks by waiting for hospitals to fill.\n\nThe better system is continuous monitoring: wastewater, airports, and air handlers that flag a novel pathogen before clinical surveillance catches up.\n\nCOVID caused roughly 20M excess deaths. A few days of earlier warning matters.\n\nSources: WHO, CEPI, 80,000 Hours.',
    instagramDraft: 'Pandemics still get a free head start.\n\nToday, outbreaks are often detected only after people show up sick. Continuous environmental sequencing could warn earlier through wastewater, airports, and building air systems.\n\nEarlier warning is not a silver bullet. It is one missing layer in the system that protects all 8.1 billion of us.\n\n#biosecurity #pandemicpreparedness #publichealth',
    altText: 'A two-lane timeline compares hospital-first outbreak detection with earlier continuous environmental monitoring through wastewater, airport, and air-handler sampling.',
  },
  {
    slug: 'solar-cost-crossover',
    status: 'ready-for-design',
    title: 'Solar is now cheaper than the fossil alternative',
    kicker: 'CLEAN ENERGY',
    claim: 'In 2024, utility-scale solar PV was 41% cheaper than the lowest-cost fossil-fuel alternative.',
    problemSlug: 'clean-energy',
    visual: {
      format: 'portrait',
      chart: 'cost crossover slope chart',
      direction: 'Show solar moving from 710% more expensive to 41% cheaper, then give the avoided fossil-fuel cost its own large-number panel.',
    },
    facts: [
      { value: '41%', label: 'solar PV cost advantage vs. lowest-cost fossil alternative, 2024', source: 'IRENA, Renewable Power Generation Costs 2024', sourceUrl: 'https://www.irena.org/Publications/2025/Jun/Renewable-Power-Generation-Costs-in-2024' },
      { value: '91%', label: 'new renewable projects cheaper than fossil alternatives', source: 'IRENA, July 2025', sourceUrl: 'https://www.irena.org/News/pressreleases/2025/Jul/91-Percent-of-New-Renewable-Projects-Now-Cheaper-Than-Fossil-Fuels-Alternatives' },
      { value: '$467B', label: 'fossil-fuel costs avoided by renewables in 2024', source: 'IRENA, July 2025', sourceUrl: 'https://www.irena.org/News/pressreleases/2025/Jul/91-Percent-of-New-Renewable-Projects-Now-Cheaper-Than-Fossil-Fuels-Alternatives' },
    ],
    sourceNote: 'Cost is no longer the generic blocker; grid interconnection, storage, financing, and deployment speed are.',
    xDraft: 'Solar went from 710% more expensive than fossil power to 41% cheaper than the lowest-cost fossil alternative. In 2024, 91% of new renewables beat fossil alternatives on cost.\n\nThe good quest has moved: unlock interconnection, storage, financing, and deployment.\n\nSource: IRENA.',
    instagramDraft: 'The clean-energy argument has changed.\n\nSolar is now 41% cheaper than the lowest-cost fossil alternative, and 91% of new renewable projects commissioned in 2024 beat fossil alternatives on cost.\n\nThe bottleneck is now deployment: grid queues, storage, financing, and execution.\n\n#cleanenergy #climate #goodquests',
    altText: 'A cost crossover chart shows utility-scale solar moving from much more expensive than fossil generation to 41 percent cheaper in 2024, alongside 91 percent of new renewable projects beating fossil alternatives on cost.',
  },
  {
    slug: 'vaccines-lives-saved',
    status: 'ready-for-design',
    title: 'Four childhood vaccines saved 87 million lives',
    kicker: 'IMMUNIZATION',
    claim: 'DTP, measles, rotavirus, and Hib vaccination prevented an estimated 86.9 million child deaths from 1990 to 2019.',
    problemSlug: 'global-health',
    visual: {
      format: 'portrait',
      chart: 'stacked lives-saved area',
      direction: 'Use four additive bands to make 86.9 million concrete, with a final gap marker for children who still receive no routine dose.',
    },
    facts: [
      { value: '86.9M', label: 'estimated child deaths prevented, 1990–2019', source: 'Lancet Global Health study', sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10976869/' },
      { value: '46.7M', label: 'deaths averted by DTP vaccine', source: 'Lancet Global Health study', sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10976869/' },
      { value: '13.5M', label: 'zero-dose children in 2023', source: 'WHO immunization coverage', sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/immunization-coverage' },
    ],
    sourceNote: 'This is a delivery success story with a remaining last-mile access problem, not an argument for complacency.',
    xDraft: 'Four childhood vaccines prevented an estimated 86.9M child deaths in three decades.\n\nThe remaining gap is unusually concrete: 13.5M children still received no routine vaccine dose in 2023. The good quest is dependable last-mile cold chain, data, and delivery.\n\nSources: Lancet Global Health, WHO.',
    instagramDraft: 'Vaccination is one of humanity’s clearest proofs that delivery systems save lives.\n\nFour childhood vaccines prevented an estimated 86.9 million child deaths from 1990 to 2019. Yet 13.5 million children still received no routine vaccine dose in 2023.\n\nBuild the cold chain and last-mile systems that close that gap.\n\n#globalhealth #vaccines #goodquests',
    altText: 'A stacked area chart adds deaths prevented by DTP, measles, Hib, and rotavirus vaccines from 1990 to 2019 to reach 86.9 million, with a marker for 13.5 million zero-dose children in 2023.',
  },
  {
    slug: 'maternal-survival-progress',
    status: 'ready-for-design',
    title: 'Maternal mortality fell 40%, and the job is unfinished',
    kicker: 'MATERNAL HEALTH',
    claim: 'Global maternal mortality fell from 328 to 197 deaths per 100,000 live births between 2000 and 2023.',
    problemSlug: 'maternal-mortality',
    visual: {
      format: 'portrait',
      chart: 'regional slope chart',
      direction: 'Lead with the global 328-to-197 slope, then compare regions to show that delivery capacity, not fate, drives the remaining gap.',
    },
    facts: [
      { value: '40%', label: 'global maternal mortality reduction, 2000–2023', source: 'UNICEF maternal mortality data', sourceUrl: 'https://data.unicef.org/topic/maternal-health/maternal-mortality/' },
      { value: '183K', label: 'fewer maternal deaths per year than in 2000', source: 'WHO maternal mortality fact sheet', sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/maternal-mortality' },
      { value: '712', label: 'women saved each day versus 2000', source: 'UNICEF maternal mortality data', sourceUrl: 'https://data.unicef.org/topic/maternal-health/maternal-mortality/' },
    ],
    sourceNote: 'The design should surface regional inequity rather than treating the global average as a finished story.',
    xDraft: 'Global maternal mortality fell 40% from 2000 to 2023. That is roughly 183,000 fewer deaths a year.\n\nBut the gains are radically uneven. The good quest is reliable skilled birth care, referral, and emergency transport where a pregnancy is still dangerous by default.\n\nSources: UNICEF, WHO.',
    instagramDraft: 'Maternal mortality has fallen 40% since 2000. That means about 183,000 fewer women dying each year.\n\nProgress proves the problem is solvable. The remaining gap is in reliable care: skilled birth attendants, fast referral, emergency transport, and respectful systems.\n\n#maternalhealth #globalhealth #goodquests',
    altText: 'A slope chart shows global maternal mortality falling from 328 to 197 deaths per 100,000 live births between 2000 and 2023, alongside regional progress and 183,000 fewer deaths per year.',
  },
  {
    slug: 'safe-water-progress',
    status: 'ready-for-design',
    title: 'Nearly one billion people gained safe drinking water',
    kicker: 'WATER',
    claim: 'Between 2015 and 2024, 961 million people gained safely managed drinking-water services.',
    problemSlug: 'clean-water',
    visual: {
      format: 'square',
      chart: 'before-after coverage rings',
      direction: 'Use 2015 and 2024 coverage rings, then turn the 961 million gain into a daily-rate comparison without hiding the remaining gap.',
    },
    facts: [
      { value: '961M', label: 'people gaining safely managed drinking water, 2015–2024', source: 'UNICEF JMP drinking water data', sourceUrl: 'https://data.unicef.org/topic/water-and-sanitation/drinking-water/' },
      { value: '68→74%', label: 'global safely managed water coverage', source: 'UNICEF JMP drinking water data', sourceUrl: 'https://data.unicef.org/topic/water-and-sanitation/drinking-water/' },
      { value: '2.2B', label: 'people still without safely managed drinking water', source: 'World Bank water overview', sourceUrl: 'https://www.worldbank.org/ext/en/topic/water' },
    ],
    sourceNote: 'Celebrate measurable progress while retaining the denominator: billions still lack a safely managed service.',
    xDraft: '961M people gained safely managed drinking water between 2015 and 2024. Coverage rose from 68% to 74%.\n\nThat still leaves 2.2B people without safely managed water. The good quest: low-cost treatment, trusted maintenance, and financing that works beyond the pipe installation.\n\nSources: UNICEF JMP, World Bank.',
    instagramDraft: 'Nearly one billion people gained safely managed drinking water in a decade.\n\nThat is real progress: coverage rose from 68% to 74% between 2015 and 2024. But 2.2 billion people still lack a safely managed service.\n\nThe work is treatment, maintenance, and financing that lasts.\n\n#water #publichealth #goodquests',
    altText: 'Two coverage rings show global safely managed drinking water access growing from 68 to 74 percent between 2015 and 2024, representing 961 million people, alongside a remaining 2.2 billion-person gap.',
  },
  {
    slug: 'healthy-years-gained',
    status: 'ready-for-design',
    title: 'Humanity gained 6.4 years of life in two decades',
    kicker: 'HEALTHSPAN',
    claim: 'Global life expectancy rose from 66.8 years in 2000 to 73.1 years in 2019.',
    problemSlug: 'global-health',
    visual: {
      format: 'portrait',
      chart: 'life-and-healthspan twin lines',
      direction: 'Pair life expectancy with healthy life expectancy so the visual asks not only whether we live longer, but whether those years are healthy.',
    },
    facts: [
      { value: '+6.4', label: 'years of global life expectancy, 2000–2019', source: 'WHO Global Health Estimates', sourceUrl: 'https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy' },
      { value: '+5.3', label: 'years of healthy life expectancy in the same period', source: 'WHO Global Health Estimates', sourceUrl: 'https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy' },
      { value: '66.8→73.1', label: 'global life expectancy, 2000–2019', source: 'Our World in Data', sourceUrl: 'https://ourworldindata.org/life-expectancy' },
    ],
    sourceNote: 'The emphasis is healthspan, not just lifespan: prevent disease and reduce the years lived with disability.',
    xDraft: 'Humanity gained 6.4 years of life expectancy from 2000 to 2019, and 5.3 healthy years.\n\nThat is a huge collective achievement. The next good quest is closing the gap between living longer and living well through prevention, early detection, and affordable chronic care.\n\nSources: WHO, Our World in Data.',
    instagramDraft: 'Humanity gained 6.4 years of life expectancy in two decades, and 5.3 healthy years.\n\nThe next question is healthspan: how do we make more of the extra years active, independent, and free from preventable disease?\n\nPrevention, early detection, and chronic care are the frontier.\n\n#healthspan #prevention #goodquests',
    altText: 'Twin lines show global life expectancy rising from 66.8 to 73.1 years and healthy life expectancy rising by 5.3 years between 2000 and 2019.',
  },
]

