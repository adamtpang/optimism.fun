/**
 * Adam's real personal-fittedness profile — sourced from adampang.com and
 * themain.quest, not re-typed from memory each session.
 *
 * Why this exists: HANDOFF_FIT_AND_CROWDING_2026-08-18.md's hub session
 * reconstructed a fittedness rubric by hand across seven parallel scoring
 * agents instead of reading it from a real source. This file is that real
 * source. Every fact below traces to a specific file — re-derive by
 * re-reading those files if Adam's real profile changes, don't hand-edit
 * this into staleness.
 */
import type { Domain } from './types'
import type { ArchetypeKey } from './archetypes'

export const ADAM_PROFILE_SOURCES = {
  mission: 'Aether/themain.quest/CLAUDE_PROJECT_CONTEXT.md',
  proofOfWork: 'Aether/adampang.com/src/data/apps.ts',
  milestones: 'Aether/adampang.com/src/data/milestones.ts',
  archetypeFramework: 'this repo — src/data/archetypes.ts',
  asOf: '2026-08-18',
}

/**
 * Archetype weights, not a single pick — real people are rarely purely one
 * archetype. Missionary from themain.quest's mission (species-level
 * stakes, "solve the relevant problems that matter... with optimism",
 * decade-plus commitments, the Elon-book themes in its knowledge library).
 * Scientist from the actual shipped pattern (philosophy + software rabbit
 * holes, adampang.com's own "knowsAbout": software engineering, indie
 * hacking, philosophy). Craftsman from music (strummer.fun, wonderhall.live,
 * 2020-present) and adampang.com's own design-token obsessiveness. This
 * ranking (Missionary > Scientist > Craftsman) matches what the hub session
 * independently found across its 7 scoring agents.
 */
export const ARCHETYPE_WEIGHTS: Record<ArchetypeKey, number> = {
  missionary: 1.0,
  scientist: 0.7,
  craftsman: 0.6,
  evangelist: 0.3,
  operator: 0.3,
  outsider: 0.2,
}

/**
 * Domains with a real, sustained shipping record, from apps.ts's live/
 * shipping list, not aspiration. This codebase's Domain type has no
 * 'civic' or 'music' value; the closest real mappings are used —
 * optimism.fun and summon.guide (civic/coordination) land on governance
 * and social, strummer.fun/wonderhall.live (music, sustained 2020-present)
 * has no clean Domain match and is tracked separately below instead of
 * forced into 'social'.
 */
export const PROVEN_DOMAINS: Domain[] = ['governance', 'social', 'science', 'ai']

/** True if the quest text reads as music/creative-craft shaped, tracked
 * outside the Domain enum since this codebase has no 'music' domain but
 * it's a real, 6-year-sustained proof-of-work category (2020-present). */
export function looksMusicOrCraftShaped(text: string): boolean {
  return /\bmusic|song|creative|craft|taste\b/i.test(text)
}

/**
 * One real anti-signal, not a domain exclusion but a mode exclusion: the
 * Eign engineering trial (2025, one month, quit in December because "it
 * wasn't paying" per milestones.ts), specifically the B2B outreach motion
 * (LinkedIn Sales Navigator). Pure sales-motion quests get a small penalty,
 * not a disqualification — it's one data point, not a law.
 */
export const TRIED_AND_QUIT_KEYWORDS = ['b2b sales', 'sales navigator', 'cold outreach', 'sales team']

/**
 * Recurring themes from themain.quest's verbatim mission statement, used
 * for lightweight keyword overlap against a quest's pitch/goodQuest text.
 * Not NLP — an honest, auditable word list, each theme traceable to a real
 * line in the mission statement rather than an inferred vibe.
 */
export const MISSION_THEMES: { theme: string; keywords: string[] }[] = [
  {
    theme: 'species-level stakes / long time horizon',
    keywords: ['species', 'humanity', 'civilization', 'long-term', 'decade', 'generation'],
  },
  { theme: 'optimism as an active practice', keywords: ['optimism', 'optimistic', 'possibility', 'solvable'] },
  { theme: 'knowledge growth / curiosity', keywords: ['knowledge', 'research', 'science', 'discovery', 'curious'] },
  { theme: 'longevity / immortality / health', keywords: ['longevity', 'aging', 'health', 'lifespan', 'mortality'] },
  {
    theme: 'coordination between people',
    keywords: ['coordination', 'coordinate', 'network', 'community', 'talent', 'capital'],
  },
]
