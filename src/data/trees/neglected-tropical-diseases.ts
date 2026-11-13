// Constraint tree for optimism.fun: why are neglected tropical diseases not solved yet?
// Researched 2026-11-11. Every number below comes from a page opened this session.
// Inference is labeled as inference. Unknown stays unknown.

import type { ConstraintTree } from '../constraints'

const WHO_NTD_REPORT = {
  label: 'WHO Global report on neglected tropical diseases 2025',
  url: 'https://www.who.int/teams/control-of-neglected-tropical-diseases/global-report-on-neglected-tropical-diseases-2025',
}
const WHO_RLM_2023 = {
  label: 'WHO, Global partners pledge US$777 million to combat neglected tropical diseases (4 Dec 2023)',
  url: 'https://www.who.int/news/item/04-12-2023-global-partners-pledge-usd777-million-to-combat-neglected-tropical-diseases',
}
const WHO_ODA = {
  label: 'WHO: neglected tropical diseases further neglected due to ODA cuts, 4 June 2025',
  url: 'https://www.who.int/news/item/04-06-2025-neglected-tropical-diseases-further-neglected-due-to-oda-cuts',
}

export const ntdTree: ConstraintTree = {
  problemSlug: 'neglected-tropical-diseases',
  outcome:
    'Nobody needs treatment for a neglected tropical disease. In 2023 an estimated 1.495 billion people required interventions, 32 percent below the 2010 baseline. WHO targets 100 countries eliminating at least one NTD by 2030; 56 had by May 2025.',
  whyUnsolved:
    'The medicines exist and are mostly donated free. What is missing is the money and staff to hand them out. Aid for NTDs fell 41 percent between 2018 and 2023, and in 2025 the United States, which had given US$1.4 billion over about two decades, withdrew its funding. Tablets that were already made are at risk of expiring in warehouses.',
  bindingId: 'delivery-financing',
  updated: '2026-11-11',
  root: [
    {
      id: 'delivery-financing',
      claim: 'The money that pays to deliver free medicines is shrinking.',
      kind: 'payment',
      whyUnsolved:
        'Official development assistance for NTDs fell 41 percent between 2018 and 2023. The UK ended its Ascend programme in 2021. In 2025 the United States withdrew funding from NTD projects after about two decades and US$1.4 billion of support. Inference: patients are poor, so no market replaces the aid. Calling this the binding constraint is our inference.',
      falsifier:
        'Treatment numbers hold steady or rise through 2025 and 2026 despite the cuts, because countries or other donors fill the gap.',
      tested:
        'Our reading: early evidence is consistent with the claim. WHO reported 47 delayed campaigns that were to treat 143 million people, and said missed 2025 campaigns and impact surveys will postpone 2030 targets in at least 10 more countries. Against it: US$777 million was pledged at the December 2023 Reaching the Last Mile Forum, and 14 African countries had sustainability plans by 2024. Treatment counts for 2025 were not found.',
      suppliers: [
        'USAID (withdrawn in 2025)',
        'Reaching the Last Mile Forum pledgers',
        'National NTD programmes',
      ],
      supplyState: 'thin',
      additionality: {
        level: 'high',
        why: 'Inference: the medicines are already donated, so money for delivery turns directly into people treated.',
      },
      entryPoints: [
        { who: 'capital', action: 'Fund one delayed mass drug administration campaign in a named country through an existing NTD programme.' },
        { who: 'talent', action: 'List the 47 delayed campaigns by country and disease, and track which have since run.' },
        { who: 'operator', action: 'If you run health campaigns in an endemic country, offer to carry NTD tablets on an existing round.' },
      ],
      sources: [WHO_ODA, WHO_NTD_REPORT, WHO_RLM_2023],
    },
    {
      id: 'last-mile',
      claim: 'Donated medicines do not reach everyone who needs them.',
      kind: 'delivery',
      whyUnsolved:
        'About 12 manufacturers donated 19 types of NTD medicines as of 2024, and 1.8 billion tablets and vials were delivered to countries that year. In 2023, 867.1 million people were treated for at least one NTD, while 1.495 billion required interventions. These two figures are not the same measure, so we do not compute a coverage rate from them. WHO warned that over 55 million tablets in Africa could expire by the end of 2025 without another way to deliver them.',
      falsifier: 'Medicines are short at the factory, so supply and not delivery limits treatment.',
      tested:
        'The evidence found points the other way. Donations since 2011 are valued at over US$12 billion, and the risk WHO named in 2025 was tablets expiring unused, not a shortage of tablets.',
      suppliers: [
        'Bayer',
        'Eisai',
        'Gilead Sciences',
        'GSK',
        'Johnson & Johnson',
        'Merck KGaA',
        'MSD',
        'Novartis',
        'Pfizer',
        'Sanofi',
        'WHO (procurement and logistics)',
      ],
      supplyState: 'contested',
      additionality: {
        level: 'medium',
        why: 'Inference: drug supply is covered by donors. A new team adds value in distribution, not in making tablets.',
      },
      entryPoints: [
        { who: 'operator', action: 'Combine NTD treatment with another campaign already reaching the same villages.' },
        { who: 'talent', action: 'Find where donated tablets are stocked and close to expiry in one country, and report it to the programme.' },
      ],
      sources: [WHO_NTD_REPORT, WHO_ODA],
    },
    {
      id: 'transmission',
      claim: 'Medicines alone may not be enough where water, sanitation and vector control lag. This is our inference.',
      kind: 'policy',
      whyUnsolved:
        'The WHO 2025 report says progress slowed or stalled on deaths from vector-borne diseases and on access to water, sanitation and hygiene. In 2024 dengue was a grade 3 emergency, with over 14 million cases and 10,000 deaths reported across 107 countries.',
      falsifier: 'Countries eliminate NTDs with drug campaigns alone, with no change in water, sanitation or vector control.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: { level: 'unknown', why: 'Not researched who funds water, sanitation or vector control for NTDs, or how much.' },
      entryPoints: [
        { who: 'talent', action: 'For one country that eliminated an NTD, document what besides medicines was done.' },
        { who: 'capital', action: 'Unknown until the question above is answered. Do not fund on this node yet.' },
      ],
      sources: [WHO_NTD_REPORT, WHO_ODA],
    },
  ],
}
