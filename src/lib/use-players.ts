'use client'

import { useState, useCallback, useEffect } from 'react'
import { SEED_PLAYERS, type EloPlayer } from './players'
import { applyMatch, calculateElo, getRandomMatchup, type MatchResult } from './elo'

const STORAGE_KEY = 'optimism-players'
const MATCHES_KEY = 'optimism-matches'

function loadPlayers(): EloPlayer[] {
  if (typeof window === 'undefined') return structuredClone(SEED_PLAYERS)
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return structuredClone(SEED_PLAYERS)
}

function savePlayers(players: EloPlayer[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players))
  } catch {}
}

function loadMatches(): MatchResult[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(MATCHES_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return []
}

function saveMatches(matches: MatchResult[]) {
  try {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches))
  } catch {}
}

export function usePlayers() {
  const [players, setPlayers] = useState<EloPlayer[]>(() => loadPlayers())
  const [matches, setMatches] = useState<MatchResult[]>(() => loadMatches())
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setPlayers(loadPlayers())
    setMatches(loadMatches())
    setHydrated(true)
  }, [])

  const vote = useCallback(
    (winnerId: string, loserId: string): MatchResult | null => {
      // Pre-calculate the result from current state for immediate return
      const winnerCurrent = players.find((p) => p.id === winnerId)
      const loserCurrent = players.find((p) => p.id === loserId)
      if (!winnerCurrent || !loserCurrent) return null

      const { winnerNewElo, loserNewElo } = calculateElo(winnerCurrent, loserCurrent)
      const date = new Date().toISOString().split('T')[0]
      const result: MatchResult = {
        winnerId,
        loserId,
        winnerEloBefore: winnerCurrent.elo,
        loserEloBefore: loserCurrent.elo,
        winnerEloAfter: winnerNewElo,
        loserEloAfter: loserNewElo,
        date,
      }

      setPlayers((prev) => {
        const next = structuredClone(prev)
        const winner = next.find((p) => p.id === winnerId)
        const loser = next.find((p) => p.id === loserId)
        if (!winner || !loser) return prev

        applyMatch(winner, loser)
        savePlayers(next)
        return next
      })

      setMatches((prevMatches) => {
        const updated = [...prevMatches, result]
        saveMatches(updated)
        return updated
      })

      return result
    },
    [players],
  )

  const getMatchup = useCallback(
    (category?: string) => getRandomMatchup(players, category),
    [players],
  )

  const getPlayer = useCallback(
    (id: string) => players.find((p) => p.id === id) ?? null,
    [players],
  )

  const resetAll = useCallback(() => {
    const fresh = structuredClone(SEED_PLAYERS)
    setPlayers(fresh)
    setMatches([])
    savePlayers(fresh)
    saveMatches([])
  }, [])

  return {
    players,
    matches,
    hydrated,
    vote,
    getMatchup,
    getPlayer,
    resetAll,
  }
}
