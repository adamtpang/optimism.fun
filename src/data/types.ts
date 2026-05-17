export type Confidence = 'low' | 'med' | 'high'

export type SourcedNumber = {
  value: number
  unit?: string
  source: string
  sourceUrl?: string
  confidence: Confidence
  asOf: string
}

export type SourcedString = {
  value: string
  source: string
  sourceUrl?: string
  confidence: Confidence
  asOf: string
}

export type Tier =
  | 'welfare'
  | 'x-risk'
  | 'hard-tech'
  | 'progress'
  | 'emerging'

export type LensScore = {
  welfareBCR: SourcedNumber | null
  xriskITN: SourcedNumber | null
  utilityDelta: SourcedNumber | null
}

/**
 * The success theory for a problem — what changes if the solution lands.
 * Written as a concrete, falsifiable commitment, not a wish.
 * Hyperloop Alpha's "1.35 hour SF→LA at $20/ticket" is the spirit.
 */
export type Transformation = {
  before: string // current state, in plain English
  after: string  // post-solution state, equally concrete
  horizon: string // rough time horizon for the after state (e.g. "10 years", "1 generation")
  source?: string
  sourceUrl?: string
  confidence: Confidence
  asOf: string
}

export type Problem = {
  slug: string
  name: string
  tier: Tier
  tagline: string
  description: string
  /** How many humans this problem affects today. */
  humansAffected: SourcedNumber
  /** Per-capita severity of the problem (DALYs, $-cost, or other proxy). */
  severity: SourcedNumber
  /**
   * USD value of the addressable market for solutions — TAM proxy.
   * Drives axis 4 of the ranking: "how much money can pay for the solution."
   */
  marketSize?: SourcedNumber
  /**
   * Current solution quality (0–10, or 0–1 normalized) — low = high opportunity.
   * Drives axis 3 of the ranking: "how good are existing solutions."
   */
  currentSolutionQuality?: SourcedNumber
  /** Before/after success vision for the problem. */
  transformation?: Transformation
  scores: LensScore
  sources: { title: string; url: string }[]
  asOf: string
}

export type CompanyStage =
  | 'public'
  | 'private'
  | 'nonprofit'
  | 'research'
  | 'gov'

export type Company = {
  slug: string
  name: string
  url?: string
  problemSlugs: string[]
  marketCap: SourcedNumber | null
  valuation: SourcedNumber | null
  stage: CompanyStage
  country?: string
  description: string
  sources: { title: string; url: string }[]
  asOf: string
}

export type EcosystemType =
  | 'grant'
  | 'fellowship'
  | 'accelerator'
  | 'catalytic'
  | 'studio'
  | 'vc'
  | 'fro'

export type EcosystemEntity = {
  slug: string
  name: string
  type: EcosystemType
  url: string
  thesis: string
  problemSlugs: string[]
  bestFor: string
  description: string
}

export const TIER_LABEL: Record<Tier, string> = {
  welfare: 'Welfare Floor',
  'x-risk': 'X-Risk Frontier',
  'hard-tech': 'Hard Tech',
  progress: 'Progress & Abundance',
  emerging: 'Emerging',
}

export const TIER_COLOR: Record<Tier, string> = {
  welfare: 'amber',
  'x-risk': 'rose',
  'hard-tech': 'indigo',
  progress: 'emerald',
  emerging: 'purple',
}

export const ECOSYSTEM_TYPE_LABEL: Record<EcosystemType, string> = {
  grant: 'Grant',
  fellowship: 'Fellowship',
  accelerator: 'Accelerator',
  catalytic: 'Catalytic Capital',
  studio: 'Venture Studio',
  vc: 'Venture Capital',
  fro: 'Focused Research Org',
}

export type VoicePosition = {
  problemSlug: string
  stance: string
  quote?: string
  source: string
  sourceUrl?: string
  asOf: string
}

export type Voice = {
  slug: string
  name: string
  role: string
  org?: string
  bio: string
  url?: string
  writings: { title: string; url: string }[]
  positions: VoicePosition[]
}

export type Country = {
  rank: number
  iso2: string
  iso3: string
  name: string
  gdp: SourcedNumber
  asOf: string
}

export type Crypto = {
  rank: number
  name: string
  symbol: string
  price: SourcedNumber
  marketCap: SourcedNumber
  asOf: string
}

export type PublicCompany = {
  rank: number
  name: string
  ticker: string
  marketCap: SourcedNumber
  country: string
  asOf: string
}

export type Founder = {
  rank: number
  name: string
  netWorth: SourcedNumber
  source: string // "Tesla, SpaceX" — the business
  country: string
  age?: number
  asOf: string
}

export type ProgressMilestone = {
  slug: string
  name: string
  description: string
  unit: string
  format: 'percent' | 'years' | 'usd' | 'absolute'
  baseline: { year: number; value: number }
  latest: { year: number; value: number }
  direction: 'up' | 'down' // which direction is improvement
  source: string
  sourceUrl: string
  confidence: Confidence
  asOf: string
}
