import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TabNav from '@/components/leaderboards/TabNav'
import { getDb } from '@/lib/db'
import { formatBigNum, formatPop } from '@/lib/format'
import { FOUNDERS_EPISODES } from '@/lib/founders'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Leaderboards | optimism.fun',
  description: 'Rankings of the biggest problems, top companies, crypto, people, and founders solving humanity\'s challenges.',
}

export default async function LeaderboardsPage() {
  const sql = getDb()

  const [problems, companies, xAccounts, countries] = await Promise.all([
    sql`
      SELECT p.slug, p.title, p.composite_score, p.affected_population_count,
             p.annual_deaths, p.economic_value_usd, p.who_has_problem,
             c.name as category_name, c.icon as category_icon
      FROM problems p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'active'
      ORDER BY p.composite_score DESC
    `,
    sql`
      SELECT co.*, c.name as category_name, c.icon as category_icon
      FROM companies co
      LEFT JOIN categories c ON c.id = co.category_id
      ORDER BY co.market_cap_usd DESC NULLS LAST
    `,
    sql`
      SELECT x.*, c.name as category_name, c.icon as category_icon
      FROM x_accounts x
      LEFT JOIN categories c ON c.id = x.category_id
      ORDER BY x.follower_count DESC NULLS LAST
    `,
    sql`
      SELECT * FROM countries ORDER BY gdp_usd DESC NULLS LAST
    `,
  ])

  const byScore = problems.slice(0, 15)
  const byHumans = [...problems].sort((a, b) => Number(b.affected_population_count) - Number(a.affected_population_count)).slice(0, 15)
  const byValue = [...problems].sort((a, b) => Number(b.economic_value_usd) - Number(a.economic_value_usd)).slice(0, 15)

  const allCompanies = companies.filter((c: Record<string, unknown>) => Number(c.market_cap_usd) > 0)
  const cryptoCompanies = allCompanies.filter((c: Record<string, unknown>) => c.company_type === 'crypto')

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <p className="text-amber-400 font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-4">
              Rankings
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">
              Leaderboards
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
              Who has the biggest problems? Who is creating the solutions? Who has the most capital? The scoreboard of human progress.
            </p>
          </div>

          <TabNav />

          {/* ═══ PROBLEMS ═══ */}
          <section id="problems" className="mb-16 scroll-mt-32">
            <h2 className="font-display text-2xl font-bold text-zinc-100 mb-2">
              Problems
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              The biggest problems facing humanity - ranked by score, human impact, and economic value.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">By Score</h3>
                <div className="space-y-2">
                  {byScore.map((p, i) => (
                    <Link key={p.slug as string} href={`/problems/${p.slug}`} className="flex items-center gap-3 p-3 rounded-xl card-space hover:border-amber-500/30 transition-colors group">
                      <span className="text-xs font-mono text-zinc-400 w-5 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-400 truncate transition-colors">{p.title as string}</div>
                        <div className="text-[10px] text-zinc-400">{p.category_icon as string} {p.category_name as string}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-display text-sm font-bold text-amber-400">{Number(p.composite_score).toFixed(1)}</div>
                        <div className="text-[10px] text-zinc-400">score</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Most Humans Affected</h3>
                <div className="space-y-2">
                  {byHumans.map((p, i) => (
                    <Link key={p.slug as string} href={`/problems/${p.slug}`} className="flex items-center gap-3 p-3 rounded-xl card-space hover:border-amber-500/30 transition-colors group">
                      <span className="text-xs font-mono text-zinc-400 w-5 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-400 truncate transition-colors">{p.title as string}</div>
                        <div className="text-[10px] text-zinc-400">{p.category_icon as string} {p.category_name as string}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-display text-sm font-bold text-amber-400">{formatPop(Number(p.affected_population_count))}</div>
                        <div className="text-[10px] text-zinc-400">affected</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Most Economic Value</h3>
                <div className="space-y-2">
                  {byValue.map((p, i) => (
                    <Link key={p.slug as string} href={`/problems/${p.slug}`} className="flex items-center gap-3 p-3 rounded-xl card-space hover:border-amber-500/30 transition-colors group">
                      <span className="text-xs font-mono text-zinc-400 w-5 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-400 truncate transition-colors">{p.title as string}</div>
                        <div className="text-[10px] text-zinc-400">{p.category_icon as string} {p.category_name as string}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-display text-sm font-bold text-amber-400">{formatBigNum(Number(p.economic_value_usd))}</div>
                        <div className="text-[10px] text-zinc-400">value</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══ COMPANIES ═══ */}
          <section id="companies" className="mb-16 scroll-mt-32">
            <h2 className="font-display text-2xl font-bold text-zinc-100 mb-2">
              Companies
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Organizations deploying capital to solve humanity's biggest problems, ranked by market cap.
            </p>
            <div className="space-y-2">
              {allCompanies.slice(0, 20).map((c: Record<string, unknown>, i: number) => (
                <div key={c.id as number} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl card-space">
                  <span className="text-xs font-mono text-zinc-400 w-5 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-100">{c.name as string}</span>
                      {c.ticker ? <span className="text-[10px] font-mono text-zinc-400">{c.ticker as string}</span> : null}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                        c.company_type === 'crypto'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : c.company_type === 'public'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-white/5 text-zinc-500 border-white/10'
                      }`}>
                        {c.company_type as string}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {c.category_icon as string} {c.category_name as string}
                      {c.problem_solving ? <span className="ml-2 text-zinc-500"> - {(c.problem_solving as string).slice(0, 60)}</span> : null}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-display text-sm font-bold text-amber-400">
                      {formatBigNum(Number(c.market_cap_usd))}
                    </div>
                    <div className="text-[10px] text-zinc-400">market cap</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ CRYPTO ═══ */}
          {cryptoCompanies.length > 0 && (
            <section id="crypto" className="mb-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold text-zinc-100 mb-2">
                Crypto
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                Cryptocurrencies and blockchain projects solving real problems, ranked by market cap.
              </p>
              <div className="space-y-2">
                {cryptoCompanies.slice(0, 15).map((c: Record<string, unknown>, i: number) => (
                  <div key={c.id as number} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl card-space">
                    <span className="text-xs font-mono text-zinc-400 w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-100">{c.name as string}</span>
                        {c.ticker ? <span className="text-[10px] font-mono text-purple-500">{c.ticker as string}</span> : null}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {c.category_icon as string} {c.category_name as string}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {Number(c.price_usd) > 0 && (
                        <div className="text-xs text-zinc-400 mb-0.5">
                          ${Number(c.price_usd).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      )}
                      <div className="font-display text-sm font-bold text-amber-400">
                        {formatBigNum(Number(c.market_cap_usd))}
                      </div>
                      {Number(c.market_cap_change_24h) !== 0 && (
                        <div className={`text-[10px] ${Number(c.market_cap_change_24h) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {Number(c.market_cap_change_24h) > 0 ? '+' : ''}{Number(c.market_cap_change_24h).toFixed(1)}% 24h
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ═══ PEOPLE ═══ */}
          {xAccounts.length > 0 && (
            <section id="people" className="mb-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold text-zinc-100 mb-2">
                People
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                The people solving the world's biggest problems, ranked by following.
              </p>
              <div className="space-y-2">
                {xAccounts.slice(0, 20).map((x: Record<string, unknown>, i: number) => (
                  <a
                    key={x.id as number}
                    href={x.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-xl card-space hover:border-amber-500/30 transition-colors group"
                  >
                    <span className="text-xs font-mono text-zinc-400 w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-400 transition-colors">
                        {x.display_name as string}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        @{x.handle as string} · {x.category_icon as string} {x.category_name as string}
                      </div>
                      {x.why_follow ? (
                        <div className="text-xs text-zinc-500 mt-1 line-clamp-1">{x.why_follow as string}</div>
                      ) : null}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display text-sm font-bold text-amber-400">
                        {formatPop(Number(x.follower_count))}
                      </div>
                      <div className="text-[10px] text-zinc-400">followers</div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ═══ FOUNDERS ═══ */}
          <section id="founders" className="mb-16 scroll-mt-32">
            <h2 className="font-display text-2xl font-bold text-zinc-100 mb-2">
              Founders Hall of Fame
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              The greatest founders in history, studied by David Senra on the Founders podcast. Church for the intense.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FOUNDERS_EPISODES.map((ep, i) => (
                <a
                  key={ep.episodeNumber}
                  href={ep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-xl card-space hover:border-amber-500/30 transition-colors group"
                >
                  <span className="text-xs font-mono text-zinc-400 mt-0.5 w-5 text-right flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-amber-400 font-medium mb-0.5">
                      #{ep.episodeNumber} · {ep.subject}
                    </div>
                    <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-400 transition-colors mb-1">
                      {ep.title}
                    </div>
                    <div className="text-xs text-zinc-400 italic line-clamp-1">
                      &ldquo;{ep.keyInsight}&rdquo;
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ═══ COUNTRIES ═══ */}
          {countries.length > 0 && (
            <section id="countries" className="mb-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold text-zinc-100 mb-2">
                Countries
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                The best places on Earth for meaningful work - ranked by GDP, tech friendliness, and startup culture.
              </p>
              <div className="space-y-2">
                {countries.map((country: Record<string, unknown>, i: number) => (
                  <div key={country.id as number} className="p-4 rounded-xl card-space">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-zinc-400 w-5 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-zinc-100">{country.name as string}</span>
                          <span className="text-[10px] font-mono text-zinc-400">{country.iso_code as string}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-[10px] text-zinc-500 mb-2">
                          <span>GDP: {formatBigNum(Number(country.gdp_usd))}</span>
                          <span>Growth: {Number(country.gdp_growth_pct).toFixed(1)}%</span>
                          <span>Pop: {formatPop(Number(country.population))}</span>
                        </div>
                        <div className="flex gap-2 mb-2">
                          {[
                            { label: 'Tech', score: Number(country.tech_hub_score) },
                            { label: 'Startup', score: Number(country.startup_friendliness) },
                            { label: 'Quality', score: Number(country.quality_of_life) },
                          ].map(s => (
                            <div key={s.label} className="flex items-center gap-1">
                              <span className="text-[10px] text-zinc-400">{s.label}</span>
                              <span className="text-xs font-bold text-amber-400">{s.score}/10</span>
                            </div>
                          ))}
                        </div>
                        {country.why_move ? (
                          <p className="text-xs text-zinc-500 line-clamp-2">{country.why_move as string}</p>
                        ) : null}
                        {(country.top_industries as string[])?.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(country.top_industries as string[]).map(ind => (
                              <span key={ind} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-500">{ind}</span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-display text-lg font-bold text-amber-400">
                          {formatBigNum(Number(country.gdp_usd))}
                        </div>
                        <div className="text-[10px] text-zinc-400">GDP</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quote */}
          <div className="text-center mt-8">
            <p className="text-sm text-zinc-400 italic max-w-lg mx-auto">
              &ldquo;Your margin is my opportunity. Work backwards from the customer.&rdquo;
              <span className="block mt-1 not-italic text-zinc-500"> - Jeff Bezos</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
