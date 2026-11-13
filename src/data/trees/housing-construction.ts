// Constraint tree: why low-cost housing is not solved yet.
// Researched 2026-11-11. Every number below comes from a page opened that day.
// Inference is labelled as inference. Unknown stays unknown.

import type { ConstraintTree } from '../constraints'

const WCR_2026 = { label: 'UN-Habitat, World Cities Report 2026', url: 'https://unhabitat.org/world-cities-report-2026' }
const UN_NEWS_WCR = { label: 'UN News on the World Cities Report 2026, May 2026', url: 'https://news.un.org/en/story/2026/05/1167543' }
const UNHABITAT_HOUSING = { label: 'UN-Habitat, housing topic page', url: 'https://unhabitat.org/topic/housing' }
const GLAESER_GYOURKO = {
  label: 'Glaeser and Gyourko, The Economic Implications of Housing Supply, Journal of Economic Perspectives 2018',
  url: 'https://www.aeaweb.org/articles?id=10.1257/jep.32.1.3',
}
const AUCKLAND_2023 = {
  label: 'Greenaway-McGrevy, The Impact of Upzoning on Housing Construction in Auckland: Extensions and Updated Results, 2023',
  url: 'https://ideas.repec.org/p/cyc/wpaper/015.html',
}
const AUCKLAND_2025 = {
  label: 'Greenaway-McGrevy, Can zoning reform increase housing construction? Evidence from Auckland, 2025',
  url: 'https://econpapers.repec.org/RePEc:cyc:wpaper:017',
}
const GOOLSBEE_SYVERSON = {
  label: 'Goolsbee and Syverson, The Strange and Awful Path of Productivity in the U.S. Construction Sector, NBER w30845',
  url: 'https://www.nber.org/papers/w30845',
}

export const housingConstructionTree: ConstraintTree = {
  problemSlug: 'housing-construction',
  outcome:
    'Safe, adequate housing that people can afford. UN-Habitat now says up to 3.4 billion people lack it and more than 1 billion live in slums and informal settlements.',
  whyUnsolved:
    'Not the physics of building. In rich cities, rules on what may be built hold supply below demand, and where one city relaxed them, permits roughly doubled. In the US, measured construction productivity has fallen for decades. The global housing deficit grew from 251 million units in 2010 to 288 million in 2023, and UN-Habitat lists insufficient investment as one of four causes. Treating investment as the main gap in poor countries is our inference. Which constraint binds differs by place. Calling land-use rules the most binding is our inference from the cited studies, and it is best supported for high-cost cities.',
  bindingId: 'land-use-rules',
  updated: '2026-11-11',
  root: [
    {
      id: 'land-use-rules',
      claim: 'In high-cost cities, rules on what may be built keep housing supply below demand.',
      kind: 'regulatory',
      whyUnsolved:
        'Glaeser and Gyourko treat the gap between a home price and its production cost as a regulatory tax. They say the evidence suggests, but does not prove, that this tax often exceeds any harm new building causes. Inference: existing owners gain from scarcity, which may slow reform.',
      falsifier:
        'A city removes zoning limits on most of its residential land and new home permits do not rise compared with a credible counterfactual.',
      tested:
        'Looked for it and found the opposite. Auckland upzoned about three quarters of its residential land in 2016. A 2025 synthetic control study finds permits per person roughly doubled within five years. Seven years on, about 52,200 extra permits had been issued, 46 percent of the 112,300 issued in that period. One city, one research group. Effects on rents and prices were not checked this session.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Who is working on zoning reform, and where, was not researched this session.',
      },
      entryPoints: [
        { who: 'talent', action: 'Repeat the Auckland permit analysis for one other city that upzoned, and publish the data.' },
        { who: 'operator', action: 'If you run a planning department, publish permits per thousand residents each year, before and after any rule change.' },
        { who: 'capital', action: 'Fund independent before and after studies of zoning reforms, so each reform leaves evidence behind.' },
      ],
      sources: [GLAESER_GYOURKO, AUCKLAND_2023, AUCKLAND_2025],
    },
    {
      id: 'construction-productivity',
      claim: 'Building homes has not become more productive, so cost does not fall the way it does for manufactured goods.',
      kind: 'engineering',
      whyUnsolved:
        'Goolsbee and Syverson find a large, decades-long decline in measured US construction productivity. They conclude measurement error is probably not the whole story, and physical productivity in housebuilding is flat or falling. States with more productive builders do not gain market share, which they read as a sign of market frictions.',
      falsifier:
        'A factory-built or otherwise industrialised builder sustains lower cost per square metre than site-built homes in the same market, at scale, for several years.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Who is attempting industrialised construction, and their results, was not researched this session. No cost data from factory-built housing was opened.',
      },
      entryPoints: [
        { who: 'talent', action: 'Collect delivered cost per square metre from factory-built housing projects and compare it with site-built homes nearby.' },
        { who: 'capital', action: 'Before funding a construction technology, ask for delivered cost on completed homes, not factory capacity.' },
      ],
      sources: [GOOLSBEE_SYVERSON],
    },
    {
      id: 'low-income-investment',
      claim: 'In low-income cities, too little money goes into housing and basic services, so people house themselves informally.',
      kind: 'payment',
      whyUnsolved:
        'UN-Habitat attributes the crisis to decades of insufficient investment, rapid urbanisation, economic instability, and displacement by conflict and disasters. More than 1 billion people live in informal settlements and slums. The global deficit rose from 251 million units in 2010 to 288 million in 2023. UN-Habitat cites a need for 96,000 new affordable units every day.',
      falsifier:
        'Countries that raised public or private housing investment per person still saw slum populations grow at the same rate.',
      suppliers: ['UN-Habitat (promotes upgrading informal settlements in place)'],
      supplyState: 'thin',
      additionality: {
        level: 'unknown',
        why: 'The size of the investment gap in dollars, and who finances low-income housing, was not found this session.',
      },
      entryPoints: [
        { who: 'operator', action: 'Upgrade roads, sanitation and drainage in an informal settlement without evicting residents, and report the cost per household.' },
        { who: 'talent', action: 'Find the housing investment gap in dollars for one country, with a source, since no global figure was found here.' },
      ],
      sources: [WCR_2026, UN_NEWS_WCR, UNHABITAT_HOUSING],
    },
  ],
}
