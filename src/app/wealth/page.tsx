import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import { countries } from '@/data/countries'
import { publicCompanies } from '@/data/public-companies'
import { founders } from '@/data/founders'
import { getProblemBySlug } from '@/data/problems'
import { getInLimitCap } from '@/data/in-limit'
import { formatUSD } from '@/lib/format'

export const metadata = {
  title: 'The wealth ledger | optimism.fun',
  description:
    'Who actually holds spendable wealth on Earth: countries by GDP, companies by market cap, individuals by net worth. Demand is necessary but not sufficient for a market — this is the money half of the trade.',
}

const TOP_N = 18

const topCountries = countries.slice(0, TOP_N)
const topCompanies = publicCompanies.slice(0, TOP_N)
const topFounders = founders.slice(0, TOP_N)

const countriesTotal = topCountries.reduce((a, c) => a + c.gdp.value, 0)
const companiesTotal = topCompanies.reduce((a, c) => a + c.marketCap.value, 0)
const foundersTotal = topFounders.reduce((a, f) => a + f.netWorth.value, 0)

const povertyProblem = getProblemBySlug('extreme-poverty')
const povertyMarket = povertyProblem?.marketSize?.value ?? 0
const povertyInLimit = getInLimitCap('extreme-poverty')?.marketCap.value ?? 0
const richestBillionaire = topFounders[0]
const smallestTopCountryGDP = topCountries[topCountries.length - 1]?.gdp.value ?? 0

