import type { EloPlayer } from './players'

const K_NEW = 32
const K_ESTABLISHED = 16
const ESTABLISHED_THRESHOLD = 20 // matches before considered established

export interface MatchResult {
  winnerId: string
  loserId: string
  winnerEloBefore: number
  loserEloBefore: number
  winnerEloAfter: number
  loserEloAfter: number
  date: string
}

/** Expected score for player A against player B */
function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

/** Get K-factor based on match history length */
function getKFactor(matchCount: number): number {
  return matchCount < ESTABLISHED_THRESHOLD ? K_NEW : K_ESTABLISHED
}

/** Calculate new Elo ratings after a match */
export function calculateElo(
  winner: EloPlayer,
  loser: EloPlayer,
): { winnerNewElo: number; loserNewElo: number } {
  const expectedWin = expectedScore(winner.elo, loser.elo)
  const expectedLose = expectedScore(loser.elo, winner.elo)

  const kWinner = getKFactor(winner.eloHistory.length)
  const kLoser = getKFactor(loser.eloHistory.length)

  const winnerNewElo = Math.round(winner.elo + kWinner * (1 - expectedWin))
  const loserNewElo = Math.round(loser.elo + kLoser * (0 - expectedLose))

  return { winnerNewElo, loserNewElo }
}

/** Apply a match result to both players, mutating them in place */
export function applyMatch(
  winner: EloPlayer,
  loser: EloPlayer,
): MatchResult {
  const { winnerNewElo, loserNewElo } = calculateElo(winner, loser)
  const date = new Date().toISOString().split('T')[0]

  const result: MatchResult = {
    winnerId: winner.id,
    loserId: loser.id,
    winnerEloBefore: winner.elo,
    loserEloBefore: loser.elo,
    winnerEloAfter: winnerNewElo,
    loserEloAfter: loserNewElo,
    date,
  }

  winner.elo = winnerNewElo
  winner.peakElo = Math.max(winner.peakElo, winnerNewElo)
  winner.eloHistory.push({ date, elo: winnerNewElo })

  loser.elo = loserNewElo
  loser.eloHistory.push({ date, elo: loserNewElo })

  return result
}

/** Pick two random players for a matchup, optionally from the same category */
export function getRandomMatchup(
  players: EloPlayer[],
  category?: string,
): [EloPlayer, EloPlayer] | null {
  const pool = category
    ? players.filter((p) => p.category.includes(category))
    : players

  if (pool.length < 2) return null

  const i = Math.floor(Math.random() * pool.length)
  let j = Math.floor(Math.random() * (pool.length - 1))
  if (j >= i) j++

  return [pool[i], pool[j]]
}
