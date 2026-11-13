// Constraint tree for optimism.fun: why is moving money not nearly free for everyone yet?
// Researched 2026-11-11. Every number below was read on a page opened this session.
// Inference is labeled as inference. Secondary figures are labeled as secondary.

import type { ConstraintTree } from '../constraints'

const UN_SDG10 = {
  label: 'UN Sustainable Development Goals Report 2025, Goal 10 (remittance costs)',
  url: 'https://unstats.un.org/sdgs/report/2025/goal-10/',
}
const FSB_PRESS = {
  label: 'Financial Stability Board press release on cross-border payments progress (9 Oct 2025)',
  url: 'https://www.fsb.org/2025/10/fsb-calls-for-enhanced-policy-implementation-to-achieve-tangible-improvements-in-cross-border-payments/',
}
const FSB_REPORT = {
  label: 'FSB, G20 Roadmap for Cross-border Payments: Consolidated progress report for 2025',
  url: 'https://www.fsb.org/2025/10/g20-roadmap-for-cross-border-payments-consolidated-progress-report-for-2025/',
}
const PAYPERS = {
  label: 'The Paypers explainer on the G20 cross-border payment targets (secondary, cites FXC Intelligence)',
  url: 'https://thepaypers.com/payments/explainers/understanding-the-g20-cross-border-payments-targets',
}
const FINDEX_PRESS = {
  label: 'World Bank press release on Global Findex 2025 (16 July 2025)',
  url: 'https://www.worldbank.org/en/news/press-release/2025/07/16/mobile-phone-technology-powers-saving-surge-in-developing-economies',
}
const FINDEX = {
  label: 'World Bank, Global Findex 2025',
  url: 'https://www.worldbank.org/en/publication/globalfindex',
}
const BIS_PIX = {
  label: 'BIS Bulletin No. 52, lessons from Brazil\'s Pix (23 March 2022)',
  url: 'https://www.bis.org/publ/bisbull52.htm',
}
const NILSON = {
  label: 'Nilson Report, Merchant Processing Fees in the United States, 2025',
  url: 'https://nilsonreport.com/articles/merchant-processing-fees-in-the-united-states-2025/',
}

