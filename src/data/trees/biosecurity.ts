// Constraint tree: why pandemic preparedness is not solved yet.
// Researched 2026-11-11. Every number below comes from a page opened that day.
// Scope is public policy and preparedness only: detection, countermeasure access and governance.
// Inference is labelled as inference. Unknown stays unknown.

import type { ConstraintTree } from '../constraints'

const CEPI = { label: 'CEPI, the 100 Days Mission', url: 'https://cepi.net/cepi-20-and-100-days-mission' }
const GPMB_2026 = {
  label: 'Global Preparedness Monitoring Board, A World on the Edge, 18 May 2026',
  url: 'https://gpmb.org/news/news/item/18-05-2026-the-world-is-on-the-edge-of-even-greater-pandemic-damage',
}
const GPMB_2025 = {
  label: 'Global Preparedness Monitoring Board, 2025 report release, 13 October 2025',
  url: 'https://gpmb.org/news/news/item/13-10-2025-global-health-security-hangs-in-the-balance-in-a-volatile-and-uncertain-world-report-emphasizes',
}
const WHO_AGREEMENT = {
  label: 'WHO, World Health Assembly adopts Pandemic Agreement, 20 May 2025',
  url: 'https://www.who.int/news/item/20-05-2025-world-health-assembly-adopts-historic-pandemic-agreement-to-make-the-world-more-equitable-and-safer-from-future-pandemics',
}
const WHO_PABS = {
  label: 'WHO, Member States agree to extend negotiations on the PABS annex, 1 May 2026',
  url: 'https://www.who.int/news/item/01-05-2026-who-member-states-agree-to-extend-negotiations-on-pathogen-access-and-benefit-sharing-annex',
}
const WHO_FIF = {
  label: 'WHO, statement on a financial intermediary fund for pandemic preparedness, 19 April 2022',
  url: 'https://www.who.int/news/item/19-04-2022-delivering-on-the-g20-leaders-commitment-to-build-an-equitable-and-effective-financial-intermediary-fund-%28fif%29-for-pandemic-preparedness-and-response-%28ppr%29',
}
const ODA = { label: 'ONE Campaign on OECD preliminary 2025 aid data', url: 'https://www.one.org/press/latest-oecd-dac-oda-data/' }

