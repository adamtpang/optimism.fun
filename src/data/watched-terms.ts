/**
 * The terms the trend engine watches.
 *
 * Two kinds, deliberately mixed:
 *   1. Terms mapped to a ranked problem (`problemSlug`), so the trend layer can
 *      answer "is attention arriving at the thing that matters yet?"
 *   2. Frontier terms with no problem attached, so the engine can surface
 *      things the index does not yet have a row for. That is the discovery
 *      path — a term that keeps rising here is a candidate problem.
 *
 * Adding a term is the whole extension mechanism: append here and the next
 * ingest picks it up across every source. No code change.
 */
import type { WatchedTerm } from '@/lib/trends/types'

export const watchedTerms: WatchedTerm[] = [
  // — mapped to ranked problems ————————————————————————————————
  { term: 'biosecurity', category: 'health', problemSlug: 'biosecurity' },
  { term: 'pandemic preparedness', category: 'health', problemSlug: 'biosecurity' },
  { term: 'gene drive', category: 'science', problemSlug: 'infectious-disease' },
  { term: 'tuberculosis', category: 'health', problemSlug: 'infectious-disease' },
  { term: 'geothermal', category: 'energy', problemSlug: 'energy-abundance' },
  { term: 'nuclear fission', category: 'energy', problemSlug: 'energy-abundance' },
  { term: 'grid storage', category: 'energy', problemSlug: 'energy-abundance' },
  { term: 'modular housing', category: 'society', problemSlug: 'housing-construction' },
  { term: 'zoning reform', category: 'society', problemSlug: 'housing-construction' },
  { term: 'longevity', category: 'health', problemSlug: 'longevity' },
  { term: 'metascience', category: 'science', problemSlug: 'scientific-productivity' },
  { term: 'loneliness', category: 'society', problemSlug: 'loneliness' },
  { term: 'fertility rate', category: 'society', problemSlug: 'fertility-decline' },
  { term: 'tutoring', category: 'society', problemSlug: 'pedagogy' },

  // — frontier terms, no problem row yet ——————————————————————
  { term: 'AI agents', category: 'technology' },
  { term: 'mechanistic interpretability', category: 'technology' },
  { term: 'robotics foundation model', category: 'technology' },
  { term: 'prediction markets', category: 'money' },
  { term: 'carbon removal', category: 'energy' },
  { term: 'synthetic biology', category: 'science' },
  { term: 'brain computer interface', category: 'science' },
  { term: 'desalination', category: 'energy' },
  { term: 'vertical farming', category: 'science' },
  { term: 'network state', category: 'society' },
]

export function termsByCategory(category: string): WatchedTerm[] {
  return watchedTerms.filter((t) => t.category === category)
}
