import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050510]/50 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/"
            className="font-display text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent"
          >
            optimism.fun
          </Link>
          <p className="text-xs text-slate-500 mt-2 max-w-md">
            humanity&rsquo;s quest log. all problems are explainable, all solutions are
            creatable.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">
            problems
          </Link>
          <Link href="/voices" className="hover:text-slate-300 transition-colors">
            voices
          </Link>
          <Link href="/ecosystem" className="hover:text-slate-300 transition-colors">
            ecosystem
          </Link>
          <Link href="/methodology" className="hover:text-slate-300 transition-colors">
            methodology
          </Link>
          <Link href="/about" className="hover:text-slate-300 transition-colors">
            about
          </Link>
        </div>
        <div className="text-xs text-slate-600">v0.1 &middot; shipping ledger</div>
      </div>
    </footer>
  )
}
