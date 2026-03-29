import Link from 'next/link'

export default function Hero() {
  return (
    <section className="min-h-[90svh] flex items-center justify-center px-4 sm:px-6 pt-20 pb-12">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-gold font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-8">
          Choose Good Quests
        </p>

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-8">
          <span className="text-cream">You know you&apos;re meant</span>
          <br />
          <span className="text-cream">to solve something</span>
          <br />
          <span className="text-gradient-hero">that actually matters.</span>
        </h1>

        <p className="text-lg sm:text-xl text-warm max-w-2xl mx-auto mb-4 leading-relaxed">
          You just don&apos;t know <span className="text-gold">which problem</span> yet.
        </p>

        <p className="text-sm sm:text-base text-muted max-w-xl mx-auto mb-12 leading-relaxed">
          optimism.fun surfaces humanity&apos;s biggest unsolved problems, the companies
          already working on them, and helps you find the quest worth committing your
          life&apos;s work to.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/problems"
            className="group px-8 py-4 rounded-xl bg-gold hover:bg-gold-bright text-deep font-bold text-base transition-all glow-gold"
          >
            Explore Quests
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
          <Link
            href="/discover"
            className="px-8 py-4 rounded-xl border border-violet/30 text-violet hover:bg-violet/10 hover:border-violet/50 font-medium text-base transition-all"
          >
            Find Your Match
          </Link>
        </div>

        <div className="mt-20 space-y-2">
          <p className="text-sm text-muted italic">
            &ldquo;All evils are caused by insufficient knowledge.&rdquo;
          </p>
          <p className="text-xs text-muted tracking-wide">
            &mdash; David Deutsch, <span className="text-warm">The Beginning of Infinity</span>
          </p>
        </div>
      </div>
    </section>
  )
}
