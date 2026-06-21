import type { ExpertPrior } from './types'

/**
 * Expert priors — the `expert` demand class.
 *
 * The credible institutions that already rank humanity's problems with a
 * transparent, citable methodology. When several independent prioritizers
 * converge on the same problem, that convergence is a real demand signal: it
 * means the most rigorous resource-allocators in the world have all decided
 * this is worth attacking.
 *
 * Each entry's `problemSlugs` maps that institution's published focus areas
 * onto our ranked problems. Conservative on purpose — we only list a problem
 * where the institution has a named, public program or profile for it, so the
 * prior stays falsifiable. Add/correct via PR.
 */
export const expertPriors: ExpertPrior[] = [
  {
    slug: '80000-hours',
    org: '80,000 Hours',
    kind: 'cause-prioritization',
    url: 'https://80000hours.org/problem-profiles/',
    problemSlugs: ['ai-safety', 'biosecurity', 'infectious-disease', 'extreme-poverty'],
    note: 'Importance × Tractability × Neglectedness profiles; ranks AI and catastrophic biorisk as top priorities.',
  },
  {
    slug: 'open-philanthropy',
    org: 'Open Philanthropy',
    kind: 'philanthropy',
    url: 'https://www.openphilanthropy.org/focus/',
    problemSlugs: [
      'ai-safety',
      'biosecurity',
      'infectious-disease',
      'extreme-poverty',
      'scientific-productivity',
      'housing-construction',
    ],
    note: 'Named focus areas: potential risks from advanced AI, biosecurity & pandemic preparedness, global health, scientific research, and land-use reform.',
  },
  {
    slug: 'givewell',
    org: 'GiveWell',
    kind: 'cause-prioritization',
    url: 'https://www.givewell.org/how-we-work/our-criteria',
    problemSlugs: ['infectious-disease', 'extreme-poverty'],
    note: 'Cost-effectiveness-led; top charities concentrate on malaria, deworming, and direct cash transfers.',
  },
  {
    slug: 'copenhagen-consensus',
    org: 'Copenhagen Consensus',
    kind: 'cause-prioritization',
    url: 'https://copenhagenconsensus.com',
    problemSlugs: ['infectious-disease', 'extreme-poverty', 'pedagogy', 'longevity'],
    note: 'Nobel-laureate benefit-cost panels; highest-BCR interventions cluster in health, nutrition, and education.',
  },
  {
    slug: 'founders-fund-good-quests',
    org: 'Founders Fund · Good Quests',
    kind: 'rfs',
    url: 'https://foundersfund.com/2023/06/choose-good-quests/',
    problemSlugs: ['ai-safety', 'energy-abundance', 'biosecurity', 'longevity'],
    note: 'The "important × frontier × unambiguously good" rubric; portfolio concentrates in hard tech, energy, defense, and bio.',
  },
  {
    slug: 'yc-rfs',
    org: 'Y Combinator · RFS',
    kind: 'rfs',
    url: 'https://www.ycombinator.com/rfs',
    problemSlugs: [
      'ai-safety',
      'energy-abundance',
      'longevity',
      'housing-construction',
      'scientific-productivity',
    ],
    note: 'Requests for Startups: concrete, buildable company shapes YC explicitly wants funded now.',
  },
]

/** Number of credible institutions listing a problem as a top priority. */
export function expertPriorCount(problemSlug: string): number {
  return expertPriors.filter((e) => e.problemSlugs.includes(problemSlug)).length
}

/** The institutions prioritizing a problem (for display + auditing). */
export function getExpertPriorsForProblem(problemSlug: string): ExpertPrior[] {
  return expertPriors.filter((e) => e.problemSlugs.includes(problemSlug))
}

/**
 * 0..1 strength of the expert prior: convergence of credible prioritizers,
 * saturating at 4 (four independent institutions agreeing is already a strong
 * signal). Returns null when no institution lists the problem — no silent zero.
 */
export function expertPriorStrength(problemSlug: string): number | null {
  const n = expertPriorCount(problemSlug)
  if (n === 0) return null
  return Math.min(1, n / 4)
}
