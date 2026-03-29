'use client'

import { use } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { usePlayers } from '@/lib/use-players'

export default function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { getPlayer, matches, hydrated } = usePlayers()
  const player = getPlayer(id)

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!player) {
    return (
      <>
        <Navbar />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-2xl font-bold text-zinc-100 mb-4">
              Player not found
            </h1>
            <Link
              href="/players"
              className="text-amber-400 hover:underline text-sm"
            >
              &larr; Back to rankings
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Get match history for this player
  const playerMatches = matches
    .filter((m) => m.winnerId === id || m.loserId === id)
    .reverse()
    .slice(0, 20)

  // Elo history chart data
  const eloHistory = player.eloHistory
  const minElo = Math.min(...eloHistory.map((h) => h.elo)) - 20
  const maxElo = Math.max(...eloHistory.map((h) => h.elo)) + 20
  const eloRange = maxElo - minElo || 1

  // Build SVG path for sparkline
  const chartWidth = 600
  const chartHeight = 120
  const points = eloHistory.map((h, i) => {
    const x = eloHistory.length === 1 ? chartWidth / 2 : (i / (eloHistory.length - 1)) * chartWidth
    const y = chartHeight - ((h.elo - minElo) / eloRange) * chartHeight
    return `${x},${y}`
  })
  const pathD = points.length > 1 ? `M ${points.join(' L ')}` : ''

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-8">
            <Link
              href="/players"
              className="hover:text-amber-400 transition-colors"
            >
              Players
            </Link>
            <span>/</span>
            <span className="text-zinc-300">
              {player.name}
            </span>
          </div>

          {/* Hero */}
          <div className="mb-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span
                  className={`inline-block text-[10px] px-2 py-0.5 rounded-full border mb-3 ${
                    player.type === 'person'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  }`}
                >
                  {player.type}
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100 mb-2">
                  {player.name}
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base max-w-lg">
                  {player.bio}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="font-display text-4xl sm:text-5xl font-bold text-amber-400">
                  {player.elo}
                </div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                  Current Elo
                </div>
              </div>
            </div>

            {/* Category tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {player.category.map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-400"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl card-space p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-amber-400">
                  {player.peakElo}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Peak Elo
                </div>
              </div>
              <div className="rounded-xl card-space p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-zinc-100">
                  {playerMatches.filter((m) => m.winnerId === id).length}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Wins
                </div>
              </div>
              <div className="rounded-xl card-space p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-zinc-100">
                  {playerMatches.filter((m) => m.loserId === id).length}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Losses
                </div>
              </div>
            </div>
          </div>

          {/* Elo history chart */}
          {eloHistory.length > 1 && (
            <div className="mb-10">
              <h2 className="text-amber-400 font-medium tracking-[0.25em] uppercase text-xs mb-4">
                Elo History
              </h2>
              <div className="rounded-xl card-space p-4 sm:p-6">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-auto"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                    <line
                      key={pct}
                      x1="0"
                      y1={chartHeight * pct}
                      x2={chartWidth}
                      y2={chartHeight * pct}
                      className="stroke-white/5"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Line */}
                  <path
                    d={pathD}
                    fill="none"
                    className="stroke-amber-500"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Dots */}
                  {points.map((point, i) => {
                    const [cx, cy] = point.split(',').map(Number)
                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r="3"
                        className="fill-amber-500"
                      />
                    )
                  })}
                </svg>
                <div className="flex justify-between mt-2 text-[10px] text-zinc-400">
                  <span>{eloHistory[0].date}</span>
                  <span>{eloHistory[eloHistory.length - 1].date}</span>
                </div>
              </div>
            </div>
          )}

          {/* Match history */}
          {playerMatches.length > 0 && (
            <div className="mb-10">
              <h2 className="text-amber-400 font-medium tracking-[0.25em] uppercase text-xs mb-4">
                Recent Matches
              </h2>
              <div className="space-y-2">
                {playerMatches.map((match, i) => {
                  const isWinner = match.winnerId === id
                  const opponentId = isWinner ? match.loserId : match.winnerId
                  const opponent = getPlayer(opponentId)

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl card-space"
                    >
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isWinner
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {isWinner ? 'W' : 'L'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-zinc-500">vs </span>
                        <Link
                          href={`/players/${opponentId}`}
                          className="text-sm font-medium text-zinc-100 hover:text-amber-400 transition-colors"
                        >
                          {opponent?.name ?? opponentId}
                        </Link>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span
                          className={`text-xs font-mono ${
                            isWinner
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {isWinner
                            ? `+${match.winnerEloAfter - match.winnerEloBefore}`
                            : `${match.loserEloAfter - match.loserEloBefore}`}
                        </span>
                        <span className="text-[10px] text-zinc-400 ml-2">
                          {match.date}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-sm font-medium transition-colors"
            >
              Compare Players
            </Link>
            <Link
              href="/players"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/30 text-purple-300 hover:bg-white/5 text-sm font-medium transition-colors"
            >
              &larr; All Players
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
