import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QuestList from '@/components/QuestList'
import PlayerCardPanel from '@/components/PlayerCardPanel'
import { buildPlayerOptions, buildQuestBoard } from '@/lib/quest-board'
import { decodePlayerCard } from '@/lib/player-card'

export const metadata: Metadata = {
  title: 'Choose a good quest | optimism.fun',
  description:
    'Every ranked problem as a quest: what the sources say just became possible, who is building, who funds it, and the gap between sourced demand and named supply.',
}

export default async function QuestsPage({ searchParams }: { searchParams: Promise<{ card?: string }> }) {
  const { card: token } = await searchParams
  const options = buildPlayerOptions()
  const quests = buildQuestBoard()
  const initialCard = token ? decodePlayerCard(token, options) : null

  return (
    <>
      <Navbar />
      <main className="site-shell pt-28 pb-16 min-w-0">
        <p className="font-mono text-small uppercase text-primary mb-3">Quests</p>
        <h1 className="font-serif text-4xl md:text-6xl text-ink-100 leading-[1.05]">Choose a good quest.</h1>
        <p className="text-ink-400 mt-4 text-lg max-w-2xl">
          Every ranked problem, in the existing rank order. Each card shows what the sources say just became possible, who is building, who funds it, and the gap between sourced demand and the named teams and capital on this site. Missing data stays missing.
        </p>
        <p className="text-sm text-ink-500 mt-4 max-w-2xl">
          The player half of this page follows{' '}
          <a
            href="https://traestephens.substack.com/p/choose-good-quests"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Choose Good Quests
          </a>
          . The essay does not supply a score, and this page does not add one. Problem rankings are unchanged. Method notes live on{' '}
          <Link href="/methodology" className="text-primary hover:underline">
            the methodology page
          </Link>
          .
        </p>

        <div className="mt-8">
          <h2 className="font-serif text-3xl text-ink-100">Player card</h2>
          <p className="text-sm text-ink-400 mt-3 max-w-2xl">
            Skills, domains, technologies, places, communities, networks, capital, time, and risk appetite. Technologies are enabling tags with a source, not problems. Stored in this browser. A share link or a downloaded image carries only the fields you select.
          </p>
          <div className="mt-4">
            <PlayerCardPanel
              options={options}
              initialCard={initialCard}
              tokenInvalid={Boolean(token) && !initialCard}
              quests={quests}
              showMatches={false}
            />
          </div>
        </div>

        <nav className="mt-12" aria-label="Quests">
          <p className="font-mono text-small uppercase tracking-wider text-ink-500 mb-3">On the index</p>
          <ul className="flex flex-wrap gap-2">
            {quests.map((quest) => (
              <li key={quest.slug}>
                <a href={`#${quest.slug}`} className="inline-flex items-center px-3 py-2 text-sm border border-hair text-ink-300 hover:border-primary hover:text-primary">
                  {quest.rank}. {quest.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <QuestList quests={quests} />
      </main>
      <Footer />
    </>
  )
}
