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

/**
 * A Request for Startup — a concrete, buildable company someone should start
 * to attack a ranked problem. Modeled on YC's RFS (punchy pitch, why-now,
 * concrete shape) and Founders Fund's "Choose Good Quests" rubric
 * (important if it works × a genuine frontier × unambiguously good).
 *
 * The RFS is the call-to-action. The whitepaper is the analysis. One problem
 * has many RFS; each RFS attacks one problem.
 */
export type RequestForStartup = {
  slug: string
  problemSlug: string
  /** Evocative working name for the company/idea. */
  title: string
  /** The hook — 1–3 sentences in the YC-RFS voice. Lead with the pain. */
  pitch: string
  /** The unlock — why this is buildable *now* (tech / cost / regulatory shift). */
  whyNow: string
  /** What the company concretely does. No hand-waving. */
  shape: string
  /** Concrete success state, tied to the problem's transformation. */
  successLooksLike: string
  /**
   * One sentence on why this passes the Choose Good Quests test:
   * important if it works, a real frontier, and unambiguously good.
   */
  goodQuest: string
  confidence: Confidence
  asOf: string
}

export type Sector = {
  slug: string
  name: string
  /** One-line description for the chip and SEO. */
  tagline: string
  /** Long-form explainer for the sector landing page (1-3 paragraphs). */
  description: string
  /** Lead voice — name + URL of the canonical thinker on this sector. */
  leadVoice?: { name: string; url: string }
  /** Color hint used by chips and the landing-page hero accent. */
  accent: 'amber' | 'rose' | 'cyan' | 'violet' | 'green' | 'indigo'
  /** Open-ended further reading, Patrick-Collison-progress-style. */
  furtherReading: { title: string; url: string; by?: string }[]
}

/**
 * Primary domain facet for the home dashboard filter. One word, mutually
 * exclusive, so visitors can slice the index the way 80,000 Hours and Our
 * World in Data do. (Distinct from `sectors`, which is a multi-cluster tag.)
 */
export type Domain =
  | 'health'
  | 'energy'
  | 'ai'
  | 'bio'
  | 'poverty'
  | 'governance'
  | 'education'
  | 'climate'
  | 'science'
  | 'longevity'
  | 'social'

/** Direction of travel for a problem's headline number. */
export type Trend = 'improving' | 'worsening' | 'flat'

/**
 * The headline scale measure: one number, its unit, the direction it is moving,
 * and a sparse real time-series for the sparkline. Trend is the optimism signal:
 * most things are improving, and we show it.
 */
export type ScaleMeasure = {
  value: number
  unit: string
  trend: Trend
  /** Sparse, real anchor points (year ascending) for the sparkline. */
  series?: { year: number; value: number }[]
  source: string
  sourceUrl?: string
  confidence: Confidence
  asOf: string
}

/** A 0-10 judgment (neglectedness, tractability) with a reasoned, cited rationale. */
export type ScoredJudgment = {
  score: number // 0-10
  rationale: string
  source: string
  sourceUrl?: string
  confidence: Confidence
  asOf: string
}

export type Organization = { name: string; url: string; kind: string }
export type Person = { name: string; role: string; url?: string }
export type WayToHelp = {
  mode: 'build' | 'fund' | 'research' | 'donate' | 'career' | 'policy'
  text: string
  url?: string
}

