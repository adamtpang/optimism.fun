import type { Domain } from '@/data/types'
import type { SkillId } from '@/lib/where-match'

export const PLAYER_CARD_STORAGE_KEY = 'optimism.playerCard.v1'

export const CAPITAL_BANDS = ['none', 'personal', 'raise', 'allocates'] as const
export type CapitalBand = (typeof CAPITAL_BANDS)[number]

export const TIME_BANDS = ['none', 'hours', 'nights', 'full-time', 'decade'] as const
export type TimeBand = (typeof TIME_BANDS)[number]

export const RISK_BANDS = ['none', 'low', 'medium', 'high'] as const
export type RiskBand = (typeof RISK_BANDS)[number]

export type PlayerCard = {
  skills: SkillId[]
  domains: Domain[]
  places: string[]
  communities: string[]
  networks: string[]
  capital: CapitalBand
  time: TimeBand
  risk: RiskBand
}

export type PlayerOptions = {
  skills: { id: SkillId; label: string }[]
  domains: { id: Domain; label: string }[]
  places: string[]
  communities: { id: string; label: string }[]
  networks: { id: string; label: string; group: 'company' | 'founder' }[]
}

export const CAPITAL_LABEL: Record<CapitalBand, string> = {
  none: 'No capital to deploy',
  personal: 'Personal money, amount not on the card',
  raise: 'Can raise',
  allocates: "Allocates other people's capital",
}

export const TIME_LABEL: Record<TimeBand, string> = {
  none: 'Time not stated',
  hours: 'A few hours a week',
  nights: 'Nights and weekends',
  'full-time': 'Full time',
  decade: 'A decade',
}

export const RISK_LABEL: Record<RiskBand, string> = {
  none: 'Risk appetite not stated',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function emptyPlayerCard(): PlayerCard {
  return {
    skills: [],
    domains: [],
    places: [],
    communities: [],
    networks: [],
    capital: 'none',
    time: 'none',
    risk: 'none',
  }
}

export function cardIsEmpty(card: PlayerCard): boolean {
  return (
    card.skills.length === 0 &&
    card.domains.length === 0 &&
    card.places.length === 0 &&
    card.communities.length === 0 &&
    card.networks.length === 0 &&
    card.capital === 'none' &&
    card.time === 'none' &&
    card.risk === 'none'
  )
}

function uniq(values: string[]): string[] {
  return [...new Set(values)]
}

function asBand<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback
}

/** Drops anything that is not on the option lists. Unknown fields cannot become a match reason. */
export function parsePlayerCard(input: unknown, options: PlayerOptions): PlayerCard | null {
  if (!input || typeof input !== 'object') return null
  const raw = input as Record<string, unknown>
  const skills = new Set(options.skills.map((item) => item.id))
  const domains = new Set(options.domains.map((item) => item.id))
  const places = new Set(options.places)
  const communities = new Set(options.communities.map((item) => item.id))
  const networks = new Set(options.networks.map((item) => item.id))
  const strings = (value: unknown, allowed: Set<string>) =>
    Array.isArray(value) ? uniq(value.filter((item): item is string => typeof item === 'string' && allowed.has(item))) : []

  return {
    skills: strings(raw.skills, skills) as SkillId[],
    domains: strings(raw.domains, domains) as Domain[],
    places: strings(raw.places, places),
    communities: strings(raw.communities, communities),
    networks: strings(raw.networks, networks),
    capital: asBand(raw.capital, CAPITAL_BANDS, 'none'),
    time: asBand(raw.time, TIME_BANDS, 'none'),
    risk: asBand(raw.risk, RISK_BANDS, 'none'),
  }
}

export function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function fromBase64Url(token: string): string {
  const cleaned = token.replace(/-/g, '+').replace(/_/g, '/')
  const padded = cleaned + '='.repeat((4 - (cleaned.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function encodePlayerCard(card: PlayerCard): string {
  if (cardIsEmpty(card)) return ''
  const slim: Record<string, unknown> = {}
  if (card.skills.length) slim.skills = card.skills
  if (card.domains.length) slim.domains = card.domains
  if (card.places.length) slim.places = card.places
  if (card.communities.length) slim.communities = card.communities
  if (card.networks.length) slim.networks = card.networks
  if (card.capital !== 'none') slim.capital = card.capital
  if (card.time !== 'none') slim.time = card.time
  if (card.risk !== 'none') slim.risk = card.risk
  return toBase64Url(JSON.stringify(slim))
}

export function decodePlayerCard(token: string, options: PlayerOptions): PlayerCard | null {
  if (!token) return null
  try {
    return parsePlayerCard(JSON.parse(fromBase64Url(token)), options)
  } catch {
    return null
  }
}

export function playerCardLines(card: PlayerCard, options: PlayerOptions): string[] {
  const label = (ids: string[], rows: { id: string; label: string }[]) =>
    ids.map((id) => rows.find((row) => row.id === id)?.label ?? id)
  return [
    'Player card',
    'On this device only. Not an account.',
    card.skills.length ? `Skills: ${label(card.skills, options.skills).join(', ')}` : 'Skills: not stated',
    card.domains.length ? `Domains: ${label(card.domains, options.domains).join(', ')}` : 'Domains: not stated',
    card.places.length ? `Places: ${card.places.join(', ')}` : 'Places: not stated',
    card.communities.length
      ? `Communities: ${label(card.communities, options.communities).join(', ')}`
      : 'Communities: not stated',
    card.networks.length ? `Networks: ${label(card.networks, options.networks).join(', ')}` : 'Networks: not stated',
    `Capital: ${CAPITAL_LABEL[card.capital]}`,
    `Time: ${TIME_LABEL[card.time]}`,
    `Risk appetite: ${RISK_LABEL[card.risk]}`,
  ]
}
