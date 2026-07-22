import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmailCapture from '@/components/EmailCapture'
import CapitalPools from '@/components/CapitalPools'
import CapitalDams from '@/components/CapitalDams'
import {
  capitalPools,
  dammedFlows,
  deployableUsd,
  codeAttackableFlows,
  KARDASHEV,
} from '@/data/capital-map'
import { fmtUsdCompact } from '@/lib/allocation'

export const metadata: Metadata = {
  title: 'The Capital Map | optimism.fun',
  description:
    'Capital is not scarce. Permission is scarce. Where the money on Earth actually sits, how much of it can really move, and the specific blockers damming it from the places it would rather go.',
}

export default function CapitalPage() {
  const totalDeployable = capitalPools.reduce((s, p) => s + deployableUsd(p), 0)
  const totalHeld = capitalPools
    .filter((p) => p.total.unit === 'USD')
    .reduce((s, p) => s + p.total.value, 0)
  const wedge = codeAttackableFlows()
  const kNow = KARDASHEV.current.toFixed(2)
  const kMultiple = Math.round(KARDASHEV.multipleToTypeI)

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-28 pb-8 border-b border-hair">
          <div className="max-w-6xl mx-auto px-6">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              The capital map
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.04] text-ink-100 mb-4">
              Capital is not scarce.
              <span className="block text-amber-300">Permission is scarce.</span>
            </h1>
            <p className="text-ink-400 leading-relaxed max-w-2xl text-base">
              The world is awash in money with nowhere good to go. What is missing is the wire, the
              permit, and the buyer. This is the supply side of the{' '}
              <Link href="/demand" className="text-amber-300 hover:underline">
                demand map
              </Link>
              : where the money actually sits, how much of it can genuinely move, and the specific
              things damming it from the places it would rather be.
            </p>
            <p className="mt-4 font-mono text-[11px] text-ink-500">
              {fmtUsdCompact(totalHeld)} held across {capitalPools.length} pools ·{' '}
              <span className="text-amber-300">{fmtUsdCompact(totalDeployable)}</span> of it
              realistically deployable · {dammedFlows.length} dams mapped
            </p>
          </div>
        </section>

        {/* Kardashev framing */}
        <section className="border-b border-hair bg-ink-900/30">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
              Why this matters
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-3">
              Humanity is at Kardashev {kNow}. Type I needs {kMultiple}× the power.
            </h2>
            <p className="text-ink-400 max-w-3xl text-sm leading-relaxed">
              We use roughly 20 terawatts. A Type I civilisation harnesses its whole planet, about
              10<sup>16</sup> watts. Growth in GDP has tracked growth in energy for two centuries,
              so climbing that curve is the same problem as growing the economy without limit.
            </p>
            <p className="mt-3 text-ink-300 max-w-3xl text-sm leading-relaxed">
              Here is the part worth sitting with:{' '}
              <span className="text-ink-100">
                the thing standing between us and that climb is not physics, and it is not money.
              </span>{' '}
              Fission works. Solar works. Capital is abundant and desperate for yield. The binding
              constraints are permits and wires — the top two rows of the chart below. We are
              rate-limited by paperwork.
            </p>
          </div>
        </section>

        {/* Where the money is */}
        <section className="border-b border-hair">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
                Where the money is
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                AUM is not deployability.
              </h2>
              <p className="mt-2 text-ink-400 max-w-2xl text-sm leading-relaxed">
                The single most common error in thinking about capital is ranking pools by headline
                size. BlackRock manages more money than any institution in history and can back
                almost nothing new, because index mandates legally track a benchmark. A family
                office with $500M can wire a founder $250k next week. The solid part of each bar is
                what can actually move.
              </p>
            </div>
            <CapitalPools pools={capitalPools} />
          </div>
        </section>

        {/* The dams */}
        <section className="border-b border-hair">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-1">
                The dams
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight">
                Where it would go, but cannot.
              </h2>
              <p className="mt-2 text-ink-400 max-w-2xl text-sm leading-relaxed">
                Every row is capital that wants to move and is being held back by one specific,
                nameable thing. Click any dam for the blocker, the unlock, and the scope of the
                number. The blockers are the opportunities.
              </p>
            </div>
            <CapitalDams flows={dammedFlows} />
          </div>
        </section>

        {/* The wedge */}
        <section className="border-b border-hair">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-2">
              The wedge
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-3">
              Most dams need policy or atoms. {wedge.length} need only information.
            </h2>
            <p className="text-ink-400 max-w-2xl text-sm leading-relaxed mb-5">
              You cannot reform the NRC from a laptop, and you cannot build a transmission line out
              of code. But a legibility blocker is a pure information problem — the capital simply
              cannot see the opportunity or the person. Those are solvable with code and media
              alone, by one person, starting today.
            </p>
            <div className="grid sm:grid-cols-2 gap-px bg-hair border border-hair">
              {wedge.map((f) => (
                <div key={f.slug} className="bg-ink p-4">
                  <p className="font-sans text-[13.5px] text-amber-300">{f.destination}</p>
                  <p className="mt-1 font-mono text-[10px] tabular-nums text-ink-400">
                    {fmtUsdCompact(f.waiting.value)} waiting
                  </p>
                  <p className="mt-2 text-ink-400 text-[12px] leading-snug">{f.unlock}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* honesty */}
        <section className="border-b border-hair">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-amber-300 mb-3">
              How honest these numbers are
            </p>
            <p className="font-mono text-[11px] text-ink-500 max-w-3xl leading-relaxed">
              Every figure is an order-of-magnitude estimate from a named public source, tagged with
              a confidence level and an as-of date, with a scope note stating what is counted and
              excluded so it is falsifiable and improvable by PR. Two things are explicitly
              editorial rather than reported: the <span className="text-ink-300">deployable share</span>{' '}
              of each pool, and the derived dollar conversions on the queue and housing rows. Those
              are the numbers to attack first. Next: the Exa sourcer refreshes pool sizes and stated
              funding priorities live, the way the{' '}
              <Link href="/demand" className="text-amber-300 hover:underline">
                demand map
              </Link>{' '}
              already pulls from open statistical APIs.
            </p>
          </div>
        </section>

        {/* close the loop */}
        <section className="border-b border-hair">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 leading-tight mb-2">
              Demand on one side. Capital on the other. The gap is the business.
            </h2>
            <p className="text-ink-400 max-w-2xl text-sm leading-relaxed mb-5">
              The demand map says what humanity needs. This says where the money is and what is
              holding it. Point one at the other and you get the only question that matters: who
              should build what, funded by whom.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/demand"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                What humanity needs → the Demand Map
              </Link>
              <Link
                href="/rankings"
                className="px-4 py-2 border border-amber-300/40 text-amber-300 font-mono text-[12px] hover:bg-amber-300/[0.06] transition-colors"
              >
                What to build → the Power Rankings
              </Link>
              <Link
                href="/ecosystem"
                className="px-4 py-2 border border-hair text-ink-200 font-mono text-[12px] hover:bg-ink-800/40 transition-colors"
              >
                Who funds people like you → Allocators
              </Link>
            </div>
          </div>
        </section>

        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}
