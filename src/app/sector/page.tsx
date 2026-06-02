import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { sectors, PROBLEM_TO_SECTORS } from '@/data/sectors'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { formatHumans } from '@/lib/format'

export const metadata = {
  title: 'Sectors | optimism.fun',
  description:
    "Clusters of humanity's highest-leverage problems. Each sector aggregates the problems, the companies on them, and the capital funding them.",
}

const ACCENT_TEXT: Record<string, string> = {
  amber: 'text-amber-300',
  rose: 'text-terminal-rose',
  cyan: 'text-terminal-cyan',
  violet: 'text-terminal-violet',
  green: 'text-terminal-green',
  indigo: 'text-amber-200',
}

export default function SectorIndex() {
  const stats = sectors.map((s) => {
    const problemSlugs = new Set(
      Object.entries(PROBLEM_TO_SECTORS)
        .filter(([, list]) => list.includes(s.slug))
        .map(([p]) => p),
    )
    const sectorProblems = problems.filter((p) => problemSlugs.has(p.slug))
    const sectorCompanies = companies.filter((c) =>
      c.problemSlugs.some((slug) => problemSlugs.has(slug)),
    )
    const totalHumans = sectorProblems.reduce(
      (sum, p) => sum + p.humansAffected.value,
      0,
    )
    return { sector: s, problemCount: sectorProblems.length, companyCount: sectorCompanies.length, totalHumans }
  })

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
              <span>&larr;</span> back
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              sectors
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.05] text-ink-100 mb-5">
              Pick a cluster.
            </h1>
            <p className="text-lg text-ink-300 leading-relaxed max-w-3xl">
              The leaderboard is the entry point. The sectors are how you specialize.
              Each one aggregates its problems, the companies on them, the capital funding
              them, and the voices arguing they matter.
            </p>
          </div>
        </section>

        <section className="px-6 py-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-px bg-ink-700/50 border border-hair">
            {stats.map(({ sector, problemCount, companyCount, totalHumans }) => {
              const accent = ACCENT_TEXT[sector.accent] ?? 'text-amber-300'
              return (
                <Link
                  key={sector.slug}
                  href={`/sector/${sector.slug}`}
                  className="group block bg-ink-900 hover:bg-ink-800/60 transition-colors p-6"
                >
                  <p className={`font-mono text-[10px] uppercase tracking-ultra-wide mb-3 ${accent}`}>
                    {sector.slug}
                  </p>
                  <h2 className="font-serif text-2xl text-ink-100 group-hover:text-amber-300 transition-colors mb-2">
                    {sector.name}
                  </h2>
                  <p className="text-sm text-ink-400 leading-relaxed mb-4">
                    {sector.tagline}
                  </p>
                  <div className="flex flex-wrap gap-3 font-mono text-[11px] text-ink-500">
                    <span>
                      <span className="text-ink-600">p </span>
                      <span className={`tabular-nums ${accent}`}>{problemCount}</span>
                    </span>
                    <span>
                      <span className="text-ink-600">co </span>
                      <span className={`tabular-nums ${accent}`}>{companyCount}</span>
                    </span>
                    <span>
                      <span className="text-ink-600">humans </span>
                      <span className={`tabular-nums ${accent}`}>
                        {formatHumans(totalHumans)}
                      </span>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
