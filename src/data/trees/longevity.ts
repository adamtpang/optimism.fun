// Constraint tree for optimism.fun: why is aging not treatable yet?
// Researched 2026-11-11. Every number below comes from a page opened this session.
// This tree rests on few sources and one worked example (the TAME trial). Inference is labeled.

import type { ConstraintTree } from '../constraints'

const NPR_TAME = {
  label: 'NPR via WUNC: a cheap drug may slow down aging, 22 April 2024 (TAME trial)',
  url: 'https://www.wunc.org/2024-04-22/a-cheap-drug-may-slow-down-aging-a-study-will-determine-if-it-works',
}
const MOQRI = {
  label: 'Herzog: summary of Moqri et al., Validation of biomarkers of aging, Nature Medicine 2024',
  url: 'https://chiaraherzog.github.io/blog/2024/natmed',
}
const PEARL = {
  label: 'Lifespan.io: results of a crowdfunded one-year human rapamycin trial (PEARL)',
  url: 'https://www.lifespan.io/news/results-of-a-crowdfunded-one-year-human-rapamycin-trial',
}

export const longevityTree: ConstraintTree = {
  problemSlug: 'longevity',
  outcome:
    'An intervention shown in a human trial to delay the diseases of aging. None has been shown yet. How many healthy years could be gained is unknown.',
  whyUnsolved:
    'Nobody has run the trial that would prove it. A trial of a drug against aging has to be large and long, because there is no agreed short-term measure of aging. The cheapest candidates are generic, so no company earns the cost back. The one trial designed to break the deadlock has been waiting for money.',
  bindingId: 'no-payer',
  updated: '2026-11-11',
  root: [
    {
      id: 'no-payer',
      claim: 'Nobody will pay for the large human trials, because the leading candidate drugs are generic.',
      kind: 'payment',
      whyUnsolved:
        'The TAME trial would enroll 3,000 people aged 65 to 79 for six years, at an estimated cost of US$45 to 70 million. The National Institute on Aging set aside about US$5 million. Metformin is generic, so no drug company stands to make money from the result. Calling this the binding constraint is our inference from one trial.',
      falsifier:
        'The regulator blocks such trials, so money would not help. Or a fully funded trial of this kind already exists.',
      tested:
        'Looked for it. NPR reports the FDA was receptive to the TAME design, so regulation did not block it. As of the April 2024 report the trial was not fully funded. We did not find a later funding announcement, and we did not check for industry trials of patented drugs.',
      suppliers: ['American Federation for Aging Research', 'National Institute on Aging'],
      supplyState: 'thin',
      additionality: {
        level: 'high',
        why: 'The gap for the one designed trial is tens of millions of dollars. One funder could close it.',
      },
      entryPoints: [
        { who: 'capital', action: 'Fund part of the TAME trial shortfall, or another trial with disease outcomes, through its sponsor.' },
        { who: 'talent', action: 'Confirm the current funding status of TAME with its organizers and publish the remaining gap.' },
        { who: 'operator', action: 'If you run a health system with long patient records, offer it as a trial site to cut cost per participant.' },
      ],
      sources: [NPR_TAME],
    },
    {
      id: 'no-endpoint',
      claim: 'There is no accepted way to measure aging in a short trial.',
      kind: 'regulatory',
      whyUnsolved:
        'The FDA does not recognize aging as a disease to treat, so a trial must count diseases or deaths, which takes years. A 2024 Nature Medicine paper states that no consensus exists on how biomarkers of aging should be validated before clinical use. Without a validated marker, every test of a drug costs a TAME-sized trial.',
      falsifier: 'A regulator accepts a biomarker of aging as a surrogate endpoint. Or a short trial using disease outcomes proves a drug works.',
      tested:
        'Not found. The paper describes surrogate use as a potential, not an established, role. In the one-year PEARL trial of rapamycin, epigenetic aging measures showed no statistically significant effect.',
      suppliers: ['Authors of the Nature Medicine validation paper (Moqri and colleagues)'],
      supplyState: 'thin',
      additionality: {
        level: 'medium',
        why: 'Inference: a validated marker would shorten every later trial, but validation itself needs long outcome data.',
      },
      entryPoints: [
        { who: 'talent', action: 'Test published aging biomarkers against real outcomes in an open cohort and report which ones predict.' },
        { who: 'capital', action: 'Fund biomarker measurement inside a trial that also counts disease outcomes, so the two can be compared.' },
      ],
      sources: [NPR_TAME, MOQRI, PEARL],
    },
    {
      id: 'human-evidence',
      claim: 'No drug has been shown to slow aging in people.',
      kind: 'science',
      whyUnsolved:
        'The longest rapamycin trial for healthy aging, PEARL, ran 48 weeks with 114 people completing. Its primary endpoint, visceral fat, did not change. It gave no direct evidence that rapamycin extends human life. The doses were low, the sample small, and much of the data self-reported.',
      falsifier: 'A randomized human trial shows a drug delays age-related disease or death.',
      tested: 'Not found this session. We searched one candidate, rapamycin. Other candidates were not checked.',
      suppliers: ['Lifespan.io and AgelessRx (PEARL trial)'],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Not researched how many human trials of aging drugs are running or who funds them.',
      },
      entryPoints: [
        { who: 'talent', action: 'List every registered human trial of a drug aimed at aging, with size, length and endpoint.' },
        { who: 'capital', action: 'Unknown until that list exists. Do not fund on this node yet.' },
      ],
      sources: [PEARL],
    },
  ],
}
