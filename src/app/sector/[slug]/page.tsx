import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TierPill from '@/components/TierPill'
import { sectors, getSectorBySlug, PROBLEM_TO_SECTORS } from '@/data/sectors'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { ecosystem } from '@/data/ecosystem'
import { voices } from '@/data/voices'
import { ECOSYSTEM_TYPE_LABEL } from '@/data/types'
import { formatHumans, formatUSD } from '@/lib/format'

export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const sector = getSectorBySlug(slug)
  if (!sector) return {}
  return {
    title: `${sector.name} | optimism.fun`,
    description: sector.tagline,
  }
}

const ACCENT_TEXT: Record<string, string> = {
  amber: 'text-amber-300',
  rose: 'text-terminal-rose',
  cyan: 'text-terminal-cyan',
  violet: 'text-terminal-violet',
  green: 'text-terminal-green',
  indigo: 'text-amber-200',
}

const ACCENT_BORDER: Record<string, string> = {
  amber: 'border-amber-300/40',
  rose: 'border-rose-500/40',
  cyan: 'border-cyan-400/40',
  violet: 'border-violet-400/40',
  green: 'border-emerald-400/40',
  indigo: 'border-indigo-400/40',
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const sector = getSectorBySlug(slug)
  if (!sector) notFound()

  const sectorProblemSlugs = new Set(
    Object.entries(PROBLEM_TO_SECTORS)
      .filter(([, s]) => s.includes(slug))
      .map(([p]) => p),
  )
  const sectorProblems = problems.filter((p) => sectorProblemSlugs.has(p.slug))
  const sectorCompanies = companies.filter((c) =>
    c.problemSlugs.some((s) => sectorProblemSlugs.has(s)),
  )
  const sectorEcosystem = ecosystem.filter((e) =>
    e.problemSlugs.some((s) => sectorProblemSlugs.has(s)),
  )
  const sectorVoices = voices.filter((v) =>
    v.positions.some((pos) => sectorProblemSlugs.has(pos.problemSlug)),
  )

  const totalHumans = sectorProblems.reduce(
    (sum, p) => sum + p.humansAffected.value,
    0,
  )

  const accent = ACCENT_TEXT[sector.accent] ?? 'text-amber-300'
  const accentBorder = ACCENT_BORDER[sector.accent] ?? 'border-amber-300/40'

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-10 border-b border-hair">
          <div className="max-w-5xl mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-ultra-wide text-ink-500 hover:text-amber-300 transition-colors mb-8"
            >
              <span>&larr;</span> all sectors
            </Link>
            <p className={`font-mono text-[10px] uppercase tracking-ultra-wide mb-3 ${accent}`}>
              sector &middot; cluster
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] text-ink-100 mb-5">
              {sector.name}
            </h1>
            <p className="text-lg md:text-xl text-ink-300 leading-relaxed max-w-3xl mb-6">
              {sector.tagline}
            </p>
            <div className="flex flex-wrap gap-4 font-mono text-[11px] text-ink-500">
              <span>
                <span className="text-ink-600">problems: </span>
                <span className={`tabular-nums ${accent}`}>{sectorProblems.length}</span>
              </span>
              <span>
                <span className="text-ink-600">humans affected: </span>
                <span className={`tabular-nums ${accent}`}>{formatHumans(totalHumans)}</span>
              </span>
              <span>
                <span className="text-ink-600">companies on it: </span>
                <span className={`tabular-nums ${accent}`}>{sectorCompanies.length}</span>
              </span>
              <span>
                <span className="text-ink-600">capital sources: </span>
                <span className={`tabular-nums ${accent}`}>{sectorEcosystem.length}</span>
              </span>
              <span>
                <span className="text-ink-600">voices: </span>
                <span className={`tabular-nums ${accent}`}>{sectorVoices.length}</span>
              </span>
            </div>
          </div>
        </section>

        <section className="px-6 py-12 max-w-5xl mx-auto">
          <p className="font-serif text-lg text-ink-200 leading-relaxed whitespace-pre-line mb-12">
            {sector.description}
          </p>

          {sector.leadVoice && (
            <div className={`border ${accentBorder} bg-ink-900/60 p-5 mb-12`}>
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
                lead voice
              </p>
              <a
                href={sector.leadVoice.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-serif text-xl ${accent} hover:opacity-80 transition-opacity`}
              >
                {sector.leadVoice.name} &rarr;
              </a>
            </div>
          )}

          <section className="mb-16">
            <div className="flex items-baseline justify-between mb-5 border-b border-hair pb-3">
              <h2 className="font-serif text-2xl text-ink-100">Problems in this sector</h2>
              <span className="font-mono text-[11px] text-ink-500">
                {sectorProblems.length} ranked
              </span>
            </div>
            <div className="border border-hair">
              {sectorProblems.map((p) => (
                <Link
                  key={p.slug}
                  href={`/p/${p.slug}`}
                  className="group flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-hair last:border-b-0 bg-ink-900 hover:bg-ink-800/60 transition-colors p-5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <TierPill tier={p.tier} />
                      <span className="font-sans text-base font-medium text-ink-100 group-hover:text-amber-300 transition-colors">
                        {p.name}
                      </span>
                    </div>
                    <p className="text-sm text-ink-400 leading-relaxed">{p.tagline}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-ink-500">
                    <span className="text-ink-600">humans</span>
                    <span className="tabular-nums text-amber-300">
                      {formatHumans(p.humansAffected.value)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {sectorCompanies.length > 0 && (
            <section className="mb-16">
              <div className="flex items-baseline justify-between mb-5 border-b border-hair pb-3">
                <h2 className="font-serif text-2xl text-ink-100">Companies on it</h2>
                <Link
                  href="/companies"
                  className="font-mono text-[11px] text-ink-500 hover:text-amber-300 transition-colors"
                >
                  {sectorCompanies.length} mapped &rarr;
                </Link>
              </div>
              <div className="border border-hair">
                {sectorCompanies.slice(0, 12).map((c) => {
                  const cap = c.marketCap ?? c.valuation
                  return (
                    <div
                      key={c.slug}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-hair last:border-b-0 bg-ink-900 hover:bg-ink-800/50 transition-colors p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {c.url ? (
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-sans text-base font-medium text-ink-100 hover:text-amber-300 transition-colors"
                            >
                              {c.name}
                            </a>
                          ) : (
                            <span className="font-sans text-base font-medium text-ink-100">
                              {c.name}
                            </span>
                          )}
                          <span className="font-mono text-[9px] uppercase tracking-ultra-wide text-ink-500 border border-hair px-1.5 py-px">
                            {c.stage}
                          </span>
                        </div>
                        <p className="text-sm text-ink-400 leading-snug line-clamp-1">
                          {c.description}
                        </p>
                      </div>
                      {cap ? (
                        <span className="font-mono tabular-nums text-amber-300 shrink-0">
                          {formatUSD(cap.value)}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-ink-600 shrink-0">
                          private &middot; no disclosed cap
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {sectorEcosystem.length > 0 && (
            <section className="mb-16">
              <div className="flex items-baseline justify-between mb-5 border-b border-hair pb-3">
                <h2 className="font-serif text-2xl text-ink-100">Capital on it</h2>
                <Link
                  href="/ecosystem"
                  className="font-mono text-[11px] text-ink-500 hover:text-amber-300 transition-colors"
                >
                  {sectorEcosystem.length} allocators &rarr;
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-px bg-ink-700/50 border border-hair">
                {sectorEcosystem.slice(0, 8).map((e) => (
                  <a
                    key={e.slug}
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-ink-900 p-4 hover:bg-ink-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-sans text-base font-medium text-ink-100">
                        {e.name}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-ultra-wide text-amber-300 border border-amber-300/30 px-1.5 py-px">
                        {ECOSYSTEM_TYPE_LABEL[e.type]}
                      </span>
                    </div>
                    <p className="text-sm text-ink-300 leading-relaxed line-clamp-2">
                      {e.thesis}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {sectorVoices.length > 0 && (
            <section className="mb-16">
              <div className="flex items-baseline justify-between mb-5 border-b border-hair pb-3">
                <h2 className="font-serif text-2xl text-ink-100">Voices</h2>
                <Link
                  href="/voices"
                  className="font-mono text-[11px] text-ink-500 hover:text-amber-300 transition-colors"
                >
                  {sectorVoices.length} thinkers &rarr;
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {sectorVoices.map((v) => (
                  <Link
                    key={v.slug}
                    href={`/voices/${v.slug}`}
                    className="border border-hair hover:border-terminal-violet/60 px-3 py-1.5 font-mono text-[11px] text-ink-300 hover:text-terminal-violet transition-colors"
                  >
                    {v.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {sector.furtherReading.length > 0 && (
            <section className="border-t border-hair pt-6">
              <h2 className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                Further reading
              </h2>
              <ul className="space-y-2">
                {sector.furtherReading.map((r) => (
                  <li key={r.url} className="text-sm">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2"
                    >
                      {r.title}
                    </a>
                    {r.by && (
                      <span className="font-mono text-[11px] text-ink-500"> &middot; {r.by}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