export type Problem = {
  slug: string
  name: string
  tier: Tier
  /** Primary domain facet for the home dashboard filter. */
  domain?: Domain
  /** Sector cluster slugs this problem belongs to. A problem can sit in 1-N sectors. */
  sectors?: string[]
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
  /**
   * Order-of-magnitude time to meaningful impact, in years. Drawn from analogues
   * (e.g. biotech base rates, energy infrastructure timelines). Low confidence.
   */
  timeToImpact?: SourcedNumber
  /**
   * Order-of-magnitude capital required for civilizational-scale solution, in USD.
   * Includes R&D, deployment, and the supply chain to scale. Low confidence.
   */
  capitalRequired?: SourcedNumber
  /** Before/after success vision for the problem. */
  transformation?: Transformation
  /** Headline scale + trend (improving/worsening) + optional sparkline series. */
  scale?: ScaleMeasure
  /** How crowded the field is. Low score = neglected = high opportunity. 0-10. */
  neglectedness?: ScoredJudgment
  /** How much traction effort buys right now. 0-10. */
  tractability?: ScoredJudgment
  /** Key organizations working on it. */
  organizations?: Organization[]
  /** People worth following on this problem. */
  people?: Person[]
  /** Concrete ways to help or build, for non-founders and founders alike. */
  waysToHelp?: WayToHelp[]
  /** ISO date this entry's content was last reviewed. Shown on every page. */
  lastUpdated?: string
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

/**
 * Demand detection — "humanity's market research."
 *
 * Demand for a problem's solution is what the world is ALREADY paying — in
 * suffering, money, capital, research, and policy — to make it go away. We
 * detect it by triangulating revealed-preference signal classes, never a
 * single stated opinion. `attention` is tracked too, but as a crowding signal
 * (how noticed a problem is), not as demand: the best opportunities are high
 * demand with low attention.
 *
 * Each class maps to credible, programmatic, mostly-open data sources. The
 * composite lives in lib/demand.ts; live feeds (IHME GBD, capital + research
 * flux) slot into the same shape as they come online.
 */
export type DemandClass =
  | 'burden' // who is affected, how badly — IHME GBD, WHO, World Bank, OWID
  | 'wtp' // willingness to pay — market size, household + gov spend
  | 'capital' // smart money flowing in — VC / grant / R&D, with momentum
  | 'research' // frontier intensity — OpenAlex, NIH RePORTER, patents
  | 'policy' // institutional demand — legislation, procurement, prizes
  | 'expert' // credible prioritizers — 80k Hours, Open Phil, GiveWell, RFS
  | 'attention' // how noticed — Trends, Wikipedia, GDELT (crowding, not demand)

/** What kind of institution a credible prioritizer is. */
export type ExpertPriorKind = 'cause-prioritization' | 'philanthropy' | 'rfs'

/**
 * A credible institution's published prioritization — used as the `expert`
 * demand class. These are the humans who already rank humanity's problems with
 * a transparent, citable methodology. Distinct from ecosystem.ts, which is the
 * capital that funds the work; this is the prior on what's worth funding.
 */
export type ExpertPrior = {
  slug: string
  org: string
  kind: ExpertPriorKind
  url: string
  /** Which ranked problems this institution lists as a top priority. */
  problemSlugs: string[]
  /** One line on the methodology, so the prior is auditable. */
  note: string
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

/** Treated as preformatted text today; renderer will line-break and preserve
 * paragraph whitespace. Upgrade to a markdown renderer when an entry exists
 * that meaningfully needs headings / lists / links. */
export type MarkdownDoc = string

export type WhitepaperCta = {
  /** Who this CTA is talking to. */
  for: 'founder' | 'allocator'
  /** The actual call — one or two sentences. */
  body: string
  /** Optional outbound URL (apply form, RFS landing, etc.). */
  url?: string
  /** Label for the action button. */
  ctaLabel?: string
}

/**
 * Hand-curated weekly two-part drop for a single problem.
 *
 * - blackpaper: the deep dive — why it matters, the data, the populations
 *   affected, what's been tried, what's failing.
 * - whitepaper: the proposed solution — spec, market size, what a startup
 *   would build, who would back it. YC-RFS voice.
 *
 * Lives in src/data/whitepapers.ts. Newsletter cron generates a draft and
 * emails the editor; the editor moves the finalized doc into the array.
 */
export type WhitepaperDoc = {
  slug: string
  problemSlug: string
  week: number
  publishedAt: string
  blackpaper: MarkdownDoc
  whitepaper: MarkdownDoc
  cta?: WhitepaperCta
  authors?: string[]
  newsletter?: { subject: string; preheader: string }
}

export type MediaSourceKind = 'substack' | 'youtube' | 'x' | 'blog' | 'podcast'

export type MediaSource = {
  /** Stable id e.g. "substack:not-boring" */
  id: string
  kind: MediaSourceKind
  /** Human-readable label e.g. "Not Boring" */
  name: string
  /** Author / channel handle e.g. "Packy McCormick" */
  author?: string
  url: string
  /** RSS feed for substack / blog / podcast; YouTube channel feed; X polling URL. */
  feedUrl?: string
}

export type MediaStatus = 'draft' | 'live' | 'rejected'

/**
 * A single media item — essay, podcast episode, video, thread — tagged
 * to the problems and sectors it discusses. Surfaces in MediaFeed on
 * /p/[slug], /sector/[slug], and the /media firehose.
 *
 * Cron at /api/cron/media-ingest pulls these from RSS / YouTube / X and
 * Anthropic auto-tags them. Editor reviews 'draft' rows and flips to
 * 'live'. Seeded items in src/data/media.ts are 'live' by default.
 */
export type MediaItem = {
  id: string
  title: string
  url: string
  sourceId: string
  publishedAt: string
  excerpt?: string
  problemSlugs: string[]
  sectorSlugs?: string[]
  status: MediaStatus
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

export type CandidateStatus = 'draft' | 'promoted' | 'rejected'

/**
 * A problem candidate produced by the daily cron. Mirrors the curated
 * Problem shape but is unverified — a human reviews + promotes (or
 * rejects) via /admin/candidates before it shows up in the live ranking.
 */
export type ProblemCandidate = {
  id: string
  slug: string
  name: string
  tier: Tier
  tagline: string
  description: string
  humansAffected: number | null
  severity: number | null
  marketSize: number | null
  currentSolutionQuality: number | null
  welfareBCR: number | null
  xriskITN: number | null
  utilityDelta: number | null
  transformation: Transformation | null
  sources: { title: string; url: string }[]
  signalUrl: string | null
  signalTitle: string | null
  signalPublishedAt: string | null
  rationale: string | null
  status: CandidateStatus
  createdAt: string
  updatedAt: string
}

/** Direction of capital over the last ~3 years (distinct from Trend, which tracks the problem itself). */
export type CapitalMomentum = 'rising' | 'falling' | 'flat'

/** Is the capital pointed at a problem proportional to its demand? */
export type AllocationVerdict = 'underallocated' | 'balanced' | 'overallocated'

/**
 * Estimated annual capital deployed at a problem — the PitchBook/NVCA-style
 * "where the money actually goes" layer. Always an order-of-magnitude estimate
 * from a named public source, never a silent guess; `scope` says exactly what
 * is and is not counted so the number is falsifiable.
 */
export type CapitalFlow = {
  problemSlug: string
  /** Estimated capital per year at the problem (USD). */
  usdPerYear: SourcedNumber
  /** Direction of that capital over ~3 years. */
  momentum: CapitalMomentum
  /** What the estimate counts / excludes. */
  scope: string
  /** Sparse recent series for momentum context, where defensible. */
  series?: { year: number; usd: number }[]
}

/**
 * The prize at the limit — the equity value of the company that wins a problem
 * if its team executes perfectly. This is the upside half of the trade
 * (demand + thin capital + a huge in-limit prize = the opportunity), and the
 * number that flips a Request for Startups into a Request for Investors.
 *
 * Deliberately a ceiling, not a forecast: confidence is low by construction,
 * anchored to a NAMED comparable, with the reasoning shown so it is arguable.
 */
export type InLimitCap = {
  problemSlug: string
  /** In-the-limit equity value at perfect execution (USD). */
  marketCap: SourcedNumber
  /** The real company/asset that anchors the ceiling. */
  comparable: string
  /** Why this is the ceiling — the logic of the prize. */
  reasoning: string
}
