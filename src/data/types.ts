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

export type Problem = {
  slug: string
  name: string
  tier: Tier
  tagline: string
  description: string
  humansAffected: SourcedNumber
  severity: SourcedNumber
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