export default function WealthPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          kicker="The atlas · who can pay"
          title="The wealth ledger."
          lede="Demand is necessary but not sufficient for a market — the humans with the problem also need the money. This is a BANT lens on the whole board: a real lead needs both the Need (the problem pages) and the Budget (this page). Three rankings of who actually holds spendable wealth on Earth, real and sourced, pulled from this site's own data."
          rightStats={[
            { label: 'top countries, gdp', value: formatUSD(countriesTotal), tone: 'cyan' },
            { label: 'top companies, mktcap', value: formatUSD(companiesTotal), tone: 'amber' },
            { label: 'top billionaires, net worth', value: formatUSD(foundersTotal), tone: 'violet' },
          ]}
        />

        <section className="px-6 py-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Countries */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-terminal-cyan text-[10px]">◆</span>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-400">
                  Countries · by GDP
                </p>
              </div>
              <div className="overflow-x-auto border border-hair">
                <table className="min-w-full font-mono text-xs">
                  <tbody>
                    {topCountries.map((c) => (
                      <tr
                        key={c.iso3}
                        className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
                      >
                        <td className="px-3 py-2 text-ink-600 tabular-nums w-8">
                          {c.rank}
                        </td>
                        <td className="px-3 py-2 text-ink-100 font-sans text-[13px]">
                          {c.name}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-terminal-cyan">
                          {formatUSD(c.gdp.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 font-mono text-[10px] text-ink-500">
                {countries.length} ranked ·{' '}
                <a
                  href="https://data.worldbank.org/indicator/NY.GDP.MKTP.CD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-400 hover:text-terminal-cyan underline decoration-dotted underline-offset-2"
                >
                  World Bank
                </a>{' '}
                · full list at{' '}
                <a href="/countries" className="text-ink-400 hover:text-terminal-cyan underline decoration-dotted underline-offset-2">
                  /countries
                </a>
              </p>
            </div>

            {/* Companies */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-300 text-[10px]">◆</span>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-400">
                  Companies · by market cap
                </p>
              </div>
              <div className="overflow-x-auto border border-hair">
                <table className="min-w-full font-mono text-xs">
                  <tbody>
                    {topCompanies.map((c) => (
                      <tr
                        key={c.ticker}
                        className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
                      >
                        <td className="px-3 py-2 text-ink-600 tabular-nums w-8">
                          {c.rank}
                        </td>
                        <td className="px-3 py-2 text-ink-100 font-sans text-[13px]">
                          {c.name}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-amber-300">
                          {formatUSD(c.marketCap.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 font-mono text-[10px] text-ink-500">
                {publicCompanies.length} ranked ·{' '}
                <a
                  href="https://companiesmarketcap.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-400 hover:text-amber-300 underline decoration-dotted underline-offset-2"
                >
                  companiesmarketcap.com
                </a>{' '}
                · full list at{' '}
                <a href="/companies" className="text-ink-400 hover:text-amber-300 underline decoration-dotted underline-offset-2">
                  /companies
                </a>
              </p>
            </div>

            {/* Individuals */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-terminal-violet text-[10px]">◆</span>
                <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-400">
                  Individuals · by net worth
                </p>
              </div>
              <div className="overflow-x-auto border border-hair">
                <table className="min-w-full font-mono text-xs">
                  <tbody>
                    {topFounders.map((f) => (
                      <tr
                        key={f.rank}
                        className="border-b border-hair last:border-b-0 hover:bg-ink-800/30 transition-colors"
                      >
                        <td className="px-3 py-2 text-ink-600 tabular-nums w-8">
                          {f.rank}
                        </td>
                        <td className="px-3 py-2 text-ink-100 font-sans text-[13px]">
                          {f.name}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-terminal-violet">
                          {formatUSD(f.netWorth.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 font-mono text-[10px] text-ink-500">
                {founders.length} ranked ·{' '}
                <a
                  href="https://en.wikipedia.org/wiki/The_World%27s_Billionaires"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-400 hover:text-terminal-violet underline decoration-dotted underline-offset-2"
                >
                  Forbes / Wikipedia
                </a>{' '}
                · full list at{' '}
                <a href="/founders" className="text-ink-400 hover:text-terminal-violet underline decoration-dotted underline-offset-2">
                  /founders
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 pb-16 max-w-7xl mx-auto">
          <div className="border border-hair p-8 md:p-10">
            <p className="font-mono text-[10px] uppercase tracking-ultra-wide text-terminal-green mb-4">
              BANT applied to extreme poverty
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-ink-100 mb-5 max-w-2xl leading-snug">
              The poor aren&rsquo;t the customer. The customer is whoever can afford to care about the poor.
            </h2>
            <div className="max-w-3xl space-y-4 text-ink-300 text-[15px] leading-relaxed">
              <p>
                Extreme poverty prices out at{' '}
                <span className="text-ink-100 font-medium">{formatUSD(povertyMarket)}/yr</span> in current
                spend and a <span className="text-ink-100 font-medium">{formatUSD(povertyInLimit)}</span>{' '}
                in-limit prize for whoever builds the winning delivery platform — both figures on the{' '}
                <a href="/p/extreme-poverty" className="text-amber-300 hover:text-amber-200 underline decoration-dotted underline-offset-2">
                  extreme poverty problem page
                </a>
                . Set that next to this ledger:{' '}
                <span className="text-ink-100 font-medium">
                  {richestBillionaire?.name}&rsquo;s personal net worth alone ({formatUSD(richestBillionaire?.netWorth.value ?? 0)})
                </span>{' '}
                already dwarfs the entire current annual market, and even the smallest economy in this
                top {TOP_N} ({formatUSD(smallestTopCountryGDP)} GDP) clears it many times over. The
                demand is real and enormous — 700 million people, the single highest-demand population
                this site tracks — but by definition none of them are the payer.
              </p>
              <p>
                That&rsquo;s not a reason to drop the problem. It&rsquo;s a reason to name the real
                go-to-market target correctly. A company here doesn&rsquo;t sell to a poor household; it
                sells to one of three entities on this page — and the existing starter kits for{' '}
                <span className="text-ink-100">graduation-approach cost collapse</span> and{' '}
                <span className="text-ink-100">anticipatory cash infrastructure</span> already implicitly
                do this (BRAC, World Bank, WFP, government aid budgets as the buyer). This page just makes
                the pattern explicit and repeatable for every other welfare-tier problem on the board.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="border border-hair p-5">
                <p className="font-mono text-[10px] text-ink-500 mb-2">Buyer type 01</p>
                <h3 className="text-ink-100 font-medium text-sm mb-2">Government aid budgets</h3>
                <p className="text-ink-400 text-[13px] leading-relaxed">
                  A slice of GDP, not GDP itself — but the only payer sized to the problem. Sell the
                  platform, not the service: license to the state or multilateral, don&rsquo;t try to
                  bill the household directly.
                </p>
              </div>
              <div className="border border-hair p-5">
                <p className="font-mono text-[10px] text-ink-500 mb-2">Buyer type 02</p>
                <h3 className="text-ink-100 font-medium text-sm mb-2">Corporate ESG / supply-chain budgets</h3>
                <p className="text-ink-400 text-[13px] leading-relaxed">
                  A company on this page needs its supply chain, workforce, or market to not be in
                  extreme poverty. A real, recurring line item — smaller than government but faster
                  to close and renews yearly.
                </p>
              </div>
              <div className="border border-hair p-5">
                <p className="font-mono text-[10px] text-ink-500 mb-2">Buyer type 03</p>
                <h3 className="text-ink-100 font-medium text-sm mb-2">Billionaire foundations</h3>
                <p className="text-ink-400 text-[13px] leading-relaxed">
                  Smallest pool on this page in aggregate, but the fastest capital to move — no board,
                  no election cycle, no procurement process. The right entry point for an unproven
                  model before it&rsquo;s ready for buyer types 01 or 02.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
