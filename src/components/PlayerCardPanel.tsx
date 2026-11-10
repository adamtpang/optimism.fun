'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { Domain } from '@/data/types'
import {
  CAPITAL_BANDS,
  CAPITAL_LABEL,
  PLAYER_CARD_STORAGE_KEY,
  RISK_BANDS,
  RISK_LABEL,
  TIME_BANDS,
  TIME_LABEL,
  cardIsEmpty,
  emptyPlayerCard,
  encodePlayerCard,
  parsePlayerCard,
  playerCardLines,
  type CapitalBand,
  type PlayerCard,
  type PlayerOptions,
  type RiskBand,
  type TimeBand,
} from '@/lib/player-card'
import { matchQuests } from '@/lib/quest-match'
import type { QuestView } from '@/lib/quest-types'
import type { SkillId } from '@/lib/where-match'

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function chipClass(on: boolean): string {
  return `px-3 py-2 text-sm border text-left ${
    on ? 'border-primary text-ink-100 bg-primary/10' : 'border-hair text-ink-300 hover:border-primary'
  }`
}

function paintCard(lines: string[]) {
  const probe = document.createElement('div')
  probe.className = 'bg-background text-ink-100'
  probe.style.position = 'absolute'
  probe.style.left = '-9999px'
  const accent = document.createElement('span')
  accent.className = 'text-primary'
  probe.appendChild(accent)
  document.body.appendChild(probe)
  const ink = getComputedStyle(probe).color
  const paper = getComputedStyle(probe).backgroundColor
  const teal = getComputedStyle(accent).color
  probe.remove()

  const canvas = document.createElement('canvas')
  const width = 640
  const lineHeight = 28
  const pad = 32
  canvas.width = width
  canvas.height = pad * 2 + lines.length * lineHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = teal
  ctx.fillRect(0, 0, 8, canvas.height)
  ctx.font = '16px Inter, sans-serif'
  ctx.textBaseline = 'top'
  lines.forEach((line, index) => {
    ctx.fillStyle = index === 0 ? teal : ink
    ctx.fillText(line.slice(0, 80), pad, pad + index * lineHeight, width - pad * 2)
  })
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = 'optimism-player-card.png'
  link.click()
}

