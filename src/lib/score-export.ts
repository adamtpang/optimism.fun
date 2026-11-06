/**
 * Reproducible ranking export. Model version 2026-11-06.1.
 *
 * opportunity = itn × (1 − supply) × (0.7 + 0.3 × urgency) × 100
 * itn = quantity × annualSeverity × (neglectedness/10) × (tractability/10) × existentialWeight
 * quantity = log10(stock count) / log10(8.2e9), or 0.5 when the headline is not a stock
 * annualSeverity = log death rate, or 0.5 when missing OR when the stored figure is a conditional extinction stake
 * A missing judgment is 0.5. Varying that 0.5 to 0 and to 1 is model sensitivity, not a confidence interval.
 */
import { problems } from '@/data/problems'
import { getCompaniesForProblem } from '@/data/companies'
import { getEcosystemForProblem } from '@/data/ecosystem'
import {
  DEATH_RATE_FLOOR,
  annualDeathPair,
  existentialWeight,
  isConditionalStake,
  opportunityScore,
  quantityComparable,
  quantityScore,
  severityFromDeathRate,
  severityScore,
} from '@/lib/priority'

export const RANKING_MODEL_VERSION = '2026-11-06.2'

/**
 * Homepage opportunity order on origin/main at 80f56d1, before this audit
 * changed the formula. Frozen so a later edit cannot pretend the old order
 * was something else.
 */
export const RANKING_BEFORE = [
  'neglected-tropical-diseases',
  'copd',
  'biosecurity',
  'hypertension',
  'pedagogy',
  'ai-datacenter-power',
  'infectious-disease',
  'scientific-productivity',
  'loneliness',
  'housing-construction',
  'fertility-decline',
  'newborn-survival',
  'longevity',
  'extreme-poverty',
  'energy-abundance',
  'climate-change',
  'cancer',
  'diabetes',
  'financial-infrastructure',
] as const

/** Opportunity order produced by model 2026-11-06.2 on these committed inputs. */
export const RANKING_AFTER = [
  'hypertension',
  'copd',
  'pedagogy',
  'neglected-tropical-diseases',
  'loneliness',
  'housing-construction',
  'extreme-poverty',
  'newborn-survival',
  'infectious-disease',
  'ai-datacenter-power',
  'diabetes',
  'biosecurity',
  'scientific-productivity',
  'longevity',
  'fertility-decline',
  'energy-abundance',
  'climate-change',
  'financial-infrastructure',
  'cancer',
] as const

export const RANKING_FORMULA_CHANGES = [
  'Quantity uses log10(count)/log10(8.2e9) only for prevalence (people living with a condition). Population exposure, interventions-required, at-risk, incidence, annual deaths, and indirect counts score 0.5. They used to be logged as if they were the same kind of count.',
  'Annual severity is scored only when deaths and the person stock share a year and the denominator is not incident cases. Diabetes (2023 deaths / 2022 all-ages prevalence), COPD (2023 deaths / 2021 prevalence), and hypertension (undated approximate deaths / 2024 prevalence) are not scored. They previously entered the score. Missing annual severity is 0.5, a default, not a measured rate.',
  'Cancer 9.7 million deaths / 20 million new diagnoses is not scored. It previously scored 0.921.',
  'A conditional extinction stake is stored and does not enter annual severity. Biosecurity previously used stake 1 as this year\'s severity.',
  'Inputs are the committed problem records plus render snapshot 2026-11-06. Scores do not move when a live API changes.',
] as const

export const RANKING_FORMULAS = {
  deathRate:
    'severity = (log10(deaths/affected) - log10(0.0001)) / 4, only when the denominator is a person stock',
  deathRateFloor: DEATH_RATE_FLOOR,
  quantity: 'log10(count) / log10(8.2e9) for prevalence only; every other count kind is 0.5',
  missingJudgment: 0.5,
  opportunity: 'round(itn * (1 - supply) * (0.7 + 0.3 * urgency) * 100)',
  sensitivity:
    'If annual severity is missing or is a conditional stake, the export also records the score with that default set to 0 and to 1. Those are model sensitivities, not a statistical interval.',
} as const

export function scoreRows() {
  return problems.map((problem) => {
    const supply = {
      companies: getCompaniesForProblem(problem.slug).length,
      capital: getEcosystemForProblem(problem.slug).length,
    }
    const pair = annualDeathPair(problem)
    const conditional = isConditionalStake(problem)
    const missing = !pair && (problem.severity == null || conditional)
    const base = opportunityScore(problem, supply)
    return {
      slug: problem.slug,
      model: RANKING_MODEL_VERSION,
      count_kind: problem.humansAffected?.countKind ?? '',
      count_value: problem.humansAffected?.value ?? '',
      count_unit: problem.humansAffected?.unit ?? '',
      observation_year: problem.humansAffected?.observationYear ?? '',
      publication_year: problem.humansAffected?.publicationYear ?? '',
      quantity_comparable: quantityComparable(problem),
      quantity: quantityScore(problem),
      annual_severity: severityScore(problem),
      conditional_stake: conditional ? problem.severity?.value ?? '' : '',
      death_rate_numerator: pair?.deaths.value ?? '',
      death_rate_denominator: pair?.affected.value ?? '',
      death_rate_worked: pair ? severityFromDeathRate(pair.deaths.value, pair.affected.value) : '',
      existential_weight: existentialWeight(problem),
      neglectedness: problem.neglectedness?.score ?? '',
      tractability: problem.tractability?.score ?? '',
      tracked_companies: supply.companies,
      tracked_funders: supply.capital,
      opportunity: base,
      sensitivity_low: missing ? opportunityScore(problem, supply, 0) : '',
      sensitivity_high: missing ? opportunityScore(problem, supply, 1) : '',
      sensitivity_note: missing
        ? 'Model sensitivity to the missing-annual-severity default of 0.5. Not a confidence interval. No validated statistical interval is available.'
        : 'Annual severity is sourced. No extra interval is published.',
    }
  })
}

export const WORKED_EXAMPLE = {
  slug: 'hypertension',
  steps: [
    'Deaths: about 10 million a year (year not stated). Affected: 1.4 billion adults aged 30–79 in 2024.',
    'Rate = 10000000 / 1400000000.',
    'Severity = (log10(rate) - log10(0.0001)) / 4.',
    'The years do not match. The rate is still the opened pair, and the mismatch stays on the row.',
    'Cancer is the contrast: 9700000 deaths / 20000000 new diagnoses is incident cases, so it is not scored.',
  ],
}
