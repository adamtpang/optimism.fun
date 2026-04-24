import Link from 'next/link'
import StarField from '@/components/StarField'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProblemTable from '@/components/ProblemTable'
import { problems } from '@/data/problems'
import { companies } from '@/data/companies'
import { ecosystem } from '@/data/ecosystem'
import { voices } from '@/data/voices'

export default function Home() {
  return (
    <>
      <StarField />
      <Navbar />
      <main>
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-indigo-400 font-medium tracking-[0.2em] uppercase text-xs mb-4">
              Humanity&rsquo;s Quest Log
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6 max-w-4xl">
              Infinite problems.
              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                Infinite solutions.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed mb-10">
              A ranked dashboard of humanity&rsquo;s most important problems, scored on three
              lenses, welfare (copenhagen consensus), x-risk (80,000 hours), utility delta
              (state-of-the-art vs physics). Companies, founders, and capital mapped to the
              quest they serve. Built for allocators and entrepreneurs who want to choose
              good quests, with data.
            </p>
            <div className="flex flex-wrap gap-8 text-sm text-slate-400">
              <div>
                <div className="text-2xl font-display font-bold text-slate-100">
                  {problems.length}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  problems ranked
                </div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-slate-100">
                  {voices.length}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  voices aggregated
                </div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-slate-100">
                  {companies.length}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  companies mapped
                </div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-slate-100">
                  {ecosystem.length}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  capital allocators
                </div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-slate-100">
                  v0.1
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  shipping ledger
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto">
            <ProblemTable problems={problems} />

            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <Link
                href="/methodology"
                className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-indigo-500/20 transition-colors"
              >
                <p className="text-indigo-400 text-xs uppercase tracking-wider mb-2">
                  how we rank
                </p>
                <h3 className="font-display text-lg font-semibold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors">
                  Methodology
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Three lenses, five tiers, confidence tags on every number. How the scoring
                  works and what it refuses to do.
                </p>
              </Link>
              <Link
                href="/ecosystem"
                className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-amber-500/20 transition-colors"
              >
                <p className="text-amber-400 text-xs uppercase tracking-wider mb-2">
                  the capital stack
                </p>
                <h3 className="font-display text-lg font-semibold text-slate-100 mb-2 group-hover:text-amber-300 transition-colors">
                  Ecosystem
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Grants, fellowships, studios, catalytic capital, and deep-tech VC mapped to
                  the quests they fund.
                </p>
              </Link>
              <Link
                href="/about"
                className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-emerald-500/20 transition-colors"
              >
                <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2">
                  the thesis
                </p>
                <h3 className="font-display text-lg font-semibold text-slate-100 mb-2 group-hover:text-emerald-300 transition-colors">
                  About
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Choose good quests. Deutsch said problems are soluble. Stephens asked &ldquo;are
                  you on a good quest now?&rdquo; This is the answer with data.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
