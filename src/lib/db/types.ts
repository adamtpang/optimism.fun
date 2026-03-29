export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
}

export interface CategoryWithCount extends Category {
  problem_count: number
}

export interface Problem {
  id: number
  title: string
  slug: string
  description: string
  category_id: number | null
  severity_score: number
  opportunity_score: number
  solvability_score: number
  composite_score: number
  affected_population: string | null
  location: string | null
  source_url: string | null
  source_name: string | null
  status: 'active' | 'resolved' | 'stale'
  first_seen_at: string
  last_updated_at: string
  // Economic worth
  economic_value_usd: number
  affected_population_count: number
  annual_deaths: number
  existing_solutions: number
  capital_deployed_usd: number
  capital_needed_usd: number
  customer_segments: string[]
  who_has_problem: string
  // 10/10 scoring
  problem_score: number
  team_score: number
  solution_score: number
  lead_score: number
  offer_score: number
}

export interface ProblemWithCategory extends Problem {
  category_name: string | null
  category_slug: string | null
  category_icon: string | null
  category_color: string | null
}

export interface PipelineRun {
  id: number
  started_at: string
  completed_at: string | null
  status: 'running' | 'completed' | 'failed'
  problems_found: number
  problems_created: number
  problems_updated: number
  error_message: string | null
}

export interface DashboardStats {
  total_problems: number
  total_categories: number
  last_updated: string | null
}

export interface Company {
  id: number
  name: string
  ticker: string | null
  category_id: number | null
  company_type: 'public' | 'crypto' | 'private'
  coingecko_id: string | null
  market_cap_usd: number | null
  market_cap_change_24h: number | null
  price_usd: number | null
  description: string | null
  logo_url: string | null
  website_url: string | null
  problem_solving: string | null
  last_updated_at: string
}

export interface CompanyWithCategory extends Company {
  category_name: string | null
  category_icon: string | null
  category_color: string | null
}

export interface CategoryCapital {
  category_id: number
  total_market_cap_usd: number
  company_count: number
  top_company_name: string | null
  top_company_market_cap: number | null
  last_updated_at: string
  category_name: string
  category_slug: string
  category_icon: string | null
  category_color: string | null
}

export interface CapitalStats {
  total_capital: number
  total_companies: number
  categories_funded: number
}

// ═══════════════════════════════════════
// PLAYERS & WORK PREFERENCES
// ═══════════════════════════════════════

export type ContributionType = 'research' | 'build' | 'invest' | 'connect'

export interface WorkPreferences {
  contribution: ContributionType | null
  remote: boolean
  freedom: boolean
}

export interface Player {
  id: number
  email: string
  display_name: string | null
  google_id: string | null
  player_type: ContributionType | null
  interests: string[]
  skills: string[]
  location: string | null
  risk_tolerance: 'low' | 'medium' | 'high' | null
  time_commitment: 'hobby' | 'side-project' | 'full-time' | 'all-in' | null
  work_preferences: WorkPreferences | null
  last_active_at: string
  created_at: string
}

export interface XAccount {
  id: number
  handle: string
  display_name: string
  bio: string | null
  category_id: number | null
  relevance_tags: string[]
  follower_count: number | null
  why_follow: string
  url: string
  category_name?: string | null
  category_icon?: string | null
}

export interface JobOpportunity {
  id: number
  company_id: number | null
  title: string
  description: string | null
  location: string | null
  job_type: 'full-time' | 'part-time' | 'contract' | 'remote' | null
  url: string
  skills_required: string[]
  problem_solving: string | null
  salary_range: string | null
  is_active: boolean
  created_at: string
  // joined fields
  company_name?: string | null
  company_type?: string | null
  company_logo?: string | null
  category_name?: string | null
  category_icon?: string | null
}