export const biosecurityTree: ConstraintTree = {
  problemSlug: 'biosecurity',
  outcome:
    'A new pandemic threat is detected early and safe vaccines, tests and treatments reach every country fast. The stated target is a vaccine within about 100 days. For COVID-19 the first vaccines took 326 days.',
  whyUnsolved:
    'The first COVID-19 vaccines arrived in under a year. The failure was reach: getting them, and later mpox vaccines, to poorer countries took far longer. The Pandemic Agreement meant to fix this was adopted in 2025 but cannot open for signature until an unfinished annex on sharing is agreed. Overall aid is falling: official development assistance fell 23.1 percent in real terms in 2025. The monitoring board says risk is outpacing investment. Judging countermeasure access as most binding is our inference from its findings.',
  bindingId: 'countermeasure-access',
  updated: '2026-11-11',
  root: [
    {
      id: 'countermeasure-access',
      claim: 'Vaccines, tests and treatments get made, but reach poorer countries too late to change the outcome.',
      kind: 'coordination',
      whyUnsolved:
        'The Global Preparedness Monitoring Board says the world is moving backwards on equitable access. Mpox vaccines reached affected low-income countries almost two years after the outbreak began. COVID-19 vaccines took 17 months. CEPI says no single organisation, country or region can meet the 100 day goal alone, and that it needs changes in the organisation, governance and financing of preparedness.',
      falsifier:
        'In an outbreak after COVID-19, vaccines reach affected low-income countries faster than the 17 months COVID-19 vaccines took.',
      tested:
        'Looked for it and found the opposite. The mpox response was slower than COVID-19, by the monitoring board account. One comparison, from one source.',
      suppliers: ['CEPI (100 Days Mission)', 'WHO Member States (Pandemic Agreement negotiations)'],
      supplyState: 'thin',
      additionality: {
        level: 'medium',
        why: 'Inference: the gap is agreements and regional capacity more than invention, so the useful additions are specific, such as regional production or pre-agreed supply contracts.',
      },
      entryPoints: [
        { who: 'capital', action: 'Fund regional vaccine and diagnostics manufacturing with pre-agreed supply terms for low-income countries.' },
        { who: 'talent', action: 'Work on regulatory and supply chain readiness at a regional health agency or vaccine coalition.' },
        { who: 'operator', action: 'If you make vaccines or tests, publish in advance what share of output you will allocate by public health need.' },
      ],
      sources: [GPMB_2026, CEPI],
      children: [
        {
          id: 'sharing-annex',
          claim: 'The agreement that would set access rules is adopted but cannot yet be signed.',
          kind: 'policy',
          whyUnsolved:
            'The World Health Assembly adopted the Pandemic Agreement on 20 May 2025. It opens for signature only after an annex on pathogen access and benefit sharing is adopted, and needs 60 ratifications to take effect. Under the sharing system, participating manufacturers would target 20 percent of real-time production for WHO. On 1 May 2026 Member States agreed more time was needed, with the outcome due at the May 2027 Assembly or an earlier special session in 2026.',
          falsifier: 'The annex is adopted and 60 countries ratify the agreement.',
          tested: 'Not yet. As of the 1 May 2026 WHO release there was no agreed text. Later developments were not opened this session.',
          suppliers: ['WHO Intergovernmental Working Group on the Pandemic Agreement'],
          supplyState: 'contested',
          additionality: {
            level: 'low',
            why: 'Inference: this is a negotiation between governments, and an outside team has little direct influence on it.',
          },
          entryPoints: [
            { who: 'talent', action: 'Track and publish plain summaries of each negotiating round so national debates use accurate facts.' },
          ],
          sources: [WHO_AGREEMENT, WHO_PABS],
        },
      ],
    },
    {
      id: 'early-warning',
      claim: 'There is no permanent, independent system that watches pandemic risk and readiness in real time.',
      kind: 'coordination',
      whyUnsolved:
        'The monitoring board called in 2025 for a system that tracks threats, vulnerabilities and preparedness in real time, and in 2026 made a permanent independent monitor its first priority. The board itself concludes its mandate in 2026. CEPI also lists stronger disease surveillance and early warning as needs for the 100 day goal.',
      falsifier:
        'A standing, independently run monitoring system is funded and publishing, and outbreaks are still detected late.',
      suppliers: ['Global Preparedness Monitoring Board (mandate ends 2026)'],
      supplyState: 'thin',
      additionality: {
        level: 'unknown',
        why: 'National and regional surveillance programmes were not researched this session, so current coverage is unknown.',
      },
      entryPoints: [
        { who: 'capital', action: 'Fund an independent body to continue public preparedness monitoring after the current board closes.' },
        { who: 'talent', action: 'Join a public health agency working on outbreak surveillance and reporting.' },
      ],
      sources: [GPMB_2025, GPMB_2026, CEPI],
    },
    {
      id: 'preparedness-finance',
      claim: 'Preparedness has an estimated funding gap, and overall aid is now falling.',
      kind: 'payment',
      whyUnsolved:
        'In 2022 WHO and the World Bank estimated a 10.5 billion dollar annual gap in preparedness financing. Aid has since fallen: OECD preliminary data show official development assistance down 23.1 percent in real terms in 2025, the largest annual decline recorded, with a further fall projected for 2026. The monitoring board says development assistance is at levels not seen since 2009.',
      falsifier:
        'International preparedness funding rises to close the estimated gap while overall aid falls.',
      tested:
        'Not found. The gap estimate is from 2022 and no updated figure was opened. Total grants from the fund created in response were not verified this session.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'high',
        why: 'Inference: with aid falling by nearly a quarter in one year, new money for preparedness is unlikely to displace existing money.',
      },
      entryPoints: [
        { who: 'capital', action: 'Give multi-year funding for preparedness that does not depend on an active emergency.' },
        { who: 'talent', action: 'Update the 2022 financing gap estimate using current aid data, and publish the method.' },
      ],
      sources: [WHO_FIF, ODA, GPMB_2026],
    },
  ],
}
