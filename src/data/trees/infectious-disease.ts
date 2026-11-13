// Constraint tree for optimism.fun: why are malaria, TB and HIV not solved yet?
// Researched 2026-11-11. Every number below comes from a page opened this session.
// The three diseases are kept separate. Their numbers are never added together.
// Inference is labeled as inference. Unknown stays unknown.

import type { ConstraintTree } from '../constraints'

const WHO_MALARIA = {
  label: 'WHO malaria fact sheet (opened 2026-11-11)',
  url: 'https://www.who.int/news-room/fact-sheets/detail/malaria',
}
const UN_MALARIA = {
  label: 'UN News on the World Malaria Report 2025, 4 Dec 2025',
  url: 'https://news.un.org/en/story/2025/12/1166508',
}
const WHO_TB = {
  label: 'WHO tuberculosis fact sheet (opened 2026-11-11)',
  url: 'https://www.who.int/news-room/fact-sheets/detail/tuberculosis',
}
const WHO_TB_REPORT = {
  label: 'WHO news release on the Global Tuberculosis Report 2025, 12 Nov 2025',
  url: 'https://www.who.int/news/item/12-11-2025-global-gains-in-tuberculosis-response-endangered-by-funding-challenges',
}
const WHO_TB_SHEET = {
  label: 'WHO Global Tuberculosis Report 2025, information sheet',
  url: 'https://cdn.who.int/media/docs/default-source/global-tuberculosis-report-2025/global-tb-report-2025_factsheet.pdf',
}
const WHO_TB_MORTALITY = {
  label: 'WHO Global Tuberculosis Report 2025, TB mortality',
  url: 'https://www.who.int/teams/global-programme-on-tuberculosis-and-lung-health/tb-reports/global-tuberculosis-report-2025/tb-disease-burden/1-2-tb-mortality',
}
const WHO_HIV = {
  label: 'WHO HIV and AIDS fact sheet (opened 2026-11-11)',
  url: 'https://www.who.int/news-room/fact-sheets/detail/hiv-aids',
}
const UNAIDS_2026 = {
  label: 'UNAIDS press release, special report for AIDS 2026, 27 July 2026',
  url: 'http://www.unaids.org/en/resources/presscentre/pressreleaseandstatementarchive/2026/july/20260727_PR_UNAIDS_special_report_AIDS2026',
}

