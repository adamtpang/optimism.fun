import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <Link
              href="/"
              className="font-display text-base font-bold text-cream hover:text-gold transition-colors"
            >
              optimism.fun
            </Link>
            <p className="text-muted text-xs mt-1">
              Every problem is soluble. Choose your quest.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-warm">
            <Link href="/problems" className="hover:text-cream transition-colors">Quests</Link>
            <Link href="/leaderboards" className="hover:text-cream transition-colors">Leaderboards</Link>
            <Link href="/about" className="hover:text-cream transition-colors">About</Link>
          </div>

          <div className="text-center sm:text-right">
            <a
              href="https://adampang.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-gold transition-colors"
            >
              Built by Adam Pang
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
