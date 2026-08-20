/**
 * Personal fittedness — how well a specific quest fits Adam specifically,
 * not a generic visitor. Sibling to src/lib/fit.ts, which scores any
 * visitor against the ranked problems from a submitted profile; this
 * scores Adam's own real, sourced profile (src/data/adam-profile.ts)
 * against any quest in the catalog.
 *
 * Built for HANDOFF_FIT_AND_CROWDING_2026-08-18.md's Task 2, so a future
 * S-tier scan (that handoff's Task 3) reads a live, auditable score
 * instead of a rubric re-typed by hand each session.
 */
import { ARCHETYPES, type ArchetypeKey } from '@/data/archetypes'
import {
  ADAM_PROFILE_SOURCES,
  ARCHETYPE_WEIGHTS,
  PROVEN_DOMAINS,
  MISSION_THEMES,
  TRIED_AND_QUIT_KEYWORDS,
  looksMusicOrCraftShaped,
} from '@/data/adam-profile'
import type { Domain } from '@/data/types'

export type FitCandidate = {
  title: string
  pitch: string
  /** The falsifiable "why it's a good quest" line, if available — carries more of the mission-theme signal than the pitch alone. */
  goodQuest?: string
  domain?: Domain | null
}

export type PersonalFitResult = {
  /** 0..10 — matches the handoff's own blend formula. */
  score: number
  reasons: string[]
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))

function archetypeDomainWeight(domain: Domain | null | undefined): number {
  if (!domain) return 0
  let weight = 0
  for (const [key, archWeight] of Object.entries(ARCHETYPE_WEIGHTS) as [ArchetypeKey, number][]) {
    if (ARCHETYPES[key].domains.includes(domain)) weight = Math.max(weight, archWeight)
  }
  return weight
}

function missionThemeMatches(text: string): string[] {
  const lower = text.toLowerCase()
  return MISSION_THEMES.filter((t) => t.keywords.some((k) => lower.includes(k))).map((t) => t.theme)
}

export function scorePersonalFit(candidate: FitCandidate): PersonalFitResult {
  const reasons: string[] = []
  let raw = 0

  const text = `${candidate.pitch} ${candidate.goodQuest ?? ''}`
  const lowerText = text.toLowerCase()

  const archWeight = archetypeDomainWeight(candidate.domain)
  if (archWeight > 0) {
    raw += archWeight * 4
    reasons.push(
      `Domain fits the archetypes Adam scores highest on (weight ${archWeight.toFixed(1)}/1.0) — ${ADAM_PROFILE_SOURCES.archetypeFramework}.`,
    )
  }

  if (candidate.domain && PROVEN_DOMAINS.includes(candidate.domain)) {
    raw += 3
    reasons.push(`Real, sustained shipping record in this domain, not just a stated interest — ${ADAM_PROFILE_SOURCES.proofOfWork}.`)
  }

  if (looksMusicOrCraftShaped(text)) {
    raw += 2
    reasons.push('Reads as music/creative-craft shaped — a 6-year sustained proof-of-work category (2020-present), no clean Domain match in this codebase so tracked separately.')
  }

  const themes = missionThemeMatches(text)
  if (themes.length > 0) {
    raw += Math.min(themes.length, 3)
    reasons.push(`Overlaps his own mission themes: ${themes.join(', ')} — ${ADAM_PROFILE_SOURCES.mission}.`)
  }

  if (TRIED_AND_QUIT_KEYWORDS.some((k) => lowerText.includes(k))) {
    raw -= 1.5
    reasons.push('Leans on a B2B-sales-shaped motion — the one mode he already tried and quit (Eign, 2025, "wasn\'t paying").')
  }

  if (reasons.length === 0) {
    reasons.push('No strong personal-fit signal either way — judge this one on the core numbers alone.')
  }

  return { score: clamp(Math.round(raw * 10) / 10, 0, 10), reasons }
}

/** The hub session's own blend formula, from HANDOFF_FIT_AND_CROWDING_2026-08-18.md. */
export function blendWithCoreScore(coreScore0to100: number, fitScore0to10: number): number {
  return Math.round(coreScore0to100 * 0.7 + fitScore0to10 * 10 * 0.3)
}
