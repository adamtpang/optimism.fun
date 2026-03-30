import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | optimism.fun',
  description: 'The philosophy behind optimism.fun: critical rationalism applied to meaningful work and entrepreneurship.',
}

const PRINCIPLES = [
  {
    title: 'Problems Are Infinite',
    description: 'Every solution creates new problems. This is not pessimism  - it\'s the engine of progress. An infinite supply of problems means infinite opportunities for meaningful work.',
    source: 'David Deutsch',
  },
  {
    title: 'All Problems Are Soluble',
    description: 'If the laws of physics don\'t forbid it, it\'s achievable given the right knowledge. No problem is too big. The question is only: how fast do we create the knowledge to solve it?',
    source: 'David Deutsch',
  },
  {
    title: 'Knowledge Creation Is Progress',
    description: 'Humans are unique in the universe: we create explanatory knowledge. Technology is knowledge made physical. Every breakthrough began with someone who decided to understand.',
    source: 'David Deutsch',
  },
  {
    title: 'Learning Is the Foundation',
    description: 'There are ideas worth billions in a $30 history book. The greatest founders studied obsessively  - ordinary things done with extraordinary focus over an extraordinary period of time.',
    source: 'David Senra',
  },
  {
    title: 'Money Follows Service',
    description: 'Revenue is a signal that you solved a problem well enough that people paid you for it. Money comes naturally as a result of service. Focus on the problem, not the prize.',
    source: 'David Senra',
  },
  {
    title: 'Optimism Is a Stance',
    description: 'Optimism isn\'t blind faith. It\'s the position that problems are soluble and worth solving. The future is not determined  - it\'s created by people who choose to act.',
    source: 'David Deutsch',
  },
]

const THINKERS = [
  { name: 'David Deutsch', role: 'Physicist & philosopher of science', key: 'Critical rationalism, constructor theory, the beginning of infinity', link: 'https://en.wikipedia.org/wiki/David_Deutsch' },
  { name: 'David Senra', role: 'Founder, Founders podcast', key: 'Studying the greatest entrepreneurs in history. Church for the intense.', link: 'https://www.founderspodcast.com/' },
  { name: 'Karl Popper', role: 'Philosopher', key: 'Falsifiability, open society, conjecture and refutation', link: 'https://en.wikipedia.org/wiki/Karl_Popper' },
  { name: 'Naval Ravikant', role: 'Investor & philosopher', key: 'Specific knowledge, leverage, wealth creation through problem-solving', link: 'https://nav.al/' },
  { name: 'Peter Thiel', role: 'Entrepreneur & investor', key: 'Zero to one, definite optimism, building what the world has never seen', link: 'https://en.wikipedia.org/wiki/Peter_Thiel' },
  { name: 'Jason Crawford', role: 'Founder, Roots of Progress', key: 'Progress studies, industrial history, the philosophy of technology', link: 'https://rootsofprogress.org/' },
  { name: 'Chiara Marletto', role: 'Physicist', key: 'Constructor theory, counterfactuals, the physics of knowledge', link: 'https://en.wikipedia.org/wiki/Chiara_Marletto' },
]

const RESOURCES = [
  { title: 'The Beginning of Infinity', author: 'David Deutsch', description: 'The book that started it all. Knowledge creation is unbounded.', type: 'Book' },
  { title: 'Founders Podcast', author: 'David Senra', description: 'Deep dives into the biographies of history\'s greatest entrepreneurs.', type: 'Podcast' },
  { title: 'Zero to One', author: 'Peter Thiel', description: 'Why going from zero to one creates real value. Definite optimism.', type: 'Book' },
  { title: 'The Almanack of Naval Ravikant', author: 'Eric Jorgenson', description: 'Specific knowledge, leverage, and building wealth through service.', type: 'Book' },
  { title: 'Conjecture Institute', author: '', description: 'Advancing critical rationalism across physics, epistemology, and AI.', type: 'Organization' },
  { title: 'Roots of Progress', author: 'Jason Crawford', description: 'Building the intellectual foundation for a new philosophy of progress.', type: 'Organization' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 sm:mb-16">
            <p className="text-gold font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-4">
              Philosophy
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-4">
              Why Optimism Is Rational
            </h1>
            <p className="text-warm text-sm sm:text-base leading-relaxed max-w-xl">
              optimism.fun applies David Deutsch&apos;s critical rationalism and David
              Senra&apos;s philosophy of dedicated study to meaningful work. Every problem
              is soluble. Every solution starts with understanding.
            </p>
          </div>

          {/* Principles */}
          <div className="space-y-4 mb-16">
            {PRINCIPLES.map((p, i) => (
              <div
                key={i}
                className="rounded-xl card-space p-6"
              >
                <h3 className="font-display text-lg font-semibold text-cream mb-2">{p.title}</h3>
                <p className="text-warm text-sm leading-relaxed mb-3">{p.description}</p>
                <p className="text-xs text-muted"> - {p.source}</p>
              </div>
            ))}
          </div>

          {/* Thinkers */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold text-cream mb-6">
              Standing on the Shoulders of Giants
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THINKERS.map((t) => (
                <a
                  key={t.name}
                  href={t.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl card-space p-4 hover:border-gold/30 transition-colors group"
                >
                  <div className="font-display font-semibold text-cream group-hover:text-gold transition-colors mb-1">
                    {t.name}
                  </div>
                  <div className="text-xs text-warm mb-2">{t.role}</div>
                  <div className="text-xs text-muted">{t.key}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold text-cream mb-6">
              Essential Reading &amp; Listening
            </h2>
            <div className="space-y-3">
              {RESOURCES.map((r, i) => (
                <div key={i} className="rounded-xl card-space p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display font-semibold text-cream text-sm mb-1">{r.title}</div>
                      {r.author && <div className="text-xs text-warm mb-1">{r.author}</div>}
                      <div className="text-xs text-muted">{r.description}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted flex-shrink-0">{r.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="rounded-xl border card-space border-gold/20 p-6 sm:p-8 mb-16">
            <h2 className="font-display text-xl font-bold text-cream mb-6 text-center">
              How optimism.fun Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-gold mb-2">01</div>
                <h3 className="font-display font-semibold text-cream mb-2 text-sm">Research Pipeline</h3>
                <p className="text-xs text-muted">AI scans 8 data sources every 6 hours. Claude extracts and scores problems by severity, opportunity, and solvability.</p>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-gold mb-2">02</div>
                <h3 className="font-display font-semibold text-cream mb-2 text-sm">Deep Analysis</h3>
                <p className="text-xs text-muted">Each problem gets an economic value, affected population, 10/10 framework score, and matched organizations.</p>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-gold mb-2">03</div>
                <h3 className="font-display font-semibold text-cream mb-2 text-sm">Meaningful Work</h3>
                <p className="text-xs text-muted">Match your passions and talents to problems worth solving. Find remote work at organizations making real progress.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-cream mb-4">Start Exploring</h2>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/problems" className="px-6 py-3 rounded-lg bg-gold hover:bg-gold-bright text-black glow-gold font-medium transition-colors">
                Explore Problems
              </Link>
              <Link href="/discover" className="px-6 py-3 rounded-lg border border-violet/30 text-violet hover:bg-violet/10 font-medium transition-colors">
                Discover Your Path
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
