/**
 * The trend scoring engine.
 *
 * Design stance, inherited from lib/demand.ts and deliberately consistent with
 * it: a single loud source is weak evidence. The composite is gated on
 * CORROBORATION, so a term screaming on one platform and silent everywhere
 * else cannot top the board. That is the explicit "avoid overfitting to one
 * viral source" requirement, implemented as a gate rather than a weight.
 *
 * The four components, and why each exists:
 *   velocity  — how much is happening now. A level. On its own it just ranks
 *               big evergreen topics, which is why it carries the least weight.
 *   momentum  — growth against the prior window. This is the actual signal;
 *               everything else modifies it.
 *   novelty   — was this near-absent before? Separates a genuinely new thing
 *               from a large topic that ticked up.
 *   confidence— corroboration across independent sources, scaled by absolute
 *               volume. Three mentions moving to six is +100% and means nothing.
 *
 * Every score is 0..100 so they can be shown side by side without a legend.
 */
import type {
  ScoredTrend,
  SourceCredibility,
  TrendObservation,
  TrendState,
  TrendSourceId,
} from './types'

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

/**
 * Source quality weights. Stated openly because they are judgment calls, and
 * because "signal quality" is otherwise the easiest place to hide a thumb on
 * the scale. Each `measures` line names whose attention is actually being
 * counted — no source measures "the internet".
 */
export const SOURCES: Record<TrendSourceId, SourceCredibility> = {
  hackernews: {
    id: 'hackernews',
    name: 'Hacker News',
    quality: 0.8,
    measures: 'what a technical, US-skewed, early-adopter community is discussing',
    url: 'https://news.ycombinator.com',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    quality: 0.75,
    measures: 'what developers are actually building, not just talking about',
    url: 'https://github.com',
  },
  wikipedia: {
    id: 'wikipedia',
    name: 'Wikipedia',
    quality: 0.9,
    measures: 'broad public curiosity — the least gameable of the three',
    url: 'https://wikipedia.org',
  },
}

/** log-normalise a count against a ceiling, 0..1. */
function logNorm(value: number, ceiling: number): number {
  if (value <= 0) return 0
  return clamp01(Math.log10(1 + value) / Math.log10(1 + ceiling))
}

/**
 * Growth from prior to current, mapped to 0..1 with 0.5 at flat.
 * Uses log-ratio so a 10x rise and a 10x fall are symmetric around the middle,
 * and so one explosive term cannot dominate the scale.
 */
function growthScore(current: number, prior: number): number {
  // Both windows empty: no information, not "flat".
  if (current === 0 && prior === 0) return 0
  // Laplace smoothing, so a 0 -> 5 move is finite rather than infinite.
  const ratio = (current + 1) / (prior + 1)
  const logRatio = Math.log2(ratio) // 0 at flat, +1 per doubling
  return clamp01(0.5 + logRatio / 6) // +/- 3 doublings spans the range
}

/**
 * Novelty: how much of the total activity is new. A term with nothing before
 * and something now is maximally novel; a large steady topic is not novel even
 * if it grew in absolute terms.
 */
function noveltyScore(current: number, prior: number): number {
  const total = current + prior
  if (total === 0) return 0
  return clamp01(current / total) ** 2 // squared so only sharp arrivals score high
}

/**
 * Confidence: corroboration across sources, scaled down hard at low volume.
 * Three mentions becoming six is a 100% rise and is noise; this is where that
 * gets suppressed rather than in the momentum term, so momentum stays honest.
 */
function confidenceScore(sourceCount: number, currentTotal: number): number {
  const spread = clamp01(sourceCount / 3) // 3 independent sources = full marks
  const volume = logNorm(currentTotal, 200)
  return clamp01(0.6 * spread + 0.4 * volume)
}

function stateFor(momentum: number, currentTotal: number): TrendState {
  if (currentTotal < 3) return 'quiet'
  if (momentum >= 0.62) return 'rising'
  if (momentum <= 0.38) return 'cooling'
  return 'steady'
}

/**
 * Score one term from its per-source observations.
 *
 * The corroboration gate is the load-bearing part: a term seen by a single
 * source is multiplied by 0.6, exactly as lib/demand.ts discounts a
 * single-class demand signal. Cross-source confirmation is the difference
 * between a trend and a thread.
 */
export function scoreTrend(
  term: string,
  category: string,
  observations: TrendObservation[],
): ScoredTrend {
  const live = observations.filter((o) => o.current > 0 || o.prior > 0)

  const currentTotal = live.reduce((s, o) => s + o.current, 0)
  const priorTotal = live.reduce((s, o) => s + o.prior, 0)
  const sourceCount = live.filter((o) => o.current > 0).length

  // Quality-weighted per-source growth, so a move on a gameable source counts
  // for less than the same move on a hard one.
  const weights = live.map((o) => SOURCES[o.source].quality)
  const totalWeight = weights.reduce((s, w) => s + w, 0) || 1
  const momentum =
    live.reduce(
      (s, o) => s + growthScore(o.current, o.prior) * SOURCES[o.source].quality,
      0,
    ) / totalWeight

  const velocity = logNorm(currentTotal, 500)
  const novelty = noveltyScore(currentTotal, priorTotal)
  const confidence = confidenceScore(sourceCount, currentTotal)

  // Momentum leads; velocity is the smallest term because a level alone just
  // surfaces big evergreen topics.
  const raw = 0.45 * momentum + 0.2 * novelty + 0.15 * velocity + 0.2 * confidence

  // The gate. One source is weak evidence, however loud.
  const gate = sourceCount >= 2 ? 1 : 0.6

  return {
    term,
    category,
    trendScore: Math.round(clamp01(raw * gate) * 100),
    velocityScore: Math.round(velocity * 100),
    momentumScore: Math.round(momentum * 100),
    noveltyScore: Math.round(novelty * 100),
    confidenceScore: Math.round(confidence * 100),
    sourceCount,
    currentTotal,
    priorTotal,
    state: stateFor(momentum, currentTotal),
    observations: live,
  }
}

/** Rank a set of scored trends, strongest first. */
export function rankTrends(trends: ScoredTrend[]): ScoredTrend[] {
  return [...trends].sort(
    (a, b) => b.trendScore - a.trendScore || b.momentumScore - a.momentumScore,
  )
}

/**
 * The view that actually matters for optimism.fun: rising, but not yet
 * crowded. High momentum with low absolute volume is underpriced attention —
 * something is moving before the room has noticed.
 */
export function underpricedFirst(trends: ScoredTrend[]): ScoredTrend[] {
  return [...trends]
    .filter((t) => t.state === 'rising' && t.currentTotal > 0)
    .sort((a, b) => {
      const aScore = a.momentumScore - a.velocityScore
      const bScore = b.momentumScore - b.velocityScore
      return bScore - aScore
    })
}