export default function PlayerCardPanel({
  options,
  initialCard,
  tokenInvalid,
  quests,
  showMatches,
  preselected = null,
}: {
  options: PlayerOptions
  initialCard: PlayerCard | null
  tokenInvalid: boolean
  quests: QuestView[]
  showMatches: boolean
  preselected?: { name: string; href: string; gap: string | null } | null
}) {
  const [card, setCard] = useState<PlayerCard>(initialCard ?? emptyPlayerCard())
  const [ready, setReady] = useState(Boolean(initialCard))
  const [filter, setFilter] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!initialCard) {
      try {
        const raw = window.localStorage.getItem(PLAYER_CARD_STORAGE_KEY)
        const parsed = raw ? parsePlayerCard(JSON.parse(raw), options) : null
        if (parsed) setCard(parsed)
      } catch {
        // A broken local card is ignored.
      }
    }
    setReady(true)
  }, [initialCard, options])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(PLAYER_CARD_STORAGE_KEY, JSON.stringify(card))
    const token = encodePlayerCard(card)
    const url = new URL(window.location.href)
    if (token) url.searchParams.set('card', token)
    else url.searchParams.delete('card')
    window.history.replaceState(null, '', `${url.pathname}${url.search}`)
  }, [card, ready])

  const matches = useMemo(() => (showMatches ? matchQuests(card, quests, options) : []), [card, options, quests, showMatches])
  const token = encodePlayerCard(card)
  const sharePath = token ? `/where?card=${encodeURIComponent(token)}` : '/where'
  const networkQuery = filter.trim().toLowerCase()
  const networks = options.networks.filter((row) => !networkQuery || row.label.toLowerCase().includes(networkQuery)).slice(0, 40)

  function patch(next: PlayerCard) {
    setCard(next)
    setCopied(false)
  }

  async function copyLink() {
    const absolute = `${window.location.origin}${sharePath}`
    try {
      await navigator.clipboard.writeText(absolute)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-w-0">
      {tokenInvalid && (
        <p className="text-sm text-ink-400 mb-4">That share link could not be read. The card on this device was left as it was.</p>
      )}

      <fieldset className="border border-hair p-4">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">Skills</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {options.skills.map((skill) => (
            <button
              key={skill.id}
              type="button"
              aria-pressed={card.skills.includes(skill.id)}
              onClick={() => patch({ ...card, skills: toggle(card.skills, skill.id as SkillId) })}
              className={chipClass(card.skills.includes(skill.id))}
            >
              {skill.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-hair p-4 mt-3">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">Domains</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {options.domains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              aria-pressed={card.domains.includes(domain.id)}
              onClick={() => patch({ ...card, domains: toggle(card.domains, domain.id as Domain) })}
              className={chipClass(card.domains.includes(domain.id))}
            >
              {domain.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-hair p-4 mt-3">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">Technologies</legend>
        <p className="text-sm text-ink-400 mt-2">
          Enabling tools, not problems. A technology matches only when a sourced company on the quest carries that tag.
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {options.technologies.map((technology) => (
            <button
              key={technology.id}
              type="button"
              aria-pressed={card.technologies.includes(technology.id)}
              onClick={() => patch({ ...card, technologies: toggle(card.technologies, technology.id) })}
              className={chipClass(card.technologies.includes(technology.id))}
            >
              {technology.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-hair p-4 mt-3">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">Places</legend>
        <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto">
          {options.places.map((place) => (
            <button
              key={place}
              type="button"
              aria-pressed={card.places.includes(place)}
              onClick={() => patch({ ...card, places: toggle(card.places, place) })}
              className={chipClass(card.places.includes(place))}
            >
              {place}
            </button>
          ))}
        </div>
      </fieldset>

      <details className="border border-hair p-4 mt-3">
        <summary className="cursor-pointer font-mono text-small uppercase tracking-wider text-ink-500">
          Communities you can reach ({options.communities.length})
        </summary>
        <div className="flex flex-wrap gap-2 mt-3 max-h-48 overflow-y-auto">
          {options.communities.map((community) => (
            <button
              key={community.id}
              type="button"
              aria-pressed={card.communities.includes(community.id)}
              onClick={() => patch({ ...card, communities: toggle(card.communities, community.id) })}
              className={chipClass(card.communities.includes(community.id))}
            >
              {community.label}
            </button>
          ))}
        </div>
      </details>

      <details className="border border-hair p-4 mt-3">
        <summary className="cursor-pointer font-mono text-small uppercase tracking-wider text-ink-500">
          Networks ({options.networks.length})
        </summary>
        <label className="block mt-3 text-sm text-ink-400" htmlFor="network-filter">
          Filter sourced companies and founders
        </label>
        <input
          id="network-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="mt-2 w-full border border-hair bg-background px-3 py-2 text-sm text-ink-100"
          autoComplete="off"
        />
        {card.networks.length > 0 && (
          <p className="text-sm text-ink-300 mt-2 break-words">
            Selected: {card.networks.map((id) => options.networks.find((row) => row.id === id)?.label ?? id).join(', ')}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3 max-h-48 overflow-y-auto">
          {networks.map((network) => (
            <button
              key={network.id}
              type="button"
              aria-pressed={card.networks.includes(network.id)}
              onClick={() => patch({ ...card, networks: toggle(card.networks, network.id) })}
              className={chipClass(card.networks.includes(network.id))}
            >
              {network.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-ink-500 mt-2">Showing {networks.length} names. The list is the sourced set, not a search of the world.</p>
      </details>

      <fieldset className="border border-hair p-4 mt-3">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">Capital</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {CAPITAL_BANDS.filter((band) => band !== 'none').map((band) => (
            <button
              key={band}
              type="button"
              aria-pressed={card.capital === band}
              onClick={() => patch({ ...card, capital: (card.capital === band ? 'none' : band) as CapitalBand })}
              className={chipClass(card.capital === band)}
            >
              {CAPITAL_LABEL[band]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-hair p-4 mt-3">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">Time</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {TIME_BANDS.filter((band) => band !== 'none').map((band) => (
            <button
              key={band}
              type="button"
              aria-pressed={card.time === band}
              onClick={() => patch({ ...card, time: (card.time === band ? 'none' : band) as TimeBand })}
              className={chipClass(card.time === band)}
            >
              {TIME_LABEL[band]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-hair p-4 mt-3">
        <legend className="font-mono text-small uppercase tracking-wider text-ink-500 px-1">Risk appetite</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {RISK_BANDS.filter((band) => band !== 'none').map((band) => (
            <button
              key={band}
              type="button"
              aria-pressed={card.risk === band}
              onClick={() => patch({ ...card, risk: (card.risk === band ? 'none' : band) as RiskBand })}
              className={chipClass(card.risk === band)}
            >
              {RISK_LABEL[band]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-2 mt-4">
        <button type="button" onClick={() => patch(emptyPlayerCard())} className="px-3 py-2 text-sm border border-hair text-ink-300">
          Clear card
        </button>
        <button type="button" onClick={() => paintCard(playerCardLines(card, options))} className="px-3 py-2 text-sm border border-primary text-primary">
          Download card image
        </button>
        <button type="button" onClick={copyLink} className="px-3 py-2 text-sm border border-primary text-primary">
          {copied ? 'Link copied' : 'Copy share link'}
        </button>
      </div>
      <p className="text-sm text-ink-500 mt-3 break-all">{sharePath}</p>
      <p className="text-sm text-ink-500 mt-2">
        Saved in this browser only. Nothing is sent and nothing is written into the repository.
        {showMatches ? '' : (
          <>
            {' '}
            <Link href={sharePath} className="text-primary hover:underline">
              See where this card fits
            </Link>
          </>
        )}
      </p>

      {showMatches && preselected && (
        <article className="border border-dashed border-primary bg-neutral-50 p-4 mt-6 min-w-0">
          <p className="font-mono text-small uppercase tracking-wider text-primary">Preselected quest</p>
          <h2 className="font-serif text-2xl text-ink-100 mt-2 break-words">
            <Link href={preselected.href} className="hover:text-primary">
              {preselected.name}
            </Link>
          </h2>
          {preselected.gap && <p className="text-sm text-ink-300 mt-2 break-words">Gap: {preselected.gap}</p>}
          <p className="text-sm text-ink-400 mt-2">
            Opened from an open quest. Fill the card to see whether your fields match it. The priority rank is unchanged.
          </p>
        </article>
      )}

      {showMatches && (
        <section className="mt-10">
          <h2 className="font-serif text-3xl text-ink-100">Matches</h2>
          <p className="text-sm text-ink-400 mt-3 max-w-2xl">
            Order is the rule list: an intersection with the thinner named side, then domain, skill, technology tag, filling that side, place, community, network, and risk appetite. Ties use the existing site rank. No fit score is computed.
          </p>
          {cardIsEmpty(card) ? (
            <p className="border border-hair p-4 mt-4 text-ink-400">
              Fill in the card. This page will not pretend the top of the ranking is a personal fit.
            </p>
          ) : matches.length === 0 ? (
            <p className="border border-hair p-4 mt-4 text-ink-400">Nothing on the index meets the fields on this card.</p>
          ) : (
            <ol className="mt-4 space-y-4">
              {matches.map((match, index) => (
                <li key={match.slug} className="border border-hair p-4 min-w-0">
                  <p className="font-mono text-small uppercase tracking-wider text-ink-500">
                    {index + 1} · site rank {match.rank}
                  </p>
                  <h3 className="font-serif text-2xl text-ink-100 mt-1 break-words">
                    <Link href={match.href} className="hover:text-primary">
                      {match.name}
                    </Link>
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {match.reasons.map((reason) => (
                      <li key={reason} className="text-sm text-ink-300 break-words">
                        {reason}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-ink-100 mt-4 break-words">
                    <span className="font-mono text-small uppercase tracking-wider text-primary">What only you could do. </span>
                    {match.onlyYou}
                  </p>
                  {match.playerGaps.length > 0 && (
                    <div className="mt-4">
                      <p className="font-mono text-small uppercase tracking-wider text-ink-500">Gaps to fill</p>
                      <ul className="mt-2 space-y-1">
                        {match.playerGaps.map((gap) => (
                          <li key={gap} className="text-sm text-ink-400 break-words">
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {match.dataGaps.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {match.dataGaps.map((gap) => (
                        <li key={gap} className="text-sm text-ink-500">
                          {gap}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-4 text-sm break-words">
                    <span className="font-mono text-small uppercase tracking-wider text-primary">First action. </span>
                    <a href={match.firstAction.url} className="text-ink-100 hover:text-primary">
                      {match.firstAction.name}
                    </a>
                  </p>
                  <p className="text-sm text-ink-400 mt-1 break-words">{match.firstAction.detail}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </div>
  )
}
