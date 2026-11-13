// Constraint tree: why extreme poverty is not solved yet.
// Researched 2026-11-11. Every number below comes from a page opened that day.
// Inference is labelled as inference. Unknown stays unknown.
// Two poverty lines appear. The site entry uses the current $3 a day line (811 million, 2026).
// The World Bank now reports at $3 a day (811 million, 2026). They are not mixed.

import type { ConstraintTree } from '../constraints'

const WB_OVERVIEW = { label: 'World Bank, poverty overview', url: 'https://www.worldbank.org/en/topic/poverty/overview' }
const WB_PPP_2024 = {
  label: 'World Bank, Poverty, Prosperity, and Planet Report 2024 press release',
  url: 'https://www.worldbank.org/en/news/press-release/2024/10/15/ending-poverty-for-half-the-world-could-take-more-than-a-century',
}
const WB_FCS = {
  label: 'World Bank, fragile and conflict-affected situations press release, 27 June 2025',
  url: 'https://www.worldbank.org/en/news/press-release/2025/06/27/fragile-and-conflict-affected-situations-intertwined-crises-multiple-vulnerabilities',
}
const WB_SP = {
  label: 'World Bank, State of Social Protection Report 2025',
  url: 'https://www.worldbank.org/en/topic/socialprotection/publication/state-of-social-protection-2025-2-billion-person-challenge',
}
const EGGER = {
  label: 'Egger, Haushofer, Miguel, Niehaus and Walker, General Equilibrium Effects of Cash Transfers, NBER w26600',
  url: 'https://www.nber.org/papers/w26600',
}
const ODA = { label: 'ONE Campaign on OECD preliminary 2025 aid data', url: 'https://www.one.org/press/latest-oecd-dac-oda-data/' }

export const extremePovertyTree: ConstraintTree = {
  problemSlug: 'extreme-poverty',
  outcome:
    'Nobody living below the extreme poverty line. In 2024 almost 700 million people, 8.5 percent of the world, lived on less than $2.15 a day. At the newer $3 line the World Bank counts 811 million in 2026.',
  whyUnsolved:
    'What remains is concentrated in countries with historically low growth and fragility. What remains is concentrated where they do not: countries with conflict or instability, where income per person has fallen 1.8 percent a year since 2020. At the 2024 pace, ending extreme poverty would take three decades or more. Safety nets that could help reach one person in four in low-income countries, and aid fell 23.1 percent in 2025. Judging conflict and fragility as most binding is our inference from the World Bank figures.',
  bindingId: 'conflict-fragility',
  updated: '2026-11-11',
  root: [
    {
      id: 'conflict-fragility',
      claim: 'Extreme poverty is concentrating in countries with conflict or instability, where incomes are falling.',
      kind: 'coordination',
      whyUnsolved:
        'The World Bank counts 39 such economies, 21 in active conflict. Their extreme poverty rate is nearly 40 percent at $3 a day, against 6 percent across developing economies overall. Income per person there has fallen 1.8 percent a year since 2020, while other developing economies grew 2.9 percent a year.',
      falsifier:
        'Extreme poverty in fragile and conflict-affected economies falls at the same pace as in other developing economies.',
      tested:
        'Looked for it and found the opposite. The World Bank projects the number in these economies rising from 421 million in 2025 to 435 million by 2030, close to six in ten of the world total.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Who delivers effectively inside fragile states, and what works there, was not researched this session.',
      },
      entryPoints: [
        { who: 'talent', action: 'Work on service delivery or payments in a fragile state with an organisation that already operates there.' },
        { who: 'capital', action: 'Fund programmes that can keep running through conflict, and require published results per household reached.' },
        { who: 'operator', action: 'If you deliver in a fragile state, publish cost per household reached so others can copy what works.' },
      ],
      sources: [WB_FCS],
    },
    {
      id: 'slow-growth',
      claim: 'Income growth per person in the poorest countries is too slow to end extreme poverty in this generation.',
      kind: 'policy',
      whyUnsolved:
        'The World Bank says extreme poverty is concentrated in countries with historically low growth and fragility, many in Sub-Saharan Africa. At the 2024 pace, eliminating poverty at $2.15 could take three decades or more, with 7.3 percent of people still below the line in 2030. It names slow growth, high debt, conflict and climate shocks as causes.',
      falsifier:
        'The number of people in extreme poverty keeps falling through 2030 without faster growth per person.',
      tested:
        'Not found. The World Bank overview says that without stronger per capita growth the number in extreme poverty will be higher in 2030 than today.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'What raises growth in a given low-income country is contested and was not researched this session.',
      },
      entryPoints: [
        { who: 'talent', action: 'Study what blocks firms from growing and hiring in one low-income country, and publish it.' },
        { who: 'capital', action: 'Invest in firms that create jobs in low-income countries, and report jobs and wages, not just returns.' },
      ],
      sources: [WB_PPP_2024, WB_OVERVIEW],
    },
    {
      id: 'safety-net-coverage',
      claim: 'Direct support works, but it does not reach most of the people who need it.',
      kind: 'delivery',
      whyUnsolved:
        'In low-income countries three in four people receive no social protection. Social assistance transfers equal 11 percent of the income of poor households there. At current rates, covering everyone in extreme poverty would take 18 years. Official aid fell 23.1 percent in real terms in 2025, and bilateral aid to Africa fell 23.9 percent.',
      falsifier:
        'Large cash transfers fail to raise local incomes, or mainly cause prices to rise.',
      tested:
        'Looked for it and did not find it. A randomised study in rural Kenya gave about 1,000 dollars to over 10,500 poor households across 653 villages. It estimated a local multiplier of 2.4, with large gains for neighbours who received nothing and minimal price inflation. One study in one country.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'high',
        why: 'Inference: with three in four people uncovered in low-income countries and aid falling, each added transfer reaches someone no programme reaches.',
      },
      entryPoints: [
        { who: 'capital', action: 'Fund direct cash transfers in a low-income country where coverage is lowest.' },
        { who: 'talent', action: 'Build identity and payment systems that let a government pay people directly at low cost.' },
        { who: 'operator', action: 'If you run a transfer programme, publish coverage of the poorest fifth, not just total recipients.' },
      ],
      sources: [WB_SP, EGGER, ODA],
    },
  ],
}
