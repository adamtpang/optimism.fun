/**
 * Constraint trees: why each problem is not solved yet.
 *
 * The unit here is the constraint holding a problem back, not the problem.
 * Each node is a conjecture in Deutsch's sense: a claim, the reason it holds,
 * the evidence that would refute it, and what we found when we looked. Nodes
 * carry levels and sentences, never invented scores. Unknown stays unknown.
 *
 * Pass 1 of the loop, 2026-10-04: hypertension. Sources are the WHO pages
 * cited in research/hypertension plus the two checks run against the claim.
 */

export type Level = 'low' | 'medium' | 'high' | 'unknown'

export type ConstraintKind =
  | 'science'
  | 'engineering'
  | 'manufacturing'
  | 'regulatory'
  | 'delivery'
  | 'payment'
  | 'coordination'
  | 'policy'

export type Source = { label: string; url: string }

export type Constraint = {
  id: string
  /** The constraint, stated as a claim that can be wrong. */
  claim: string
  kind: ConstraintKind
  /** Why it is still unsolved. */
  whyUnsolved: string
  /** Evidence that would show this is NOT binding. */
  falsifier: string
  /** What we found when we looked for the falsifier. Omitted if not yet tested. */
  tested?: string
  /** Who is already on it. Named only when sourced. */
  suppliers: string[]
  supplyState: 'unresearched' | 'thin' | 'contested' | 'crowded'
  /** What one more team changes versus the counterfactual. */
  additionality: { level: Level; why: string }
  /** Concrete things a person can commit to. */
  entryPoints: { who: 'talent' | 'capital' | 'operator'; action: string }[]
  sources: Source[]
  children?: Constraint[]
}

export type ConstraintTree = {
  problemSlug: string
  /** The outcome people want, stated so it can be measured. */
  outcome: string
  /** The one-paragraph answer to "why is this not solved yet?" */
  whyUnsolved: string
  /** The node currently judged most binding. */
  bindingId: string
  updated: string
  root: Constraint[]
}

const WHO_FACT = { label: 'WHO hypertension fact sheet, 2025', url: 'https://www.who.int/news-room/fact-sheets/detail/hypertension' }
const WHO_REPORT = { label: 'WHO global report on hypertension, 2025', url: 'https://www.who.int/publications/i/item/9789240115569' }
const HEARTS = { label: 'WHO HEARTS technical package', url: 'https://www.who.int/publications/i/item/9789241511377' }
const KAISER = { label: 'Jaffe et al., JAMA 2013;310(7):699-705 (Kaiser Permanente Northern California)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8032167' }
const PAHO = { label: 'PAHO, HEARTS in the Americas, 2025', url: 'https://www.paho.org/pt/noticias/23-9-2025-opas-destaca-necessidade-urgente-acelerar-controle-da-hipertensao' }
const SODIUM = { label: 'WHO, SHAKE the salt habit, 2026', url: 'https://www.who.int/publications/i/item/9789240120341' }

