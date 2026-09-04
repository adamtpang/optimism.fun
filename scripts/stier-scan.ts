/**
 * The personal opportunity scan blends every quest's core ranking score (demand × gap ×
 * readiness, already reflecting sourced crowding) with Adam's real personal
 * fittedness, using the exact formula from HANDOFF_FIT_AND_CROWDING_
 * 2026-08-18.md's hub session: Final = Core*0.7 + Fittedness*10*0.3.
 *
 * This is the Task 3 deliverable that handoff asked for: a live, re-runnable
 * answer instead of a one-time session artifact. Re-run this any time
 * quest-crowding.ts, rfs.ts, or adam-profile.ts changes.
 *
 * Run with: npx tsx scripts/stier-scan.ts
 */
import { computeQuestRankings } from '../src/lib/rankings'
import { scorePersonalFit, blendWithCoreScore } from '../src/lib/personal-fit'
import { getProblemBySlug } from '../src/data/problems'

const ranked = computeQuestRankings()

const blended = ranked.map((q) => {
  const problem = getProblemBySlug(q.problemSlug)
  const fit = scorePersonalFit({
    title: q.title,
    pitch: q.pitch,
    goodQuest: q.goodQuest,
    domain: problem?.domain ?? null,
  })
  return {
    slug: q.slug,
    title: q.title,
    coreScore: q.score,
    coreBand: q.band,
    crowding: q.crowding,
    crowdingSource: q.crowdingSource,
    competitorCount: q.competitorCount,
    fitScore: fit.score,
    fitReasons: fit.reasons,
    blendedScore: blendWithCoreScore(q.score, fit.score),
    problemName: q.problemName,
  }
})

blended.sort((a, b) => b.blendedScore - a.blendedScore)

console.log('\n=== BLENDED PERSONAL OPPORTUNITY SCAN (Core*0.7 + Fittedness*10*0.3) ===\n')
for (const b of blended) {
  const src = b.crowdingSource === 'sourced' ? '' : ' [editorial prior, not sourced]'
  console.log(
    `${b.blendedScore.toString().padStart(3)}  (core ${b.coreScore}/${b.coreBand}, fit ${b.fitScore}/10, ${b.crowding} n=${b.competitorCount ?? '?'}${src})  ${b.title}`,
  )
}

console.log('\n=== TOP 5 DETAIL ===\n')
for (const b of blended.slice(0, 5)) {
  console.log(`\n${b.title} (${b.problemName})`)
  console.log(
    `  blended: ${b.blendedScore}  core: ${b.coreScore} (${b.coreBand} opportunity)  fit: ${b.fitScore}/10  crowding: ${b.crowding} (n=${b.competitorCount ?? 'editorial'})`,
  )
  b.fitReasons.forEach((r) => console.log(`  - ${r}`))
}
