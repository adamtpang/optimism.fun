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
    'An intervention shown in a human trial to delay the diseases of aging. We found no such trial; we checked only rapamycin and metformin. How many healthy years could be gained is unknown.',
  whyUnsolved:
    'We found no completed trial that would prove it. A trial of a drug against aging has to be large and long, because there is no agreed short-term measure of aging. Metformin, the drug in the one trial design we examined, is generic, so no company earns the cost back. That trial, TAME, has been waiting for money.',
  bindingId: 'no-payer',
  updated: '2026-11-11',
  root: [
    {
      id: 'no-payer',
      claim: 'The one large trial we examined is unfunded, and its drug is generic, so no company earns the cost back.',
      kind: 'payment',
      whyUnsolved:
        'The TAME trial would enroll 3,000 people aged 65 to 79 for six years, at an estimated cost of US$45 to 70 million. The National Institute on Aging set aside about US$5 million. Metformin is generic, so no drug company stands to make money from the result. Calling this the binding constraint is our inference from one trial.',
      falsifier:
        'The regulator blocks such trials, so money would not help. Or a fully funded trial of this kind already exists.',
      tested:
        'Looked for it. NPR reports the FDA was receptive to the TAME design, so regulation did not block it. As of the April 2024 report the trial was not fully funded. We did not find a later funding announcement, and we did not check for industry trials of patented drugs.',
      suppliers: ['National Institute on Aging'],
      supplyState: 'thin',
      additionality: {
        level: 'high',
        why: 'Inference: with a US$45 to 70 million cost and about US$5 million from the National Institute on Aging, the shortfall is probably tens of millions. Pledges of unknown size exist.',
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
        'The FDA does not recognize aging as a disease to treat. Inference: so a trial must count diseases or deaths, which takes years. A 2024 Nature Medicine paper states that no consensus exists on how biomarkers of aging should be validated before clinical use. Inference: without a validated marker, proving a drug delays disease needs a long outcomes trial like TAME.',
      falsifier: 'A regulator accepts a biomarker of aging as a surrogate endpoint. Or a short trial using disease outcomes proves a drug works.',
      tested:
        'Not found. The paper describes surrogate use as a potential, not an established, role. In the one-year PEARL trial of rapamycin, epigenetic aging measures showed no statistically significant effect in a subgroup of 24 participants.',
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
      claim: 'We found no human trial showing that a drug slows aging. We checked only rapamycin.',
      kind: 'science',
      whyUnsolved:
        'PEARL, described as the first long-running randomized trial of rapamycin in humans, ran 48 weeks with 114 people completing. Its primary endpoint, visceral fat, did not change. It gave no direct evidence that rapamycin extends human life. The doses were low, the sample small, and much of the data self-reported.',
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
