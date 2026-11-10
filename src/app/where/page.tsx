import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageBand from '@/components/media/PageBand'
import PlayerCardPanel from '@/components/PlayerCardPanel'
import { buildPlayerOptions, buildQuestBoard } from '@/lib/quest-board'
import { decodePlayerCard } from '@/lib/player-card'
import { openQuestPlaceholders } from '@/lib/open-quests'

export const metadata: Metadata = {
  title: 'Where do I fit? | optimism.fun',
  description:
    'Rank quests from a player card. Each reason names a field on the card and a field on the quest. No fit score.',
}

export default async function WherePage({
  searchParams,
}: {
  searchParams: Promise<{ card?: string; quest?: string; gap?: string }>
}) {
  const { card: token, quest: questSlug, gap } = await searchParams
  const options = buildPlayerOptions()
  const quests = buildQuestBoard()
  const initialCard = token ? decodePlayerCard(token, options) : null
  const selected = questSlug ? quests.find((quest) => quest.slug === questSlug) : undefined
  const openGap = questSlug
    ? openQuestPlaceholders().find((quest) => quest.problemSlug === questSlug && (gap ? quest.href.includes(`gap=${encodeURIComponent(gap)}`) : quest.kind === 'problem'))
    : undefined
  const preselected = selected ? { name: selected.name, href: selected.href, gap: openGap?.gap ?? null } : null

  return (
    <>
      <Navbar />
      <PageBand kind="bluemarble" />
      <main className="site-shell pt-8 pb-16 min-w-0">
        <p className="font-mono text-small uppercase text-primary mb-3">Where</p>
        <h1 className="font-serif text-4xl md:text-6xl text-ink-100 leading-[1.05]">Where do I fit?</h1>
        <p className="text-ink-400 mt-4 text-lg max-w-2xl">
          Ranked from your player card. Each reason names a field on the card and a field on the quest. No fit score. No account.
        </p>
        <p className="text-sm text-ink-500 mt-3">
          The quests themselves are on{' '}
          <Link href="/quests" className="text-primary hover:underline">
            /quests
          </Link>
          . The essay is{' '}
          <a
            href="https://traestephens.substack.com/p/choose-good-quests"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Choose Good Quests
          </a>
          .
        </p>
        <div className="mt-8">
          <PlayerCardPanel
            options={options}
            initialCard={initialCard}
            tokenInvalid={Boolean(token) && !initialCard}
            quests={quests}
            showMatches
            preselected={preselected}
          />
          {questSlug && !selected && (
            <p className="text-sm text-ink-400 mt-4">That quest is not on the index.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
