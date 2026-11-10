/**
 * Write the trend board the production build prerenders.
 * /trends live-fetches Hacker News, GitHub, and Wikipedia. GitHub search is
 * serialized at 2.2s per term, so a full board does not finish inside Vercel's
 * 60s static-page limit. The build reads this file instead. Hourly ISR still
 * calls the live engine after deploy.
 *
 *   npx tsx scripts/snapshot-trends.ts
 */
import { writeFileSync } from 'node:fs'
import { computeTrendBoard } from '../src/lib/trends/engine'

async function main() {
  const started = Date.now()
  const board = await computeTrendBoard()
  const out = new URL('../src/data/snapshots/trends-board.json', import.meta.url)
  writeFileSync(out, `${JSON.stringify(board)}\n`)
  process.stdout.write(
    `wrote ${board.attempted} terms, ${board.resolved} with a signal, at ${board.generatedAt} in ${Math.round((Date.now() - started) / 1000)}s\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
