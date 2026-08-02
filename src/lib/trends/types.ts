/**
 * The trend engine — types.
 *
 * This is the ATTENTION/VELOCITY layer. It deliberately sits on the supply side
 * of the model, not the demand side: lib/demand.ts weights attention at zero
 * because the thesis is that the best opportunities are high demand with LOW
 * attention. A trend dashboard that treated virality as importance would invert
 * that. The valuable view here is not "what is rising" — Google does that — but
 * "what is rising that nobody has priced yet".
 */

/** A source that can be polled for signal about a term. */
export type TrendSourceId = 'hackernews' | 'github' | 'wikipedia'

export type SourceCredibility = {
  id: TrendSourceId
  name: string
  /** 0..1 — how gameable the source is. Weights the composite. */
  quality: number
  /** What community's attention this actually measures. Stated, not implied. */
  measures: string
  url: string
}

/**
 * One observation of one term from one source, over two comparable windows.
 * Two windows is the minimum for acceleration, which is the whole point —
 * a level tells you nothing about whether something is moving.
 */
export type TrendObservation = {
  source: TrendSourceId
  term: string
  /** Count in the current window. */
  current: number
  /** Count in the immediately preceding window of equal length. */
  prior: number
  /** Window length in days. */
  windowDays: number
  /** Representative items, for the "why this trend" evidence panel. */
  evidence: TrendEvidence[]
  /** Human-facing URL so any number can be reproduced. */
  url: string
}

export type TrendEvidence = {
  title: string
  url: string
  /** Source-native engagement (HN points, GitHub stars). */
  engagement?: number
  /** ISO date, when known. */
  at?: string
}

/** The scored, cross-source view of one term. */
export type ScoredTrend = {
  term: string
  /** Category the term was registered under, for filtering. */
  category: string
  /** 0..100 composite. */
  trendScore: number
  /** 0..100 raw current volume, log-scaled. */
  velocityScore: number
  /** 0..100 growth vs the prior window. */
  momentumScore: number
  /** 0..100 — how much of this is new rather than steady-state. */
  noveltyScore: number
  /** 0..100 — corroboration across independent sources. */
  confidenceScore: number
  /** How many sources returned a non-zero signal. */
  sourceCount: number
  /** Raw totals, summed across sources. */
  currentTotal: number
  priorTotal: number
  /** rising | cooling | steady | quiet — the plain-language read. */
  state: TrendState
  observations: TrendObservation[]
}

export type TrendState = 'rising' | 'cooling' | 'steady' | 'quiet'

/** A term the engine watches, with the category used for filtering. */
export type WatchedTerm = {
  term: string
  category: TrendCategory
  /** Optional: the optimism.fun problem this term maps to. */
  problemSlug?: string
}

export type TrendCategory =
  | 'technology'
  | 'science'
  | 'health'
  | 'energy'
  | 'society'
  | 'money'
