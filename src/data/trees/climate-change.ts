// Constraint tree: why climate change is not solved yet.
// Researched 2026-11-11. Every number below comes from a page opened that day.
// Inference is labelled as inference. Unknown stays unknown.
// Emissions totals differ by definition: the Global Carbon Project counts fossil CO2,
// the IEA counts energy-related CO2 including industrial processes. They are not mixed.

import type { ConstraintTree } from '../constraints'

const IEA_GER = { label: 'IEA, Global Energy Review 2025, CO2 emissions', url: 'https://www.iea.org/reports/global-energy-review-2025/co2-emissions' }
const GCB_2025 = {
  label: 'Future Earth, Global Carbon Budget 2025 release',
  url: 'https://futureearth.org/global-carbon-budget-fossil-fuel-emissions-set-new-record-in-2025/',
}
const IEA_WEI = { label: 'IEA, World Energy Investment 2025, executive summary', url: 'https://www.iea.org/reports/world-energy-investment-2025/executive-summary' }
const IEA_STEEL_CEMENT = {
  label: 'IEA, Demand and Supply Measures for the Steel and Cement Transition, executive summary',
  url: 'https://www.iea.org/reports/demand-and-supply-measures-for-the-steel-and-cement-transition/executive-summary',
}
const CAT = { label: 'Climate Action Tracker, emissions pathways, updated 13 November 2025', url: 'https://climateactiontracker.org/global/emissions-pathways/' }

export const climateChangeTree: ConstraintTree = {
  problemSlug: 'climate-change',
  outcome:
    'Global CO2 emissions falling fast enough to limit warming, with energy still cheap. Today they are still rising: fossil CO2 was projected to reach a record 38.1 billion tonnes in 2025.',
  whyUnsolved:
    'Clean power is cheap and already cuts emissions in rich countries. In 2024 emissions fell 1.1 percent in advanced economies and rose 1.5 percent in emerging and developing ones, where energy demand is growing and capital is expensive. Steel and cement have almost no clean capacity on order. Current policies point to about 2.6C of warming. Judging the emerging-economy build as most binding is our inference from these figures.',
  bindingId: 'emerging-economy-build',
  updated: '2026-11-11',
  root: [
    {
      id: 'emerging-economy-build',
      claim: 'Emissions rise where energy demand is growing fastest, because clean build there has not yet outpaced demand.',
      kind: 'delivery',
      whyUnsolved:
        'Energy-related CO2 hit 37.8 Gt in 2024, up 0.8 percent. Emerging and developing economies rose 1.5 percent (375 Mt) while advanced economies fell 1.1 percent (120 Mt). Solar, wind, nuclear, electric cars and heat pumps now avoid about 2.6 Gt a year, roughly 7 percent of the total. That is real, but it is being added on top of growing demand.',
      falsifier:
        'Emissions in the large emerging economies stop growing while their economies keep growing.',
      tested:
        'Partly found. China grew only 0.4 percent in both the IEA 2024 data and the Global Carbon Budget 2025 projection. India slowed from 5.3 percent (IEA, 2024) to a projected 1.4 percent (Global Carbon Budget, 2025), though the two sources define emissions differently. 35 countries now cut emissions while growing, twice as many as a decade ago. The global total still set a record. A reported 2026 projection was seen in one press article and not verified, so it is not used.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Who builds and finances clean power in each emerging economy was not researched this session.',
      },
      entryPoints: [
        { who: 'talent', action: 'Work on clean power and grid projects in an emerging economy where demand is still growing.' },
        { who: 'capital', action: 'Finance clean generation and grids in emerging and developing economies outside China.' },
        { who: 'operator', action: 'Publish delivered clean MWh per dollar for each project so lenders can compare risk.' },
      ],
      sources: [IEA_GER, GCB_2025],
      children: [
        {
          id: 'cost-of-capital',
          claim: 'Clean projects in poorer countries pay more for capital and receive little of the investment.',
          kind: 'payment',
          whyUnsolved:
            'Of USD 3.3 trillion in energy investment in 2025, about USD 2.2 trillion is clean. Africa gets 2 percent of clean energy investment with 20 percent of world population. International public finance supplies about 7 percent, roughly USD 32 billion a year, of clean investment in emerging and developing economies outside China. The IEA says currency depreciation and higher interest rates have made debt harder to access, especially in Africa.',
          falsifier:
            'Africa or other low-income regions raise their share of clean energy investment without any fall in their cost of capital.',
          suppliers: [],
          supplyState: 'unresearched',
          additionality: {
            level: 'high',
            why: 'Inference: where a region with a fifth of the population gets 2 percent of the investment, added capital is unlikely to displace existing capital.',
          },
          entryPoints: [
            { who: 'capital', action: 'Offer currency hedges or first-loss cover that lower the cost of debt for clean projects in Africa.' },
            { who: 'talent', action: 'Measure the actual cost of capital paid by clean projects in one country and publish it.' },
          ],
          sources: [IEA_WEI],
        },
      ],
    },
    {
      id: 'heavy-industry',
      claim: 'Steel and cement have almost no near-zero capacity on order, because the clean product costs more and few buyers commit.',
      kind: 'engineering',
      whyUnsolved:
        'Steel and cement produce 14 percent of global energy and process emissions. Announced near-zero capacity for 2030 is about 10 Mt of steel and 35 Mt of cement, roughly 10 percent of what a net-zero pathway needs that year. Early production costs 10 to 125 percent more than conventional. Disclosed offtake deals for near-zero steel cover a little under 2 Mt a year by 2030. The IEA names cost as the largest barrier.',
      falsifier:
        'Announced near-zero steel and cement capacity for 2030 reaches the net-zero pathway level, or the cost premium falls below 10 percent.',
      tested:
        'Not found. The IEA reports progress has not advanced at the speed and scale needed. Named producers were not researched.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'medium',
        why: 'Inference: 40 percent of cement plants face a reinvestment decision around 2030 and 15 percent of steel around 2035, so a credible buyer or technology now can shift a plant for decades.',
      },
      entryPoints: [
        { who: 'operator', action: 'If you buy steel or cement at volume, sign a multi-year offtake for near-zero product.' },
        { who: 'capital', action: 'Fund a first commercial near-zero cement or steel plant that already has a signed buyer.' },
        { who: 'talent', action: 'Join a process engineering team working to cut the cost premium of near-zero steel or cement.' },
      ],
      sources: [IEA_STEEL_CEMENT],
    },
    {
      id: 'policy-gap',
      claim: 'National policies and targets do not add up to the stated temperature goals.',
      kind: 'policy',
      whyUnsolved:
        'Climate Action Tracker projects about 2.6C of warming by 2100 under current policies, and the same under 2030 and 2035 targets alone. Even its optimistic scenario has a median of 1.9C. The Global Carbon Budget puts the remaining budget for 1.5C at 170 billion tonnes of CO2, about four years of current emissions.',
      falsifier:
        'An update of the same tracker shows current policies, not just pledges, consistent with warming below 2C.',
      tested:
        'Not found as of the 13 November 2025 update. A later update was not found this session. The UNEP Emissions Gap Report 2025 could not be opened and is not cited.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Policy work; who is moving which national policy was not researched.',
      },
      entryPoints: [
        { who: 'talent', action: 'Track one country: compare its enacted policies with its stated target and publish the gap each year.' },
        { who: 'operator', action: 'If you run a utility or city, set a dated target that enacted rules, not pledges, will meet.' },
      ],
      sources: [CAT, GCB_2025],
    },
  ],
}
