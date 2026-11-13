// Constraint tree for optimism.fun: why do people have fewer children than they say they want?
// Researched 2026-11-11. Every number below was read on a page opened this session.
// Inference is labeled as inference. This tree describes evidence and takes no side on policy.

import type { ConstraintTree } from '../constraints'

const UN_WPP = {
  label: 'UN DESA Population Division, World Population Prospects 2024: Summary of Results',
  url: 'https://www.un.org/development/desa/pd/node/4354',
}
const UNFPA_2025 = {
  label: 'UNFPA, State of World Population 2025: The Real Fertility Crisis',
  url: 'https://www.unfpa.org/swp2025',
}
const POLICY_REVIEW = {
  label: 'Can policies stall the fertility fall? Systematic review of 35 studies, Population and Development Review 2021 (University of Oslo page)',
  url: 'https://www.sv.uio.no/iss/english/research/projects/openflux/publications/2021/fauske-can-policies-stall-fertility-fall.html',
}
const PEW_2025 = {
  label: 'Pew Research Center, 5 facts about global fertility trends (15 Aug 2025), from UN data',
  url: 'https://www.pewresearch.org/short-reads/2025/08/15/5-facts-about-global-fertility-trends/',
}
const WHO_INFERTILITY = {
  label: 'WHO, 1 in 6 people globally affected by infertility (4 April 2023)',
  url: 'https://www.who.int/news/item/04-04-2023-1-in-6-people-globally-affected-by-infertility',
}

export const fertilityDeclineTree: ConstraintTree = {
  problemSlug: 'fertility-decline',
  outcome:
    'People can have the number of children they want, when they want them. The measure is the gap between intended and actual births. Global fertility is 2.25 births per woman, down from 3.31 in 1990.',
  whyUnsolved:
    'None of the sources read names a single cause. In a UNFPA survey across 14 countries, 39 percent said financial limitations had affected or would affect their family size. A review of 35 quasi-experimental studies in rich countries found childcare expansions raise completed fertility, while cash transfers have temporary effects. Births are also moving to later ages, and infertility care is out of reach for many people because of cost. The same survey found nearly one in three adults had an unintended pregnancy, so the gap runs in both directions.',
  bindingId: 'cost',
  updated: '2026-11-11',
  root: [
    {
      id: 'cost',
      claim: 'About four in ten people surveyed say money limits the family size they want.',
      kind: 'payment',
      whyUnsolved:
        'In the UNFPA and YouGov survey of 14 countries, 39 percent said financial limitations had affected or would affect their ability to reach the family size they want. Nearly 20 percent of adults of reproductive age believe they will not be able to have the number of children they want. Support that would change this is costly, and the evidence on which support works is mixed. Binding choice is inference from stated reasons, which are not the same as causes.',
      falsifier:
        'Completed family size does not rise where the cost of raising children is cut. Or countries with the most generous support show the same gap between wanted and actual births.',
      tested:
        'Partly supports, partly weakens. A systematic review of 35 experimental and quasi-experimental studies in Europe, the United States, Canada and Australia found that childcare expansions increase completed fertility. It found that increased cash transfers have temporary effects. Newer evidence on parental leave suggests larger effects than earlier work. Inference: lowering one cost, childcare, moves the outcome, and handing over cash has a temporary effect. Effect sizes were not on the page opened. Not tested: whether the gap between wanted and actual births is smaller in high-support countries.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Not researched this session who works on the cost of raising children, public or private. Governments are the main payers and were not mapped.',
      },
      entryPoints: [
        { who: 'talent', action: 'For one country, compare wanted and actual family size before and after a childcare expansion, and publish the method.' },
        { who: 'operator', action: 'If you run childcare, publish full cost per place so funders can see what an expansion would take.' },
        { who: 'capital', action: 'Fund a pre-registered evaluation of one new family policy that tracks completed family size, not only births in the first years.' },
      ],
      sources: [UNFPA_2025, POLICY_REVIEW, UN_WPP],
    },
    {
      id: 'timing',
      claim: 'People cannot have children at the age they would prefer, and births move later.',
      kind: 'coordination',
      whyUnsolved:
        'Nearly one in four adults in the UNFPA survey felt unable to have a child at their preferred time. Nearly one in five said fears about the future, such as climate change, wars and pandemics, had led or would lead to fewer children than they wanted. UN projections expect the share of births to women under 25 to fall in every region by 2100. Inference: education, work, housing and finding a partner all have to line up first, and no one institution owns that sequence.',
      falsifier:
        'Countries where first births come early show the same gap between wanted and actual family size. Or later starts are shown to be fully made up by births at older ages.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Not researched. The mean age at first birth by country was not opened this session, so the size of the delay is unknown here.',
      },
      entryPoints: [
        { who: 'talent', action: 'Collect age at first birth and wanted family size by country from official sources and test whether later starts predict a larger gap.' },
        { who: 'talent', action: 'Interview 20 people who had a child later than they wanted and record the one thing that delayed them.' },
      ],
      sources: [UNFPA_2025, PEW_2025],
    },
    {
      id: 'infertility-care',
      claim: 'Infertility is common, and treatment is mostly paid out of pocket.',
      kind: 'payment',
      whyUnsolved:
        'About 17.5 percent of adults, roughly one in six, experience infertility in their lifetime, with similar rates in rich and poor countries. Treatment is mostly paid out of pocket. In low- and middle-income countries, one round of IVF often costs more than a year of average income. WHO says prevention, diagnosis and treatment remain underfunded.',
      falsifier:
        'Countries that fund fertility treatment publicly show no higher completed family size than similar countries that do not.',
      suppliers: ['WHO (prevalence estimates and guidance)'],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Not researched which clinics or companies are cutting the cost of IVF, or by how much. The share of the birth gap that infertility explains is also unknown.',
      },
      entryPoints: [
        { who: 'talent', action: 'Break down the cost of one IVF cycle in one country into drugs, lab, staff and margin, with sources.' },
        { who: 'capital', action: 'Back a clinic model that publishes its price and live birth rate per cycle.' },
        { who: 'operator', action: 'If you run a fertility clinic, publish prices and outcomes in a form patients can compare.' },
      ],
      sources: [WHO_INFERTILITY],
    },
  ],
}
