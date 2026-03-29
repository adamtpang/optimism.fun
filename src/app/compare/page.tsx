'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { usePlayers } from '@/lib/use-players'
import { CATEGORIES } from '@/lib/players'
import type { EloPlayer } from '@/lib/players'

export default function ComparePage() {
  const { vote, getMatchup, hydrated } = usePlayers()
  const [matchup, setMatchup] = useState<[EloPlayer, EloPlayer] | null>(null)
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [sessionVotes, setSessionVotes] = useState(0)
  const [lastResult, setLastResult] = useState<{
    winnerId: string
    winnerName: string
    winnerDelta: number
    loserName: string
    loserDelta: number
  } | null>(null)
  const [animating, setAnimating] = useState(false)

  const nextMatchup = useCallback(() => {
    const m = getMatchup(category)
    setMatchup(m)
    setAnimating(false)
  }, [getMatchup, category])

  // Keep a ref so setTimeout always calls the latest version
  const nextMatchupRef = useRef(nextMatchup)
  useEffect(() => {
    nextMatchupRef.current = nextMatchup
  }, [nextMatchup])

  // Only load initial matchup on hydration or category change
  useEffect(() => {
    if (hydrated) nextMatchup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, category])

  const handleVote = (winnerId: string) => {
    if (!matchup || animating) return
    const [a, b] = matchup
    const winner = a.id === winnerId ? a : b
    const loser = a.id === winnerId ? b : a

    const result = vote(winnerId, loser.id)
    if (!result) return

    setAnimating(true)
    setLastResult({
      winnerId,
      winnerName: winner.name,
      winnerDelta: result.winnerEloAfter - result.winnerEloBefore,
      loserName: loser.name,
      loserDelta: result.loserEloAfter - result.loserEloBefore,
    })
    setSessionVotes((v) => v + 1)

    setTimeout(() => nextMatchupRef.current(), 1200)
  }

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-amber-400 font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-4">
              Head to Head
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">
              Who&rsquo;s contributing more?
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
              Pick who you think is contributing more to solving civilization&rsquo;s problems. Your votes update Elo ratings.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setCategory(undefined)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !category
                  ? 'bg-amber-600 text-white'
                  : 'text-zinc-500 hover:text-zinc-100 border border-white/5'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-amber-600 text-white'
                    : 'text-zinc-500 hover:text-zinc-100 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Matchup */}
          {matchup ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {matchup.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleVote(player.id)}
                  disabled={animating}
                  className={`group relative text-left p-6 sm:p-8 rounded-xl border transition-all duration-200 ${
                    animating && lastResult?.winnerId === player.id
                      ? 'border-amber-500 bg-amber-500/10 scale-[1.02]'
                      : animating
                        ? 'border-white/5 opacity-60'
                        : 'card-space hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer'
                  }`}
                >
                  {/* Type badge */}
                  <span
                    className={`inline-block text-[10px] px-2 py-0.5 rounded-full border mb-3 ${
                      player.type === 'person'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}
                  >
                    {player.type}
                  </span>

                  {/* Name */}
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-100 group-hover:text-amber-400 transition-colors mb-2">
                    {player.name}
                  </h2>

                  {/* Bio */}
                  <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
                    {player.bio}
                  </p>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {player.category.map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-500"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Elo */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-amber-400">
                      {player.elo}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      Elo
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinc-500 text-sm">
                Not enough players in this category. Try a different filter.
              </p>
            </div>
          )}

          {/* Last result */}
          {lastResult && (
            <div className="text-center mb-6 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm text-zinc-100 font-medium">
                  {lastResult.winnerName}
                </span>
                <span className="text-xs text-green-400 font-mono">
                  +{lastResult.winnerDelta || '...'}
                </span>
                <span className="text-zinc-400 text-xs">vs</span>
                <span className="text-sm text-zinc-500">
                  {lastResult.loserName}
                </span>
                <span className="text-xs text-red-400 font-mono">
                  {lastResult.loserDelta || '...'}
                </span>
              </div>
            </div>
          )}

          {/* Session stats + skip */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-zinc-400">
              <span className="font-display font-bold text-zinc-100">
                {sessionVotes}
              </span>{' '}
              votes this session
            </div>
            <button
              onClick={nextMatchup}
              disabled={animating}
              className="text-zinc-400 hover:text-amber-400 transition-colors text-xs"
            >
              Skip &rarr;
            </button>
            <Link
              href="/players"
              className="text-zinc-400 hover:text-amber-400 transition-colors text-xs"
            >
              View Rankings &rarr;
            </Link>
          </div>

          {/* Quote */}
          <div className="mt-16 text-center">
            <p className="text-sm text-zinc-400 italic max-w-lg mx-auto">
              &ldquo;Optimism is a duty. The future is open.&rdquo;
              <span className="block mt-1 not-italic text-zinc-500">
                &mdash; Karl Popper
              </span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