export const financialInfrastructureTree: ConstraintTree = {
  problemSlug: 'financial-infrastructure',
  outcome:
    'Anyone can send or receive money at a cost near zero. In the second quarter of 2024, sending $200 across a border cost 6.7 percent on average, and 1.3 billion adults have no account.',
  whyUnsolved:
    'Inside one country a public instant rail can move fast: Brazil signed up 67 percent of adults in about a year. That is one country, and no merchant cost data was read. Between countries it is not. A cross-border payment passes through two domestic systems, two sets of rules and often a chain of banks, and no single body can change all of them. The G20 has agreed the policy, and the Financial Stability Board says satisfactory improvement by the 2027 timetable is unlikely. Most of the remaining unbanked already own a phone. Inference: for them the gap is identity and rules, not hardware.',
  bindingId: 'cross-border',
  updated: '2026-11-11',
  root: [
    {
      id: 'cross-border',
      claim: 'Sending money across a border still costs several percent because no one owns the whole route.',
      kind: 'coordination',
      whyUnsolved:
        'The global average cost of sending $200 was 6.7 percent in the second quarter of 2024, up from 6.2 percent a year earlier and more than double the 3 percent UN target. Banks were the most expensive channel at 13.4 percent. Digital transfers averaged 5.3 percent and non-digital 7.2 percent, but digital was only 30 percent of transactions. The first and last mile of each payment run on domestic rails, so every corridor needs two countries to act. Binding choice is inference.',
      falsifier:
        'Costs fall to the 3 percent target on the current G20 roadmap without new rails or new entrants. Or costs stay high in corridors where both ends already have open instant payment systems.',
      tested:
        'Supports the claim. The Financial Stability Board said in October 2025 that satisfactory improvement in line with the 2027 timetable is unlikely, that 2025 indicators show only slight improvement since 2023, and that the average global cost of remittances remains sticky, with some improvement in the most expensive regions. It also said most roadmap actions are complete but have not yet reached end users. Inference: policy design is done and delivery is the gap. A secondary source citing FXC Intelligence puts 35.4 percent of payments within one hour against a 75 percent target. Not tested: costs in corridors that link two instant payment systems.',
      suppliers: [
        'Financial Stability Board',
        'BIS Committee on Payments and Market Infrastructures',
        'Financial Action Task Force',
      ],
      supplyState: 'contested',
      additionality: {
        level: 'medium',
        why: 'Inference: public bodies have set the rules. A new team likely adds most in high-cost corridors. The FSB pages read report costs by region, not by corridor.',
      },
      entryPoints: [
        { who: 'talent', action: 'Pick one corridor that costs above 5 percent and break the fee into exchange margin, compliance and payout, with sources.' },
        { who: 'operator', action: 'If you run a payment provider, show total cost and delivery time before the customer pays, as the G20 transparency target asks.' },
        { who: 'capital', action: 'Back a provider in one high-cost corridor that publishes its all-in price against the 3 percent target.' },
      ],
      sources: [UN_SDG10, FSB_PRESS, FSB_REPORT, PAYPERS],
    },
    {
      id: 'unbanked',
      claim: '1.3 billion adults have no account, and most of them already own a phone.',
      kind: 'delivery',
      whyUnsolved:
        'Account ownership reached 79 percent of adults, up from 50 percent in 2011. Of the 1.3 billion without one, about 900 million own a mobile phone and 530 million own a smartphone. The World Bank president lists the ingredients it is working on: digital IDs, digital cash-transfer programmes, modern payment systems and fewer regulatory roadblocks. Inference: those are largely state functions, which a company cannot supply alone.',
      falsifier:
        'Countries that issue digital IDs and allow mobile money still see no rise in account ownership among phone owners. Or most unbanked adults say they do not want an account.',
      tested:
        'Partly tested. Looked for whether the device is the limit. It is not for most: about 900 million of the 1.3 billion own a phone. That leaves about 400 million without one, by subtraction, which is our arithmetic and not a World Bank figure. Not tested: why phone owners stay unbanked, or how many do not want an account.',
      suppliers: ['World Bank (Global Findex measurement and policy advice)'],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Mobile money operators and digital ID programmes were not researched by name this session.',
      },
      entryPoints: [
        { who: 'talent', action: 'For one country, find what share of unbanked phone owners lack an ID that a provider can accept.' },
        { who: 'operator', action: 'If you run a mobile money service, publish how many sign-ups fail at the identity check and why.' },
      ],
      sources: [FINDEX_PRESS, FINDEX],
    },
    {
      id: 'domestic-rails',
      claim: 'Where no open instant rail exists, everyday payments run largely on cards. What merchants pay was not read this session.',
      kind: 'policy',
      whyUnsolved:
        'Brazil\'s Pix signed up 67 percent of adults in little over a year after its November 2020 launch, with free payments between people and low charges for merchants. The BIS credits two choices: large banks were required to join, and the central bank both ran the rail and set the rules. Those are decisions only a public authority can make. In the United States, card purchase volume was $12.498 trillion in 2025, up 5.0 percent.',
      falsifier:
        'Countries with a public instant rail see no fall in what merchants pay to accept payments. Or card volume keeps growing at the same rate after such a rail launches.',
      tested:
        'Not tested with fee data. The BIS page says Pix merchant charges are low but gives no figure. The US merchant fee total sits behind the Nilson paywall and was not read this session. No comparison of merchant cost before and after an instant rail was opened.',
      suppliers: ['Central Bank of Brazil (Pix)'],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Not researched which countries have launched or planned instant rails, or how stablecoin rails compare on merchant cost.',
      },
      entryPoints: [
        { who: 'talent', action: 'Compare what merchants pay per payment before and after an instant rail launched in one country, from central bank data.' },
        { who: 'operator', action: 'If you are a merchant or processor, publish your accept cost by rail so the gap can be measured.' },
        { who: 'capital', action: 'Back a merchant acceptance product built on an existing instant rail in a country where the rail is open to non-banks.' },
      ],
      sources: [BIS_PIX, NILSON],
    },
  ],
}
