// Constraint tree for heart disease. Counts and trial results were checked
// on 2026-11-20. Inference is labeled as inference.

import type { ConstraintTree } from '../constraints'

const WHO = {
  label: 'WHO Global Health Estimates 2023, global deaths workbook (checked 2026-11-20)',
  url: 'https://cdn.who.int/media/docs/default-source/gho-documents/global-health-estimates/deaths_global_2026-09-30.xlsx',
}
const SELECT = {
  label: 'SELECT trial of semaglutide, NEJM',
  url: 'https://www.nejm.org/doi/full/10.1056/nejmoa2307563',
}
const VESALIUS = {
  label: 'VESALIUS-CV trial of evolocumab, NEJM',
  url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2514428',
}
const LPA = {
  label: 'Lp(a)HORIZON trial of pelacarsen, NEJM',
  url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2610159',
}
const ZEUS = {
  label: 'ZEUS trial of ziltivekimab, NEJM',
  url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2612126',
}

export const heartDiseaseTree: ConstraintTree = {
  problemSlug: 'heart-disease',
  outcome:
    'Fewer deaths from ischaemic heart disease. The WHO workbook counts 9,469,357 deaths in 2023, up from 6,429,003 in 2000.',
  whyUnsolved:
    'The death toll is still rising, and a missing first drug does not explain that on its own. SELECT reported a hazard ratio of 0.80 for major cardiovascular events with semaglutide, and VESALIUS-CV reported 0.75 for 3-point MACE with evolocumab. Two later trials did not reduce events: pelacarsen (hazard ratio 1.02) and ziltivekimab (hazard ratio 0.99). Inference: the open question is who actually receives a therapy that has already reduced events, not whether any such therapy exists. That share was not measured here.',
  bindingId: 'still-rising',
  updated: '2026-11-20',
  root: [
    {
      id: 'still-rising',
      claim: 'Ischaemic heart disease deaths are still rising even though some approved drugs already reduce cardiovascular events in trials.',
      kind: 'delivery',
      whyUnsolved:
        'WHO counts 6,429,003 deaths in 2000 and 9,469,357 in 2023. SELECT and VESALIUS-CV reduced events. Inference: the binding constraint is not the absence of a first effective drug. How much of the rise is untreated risk, ageing, or a mechanism those drugs do not touch was not separated in this pass.',
      falsifier:
        'A later WHO edition shows ischaemic heart disease deaths back at the 2000 count, or the event reductions in SELECT and VESALIUS-CV fail to replicate.',
      tested:
        'Lp(a)HORIZON and ZEUS, both published in 2026, did not reduce cardiovascular events (hazard ratios 1.02 and 0.99). Lowering lipoprotein(a) and interleukin-6, in those two trials, was not enough.',
      suppliers: ['SELECT investigators', 'VESALIUS-CV investigators', 'Lp(a)HORIZON investigators', 'ZEUS investigators'],
      supplyState: 'contested',
      additionality: {
        level: 'medium',
        why: 'Inference: another trial of a mechanism that has already failed an outcome study adds less than getting a positive-trial drug to people who do not receive it. That gap was not counted here.',
      },
      entryPoints: [
        { who: 'talent', action: 'Read SELECT and VESALIUS-CV next to Lp(a)HORIZON and ZEUS before treating a biomarker change as fewer deaths.' },
        { who: 'capital', action: 'Fund a program that measures whether people at high risk actually receive a drug that already reduced events in a trial.' },
        { who: 'operator', action: 'If you run a clinic, count how many eligible patients are on a therapy with a positive cardiovascular outcome trial.' },
      ],
      sources: [WHO, SELECT, VESALIUS, LPA, ZEUS],
    },
  ],
}