export const constraintTrees: ConstraintTree[] = [
  {
    problemSlug: 'hypertension',
    outcome:
      'Sustained blood-pressure control for the 1.4 billion adults aged 30 to 79 who have hypertension. Today 320 million, about 23 percent, are controlled.',
    whyUnsolved:
      'Not because the science is missing. Validated cuffs, cheap generic pills and a standard WHO protocol all exist. Where one organisation runs the whole loop, control goes far higher: Kaiser Permanente Northern California went from 44 to 90 percent between 2001 and 2013, and HEARTS clinics in the Americas report 60 percent. The gap is that almost nowhere does one institution both pay for the loop today and collect the savings from strokes avoided years later.',
    bindingId: 'payer',
    updated: '2026-10-04',
    root: [
      {
        id: 'payer',
        claim: 'Nobody who pays for the control loop today owns enough of the future savings to justify it.',
        kind: 'payment',
        whyUnsolved:
          'The patient bears the cost and hassle now. The insurer or health system avoids a stroke or kidney-failure bill years later, often after the patient has moved to another payer. Prevention that works is invisible, so it is hard to price.',
        falsifier:
          'Systems that do own the downstream cost still fail to reach high control. Or systems without that ownership reach it anyway.',
        tested:
          'Partly supports the claim. Kaiser Permanente is both insurer and provider, and it reached 90 percent. HEARTS reaches 60 percent in public systems with donor and government backing, which is a payer that owns the outcome. This is our inference from two cases, not a measured law; a public system that pays and still fails would weaken it.',
        suppliers: ['Kaiser Permanente (integrated payer and provider)', 'WHO HEARTS with Resolve to Save Lives and Bloomberg Philanthropies', 'National health systems running HEARTS'],
        supplyState: 'thin',
        additionality: {
          level: 'high',
          why: 'A contract that pays per controlled patient-year would let any capable operator get paid for control. Few such contracts exist, so each new one is close to fully additional.',
        },
        entryPoints: [
          { who: 'capital', action: 'Fund an outcome contract paid per controlled patient-year in one health system.' },
          { who: 'operator', action: 'If you run a payer or provider group, pilot paying for control instead of visits.' },
          { who: 'talent', action: 'Model the downstream savings per controlled patient so a payer can price the contract.' },
        ],
        sources: [KAISER, PAHO],
      },
      {
        id: 'delivery',
        claim: 'Patients fall out of the loop between measurement, diagnosis, treatment, refill and follow-up.',
        kind: 'delivery',
        whyUnsolved:
          'Each step is cheap; the chain is not. About 600 million people do not know they have it, follow-up is fragmented, and people stop a daily pill for a condition they cannot feel.',
        falsifier: 'High-control systems turn out to differ from low-control ones mainly in drugs or patients, not in workflow.',
        tested:
          'Supports the claim. Kaiser credits a patient registry, a simple protocol, single-pill combinations and follow-up visits run by staff, not a new drug.',
        suppliers: ['HEARTS programmes', 'Kaiser Permanente', 'Primary-care networks'],
        supplyState: 'contested',
        additionality: {
          level: 'medium',
          why: 'The playbook is public and free. A new team adds value only where it does a step better than HEARTS already does.',
        },
        entryPoints: [
          { who: 'talent', action: 'Build the registry and follow-up queue for one clinic network, under its clinical lead.' },
          { who: 'operator', action: 'Run a 90-day pilot in 3 to 10 clinics with a published baseline.' },
        ],
        sources: [WHO_FACT, HEARTS, KAISER],
        children: [
          {
            id: 'medicine-supply',
            claim: 'Medicines are not reliably on the shelf.',
            kind: 'delivery',
            whyUnsolved:
              'Only 28 percent of low-income countries report general availability of all WHO-recommended hypertension medicines. A diagnosis without a refill is not treatment.',
            falsifier: 'Control stays low in places where stock is reliable.',
            suppliers: [],
            supplyState: 'unresearched',
            additionality: { level: 'unknown', why: 'Not yet researched who works on hypertension medicine supply specifically.' },
            entryPoints: [{ who: 'talent', action: 'Map who forecasts and procures hypertension medicines in one country.' }],
            sources: [WHO_REPORT],
          },
          {
            id: 'measurement',
            claim: 'Readings are too noisy to diagnose and treat on.',
            kind: 'engineering',
            whyUnsolved: 'Wrong cuff size, unvalidated devices and rushed technique change the classification. More readings is not more truth.',
            falsifier: 'Programmes with ordinary measurement quality still reach high control.',
            suppliers: [],
            supplyState: 'unresearched',
            additionality: { level: 'unknown', why: 'Not yet researched.' },
            entryPoints: [],
            sources: [HEARTS],
          },
        ],
      },
      {
        id: 'sodium',
        claim: 'Pressure keeps rising because salt is built into the food supply.',
        kind: 'policy',
        whyUnsolved:
          'Average sodium intake is more than twice the WHO limit, mostly already in processed food. Telling individuals to eat less salt does not reach it; reformulation rules do.',
        falsifier: 'Countries with mandatory sodium targets show no fall in population blood pressure.',
        suppliers: [],
        supplyState: 'unresearched',
        additionality: { level: 'unknown', why: 'Policy work; not yet researched who is pushing it where.' },
        entryPoints: [],
        sources: [SODIUM],
      },
    ],
  },
]

export const getConstraintTree = (slug: string) =>
  constraintTrees.find((t) => t.problemSlug === slug)
