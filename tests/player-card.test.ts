import { describe, expect, it } from 'vitest'
import {
  cardIsEmpty,
  decodePlayerCard,
  emptyPlayerCard,
  encodePlayerCard,
  parsePlayerCard,
  type PlayerOptions,
} from '@/lib/player-card'
import { buildPlayerOptions } from '@/lib/quest-board'

const options: PlayerOptions = {
  skills: [{ id: 'bio', label: 'Biology' }],
  domains: [{ id: 'health', label: 'Health' }],
  technologies: [{ id: 'ai', label: 'AI' }],
  places: ['Kenya', 'USA'],
  communities: [{ id: 'emergent-ventures', label: 'Emergent Ventures' }],
  networks: [{ id: 'company:moderna', label: 'Moderna', group: 'company' }],
}

describe('player card', () => {
  it('round-trips a card and drops fields that are not on the option list', () => {
    const card = {
      ...emptyPlayerCard(),
      skills: ['bio' as const],
      domains: ['health' as const],
      places: ['Kenya'],
      communities: ['emergent-ventures'],
      networks: ['company:moderna'],
      capital: 'raise' as const,
      time: 'decade' as const,
      risk: 'high' as const,
    }
    const decoded = decodePlayerCard(encodePlayerCard(card), options)
    expect(decoded).toEqual(card)
    expect(encodePlayerCard(emptyPlayerCard())).toBe('')
    expect(cardIsEmpty(emptyPlayerCard())).toBe(true)

    const parsed = parsePlayerCard(
      {
        skills: ['bio', 'not-a-skill'],
        places: ['Kenya', 'Atlantis'],
        communities: ['made-up-fund'],
        capital: 'a billion dollars',
        secret: 'do not keep',
      },
      options,
    )
    expect(parsed).toEqual({
      ...emptyPlayerCard(),
      skills: ['bio'],
      places: ['Kenya'],
    })
  })

  it('rejects a broken share token', () => {
    expect(decodePlayerCard('not-valid-base64', options)).toBeNull()
    expect(decodePlayerCard('', buildPlayerOptions())).toBeNull()
  })
})