export const infectiousDiseaseTree: ConstraintTree = {
  problemSlug: 'infectious-disease',
  outcome:
    'Deaths from malaria, tuberculosis and HIV fall toward zero. WHO counts 610,000 malaria deaths in 2024, 1.23 million TB deaths in 2024 (including about 150,000 among people with HIV), and 570,000 HIV-related deaths in 2025. These are three separate counts and are not summed. The TB figures are from the WHO Global TB Report 2025; the WHO fact sheet has since moved to 2025 data (1.13 million deaths).',
  whyUnsolved:
    'Tools that work exist for all three: nets, tests, vaccines and drugs. They are paid for mostly by aid and by poor countries, and that money is far below what the plans need and fell further in 2025. Meanwhile parasites and bacteria are evolving resistance to the drugs, and many sick people are never found.',
  bindingId: 'financing',
  updated: '2026-11-11',
  root: [
    {
      id: 'financing',
      claim: 'The money to deliver tools that already work is far below what is needed, and it is falling.',
      kind: 'payment',
      whyUnsolved:
        'Malaria: US$3.9 billion was invested in 2024, 42 percent of the US$9.3 billion target. TB: US$5.9 billion was available in 2024, just over a quarter of the US$22 billion annual target for 2027. HIV: international financing fell from US$8.8 billion in 2024 to US$7.3 billion in 2025, a drop UNAIDS reports as 18 percent. Inference: the people at risk cannot pay, so there is no market to fill the gap. Calling this the binding constraint is our inference.',
      falsifier:
        'Deaths keep falling at the earlier pace through 2025 and 2026 despite the cuts. Or countries with full funding still fail to cut deaths.',
      tested:
        'Partly. Malaria deaths rose from 598,000 in 2023 to 610,000 in 2024 with funding under half of target, which fits the claim. TB deaths fell 3 percent from 2023 to 2024 with funding at about a quarter of target, which does not fit it neatly. Modelling studies cited by WHO warn that long-term donor cuts could cause up to 2 million more TB deaths from 2025 to 2035. Measured effects of the 2025 cuts were not found.',
      suppliers: [
        'National governments (82 percent of TB spending in 2024 was domestic, per the WHO Global TB Report 2025 information sheet)',
        'International donors',
        'The Global Fund',
      ],
      supplyState: 'thin',
      additionality: {
        level: 'high',
        why: 'Inference: the tools are proven, so each dollar of delivery funding has a known use. The gap is measured in billions.',
      },
      entryPoints: [
        { who: 'capital', action: 'Give to a delivery programme with published cost per outcome, such as bednet or TB treatment distribution.' },
        { who: 'talent', action: 'For one country, compare 2024 and 2025 budgets for malaria, TB and HIV and publish what was cut.' },
        { who: 'operator', action: 'If you work in a health ministry, cost the minimum package for each disease so domestic budgets can be argued for.' },
      ],
      sources: [UN_MALARIA, WHO_MALARIA, WHO_TB_REPORT, WHO_TB, WHO_TB_SHEET, WHO_TB_MORTALITY, UNAIDS_2026],
      children: [
        {
          id: 'hiv-prevention-cuts',
          claim: 'HIV prevention depends heavily on aid and has been cut deeply.',
          kind: 'payment',
          whyUnsolved:
            'Sub-Saharan Africa got 80 percent of its prevention funding from international aid. Condom funding was cut by more than 90 percent in some countries. A 2026 study in 47 countries found a 50 percent drop in community-led support for prevention medicines and care. 1.2 million people acquired HIV in 2025.',
          falsifier: 'New infections do not rise in the countries with the deepest prevention cuts.',
          tested: 'UNAIDS reports new infections rose in three regions and 21 countries. It does not show that the cuts caused each rise.',
          suppliers: ['Unitaid and the Global Fund (lenacapavir access)', 'Community-led organizations'],
          supplyState: 'thin',
          additionality: {
            level: 'high',
            why: 'Inference: UNAIDS estimates 20 million people need drug-based prevention, and the lenacapavir programme reaches a few thousand.',
          },
          entryPoints: [
            { who: 'capital', action: 'Fund a community-led prevention service that lost its grant in 2025.' },
          ],
          sources: [UNAIDS_2026, WHO_HIV],
        },
      ],
    },
    {
      id: 'case-finding',
      claim: 'Many sick people are never found, tested or put on the right treatment.',
      kind: 'delivery',
      whyUnsolved:
        'TB: 8.3 million of an estimated 10.7 million people who fell ill in 2024 were diagnosed and treated, about 78 percent. Rapid tests were used for 54 percent. About 2 in 5 people with drug-resistant TB accessed treatment. HIV: about 9 million of 41 million people living with HIV were not on treatment in 2025, and almost half of children with HIV lacked it.',
      falsifier: 'Deaths occur mainly among people who were diagnosed and treated correctly.',
      tested:
        'Not tested directly. Treatment success for drug-susceptible TB is 88 percent, which suggests that people who are found and treated mostly do well. Deaths split by treated and untreated were not found.',
      suppliers: ['National TB and HIV programmes', 'WHO'],
      supplyState: 'contested',
      additionality: {
        level: 'medium',
        why: 'Inference: national programmes already do this work. A new team helps where it finds people the programme misses.',
      },
      entryPoints: [
        { who: 'operator', action: 'Add TB symptom screening and referral to a service that already sees high-risk adults.' },
        { who: 'talent', action: 'Build a simple tool that tracks people from a positive TB test to treatment start in one district.' },
      ],
      sources: [WHO_TB_REPORT, WHO_TB, WHO_TB_SHEET, UNAIDS_2026],
    },
    {
      id: 'resistance',
      claim: 'The parasites, bacteria and mosquitoes are evolving past the current tools.',
      kind: 'science',
      whyUnsolved:
        'Partial artemisinin resistance is confirmed in Eritrea, Rwanda, Uganda and Tanzania, and suspected in four more African countries. Parasites that evade rapid tests were reported in 42 countries in 2024. Mosquitoes are becoming resistant to insecticides. TB research got US$1.2 billion in 2023, 24 percent of the US$5 billion target.',
      falsifier: 'New drugs, tests and vaccines arrive faster than resistance spreads.',
      tested:
        'Mixed. The pipeline is growing: 29 TB drugs were in trials in August 2025, up from 8 in 2015, and 18 TB vaccine candidates were in trials, 6 in Phase 3. Two malaria vaccines are in routine use in Africa. Whether this outpaces resistance is unknown.',
      suppliers: ['Medicines for Malaria Venture', 'TB vaccine and drug developers (not named in the sources opened)'],
      supplyState: 'thin',
      additionality: {
        level: 'medium',
        why: 'Inference: research funding is a quarter of target for TB, so added research money has room to matter.',
      },
      entryPoints: [
        { who: 'capital', action: 'Fund a not-for-profit product developer working on a new antimalarial or TB regimen.' },
        { who: 'talent', action: 'Join resistance surveillance or trial work in a country where resistance is confirmed.' },
      ],
      sources: [WHO_MALARIA, UN_MALARIA, WHO_TB, WHO_TB_REPORT],
    },
  ],
}
