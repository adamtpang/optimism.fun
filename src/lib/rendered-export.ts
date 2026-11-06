import whoReadings from '@/data/who-readings.json'
import worldbank from '@/data/snapshots/worldbank-gdp-2024.json'
import { RENDER_SNAPSHOT_ID, renderSnapshot } from '@/lib/render-snapshot'
import { owidCharts } from '@/data/owid-charts'
import { problems } from '@/data/problems'
import { RANKING_FORMULAS, RANKING_MODEL_VERSION } from '@/lib/score-export'
import { RENDER_INVENTORY } from '@/data/render-inventory'

type WorldBankFile = [{ lastupdated?: string }, ...unknown[]]

/**
 * What a researcher can reproduce from this commit.
 * `liveCapture` is the same object the pages render: WHO, OWID, World Bank,
 * OpenAlex, Wikipedia, EDGAR, Federal Register, USAspending, NIH, openFDA,
 * and the trend observations. The WHO readings block is wording, not a second series.
 */
export function renderedExport() {
  const bank = worldbank as unknown as WorldBankFile
  const lastupdated = bank[0]?.lastupdated ?? null
  return {
    model: RANKING_MODEL_VERSION,
    formulas: RANKING_FORMULAS,
    inventory: RENDER_INVENTORY,
    generatedFrom: 'repository files, not a live refetch at request time',
    who: whoReadings,
    worldbank: {
      file: 'src/data/snapshots/worldbank-gdp-2024.json',
      indicator: 'NY.GDP.MKTP.CD',
      lastupdated,
      note: lastupdated
        ? 'World Bank snapshot stored in the repository. This is nominal GDP, not a live refetch.'
        : 'World Bank snapshot is present but has no lastupdated field.',
    },
    snapshotId: RENDER_SNAPSHOT_ID,
    liveCapture: renderSnapshot,
    owidMappings: Object.entries(owidCharts).map(([problem, chart]) => ({
      problem,
      slug: chart.slug,
      entity: chart.entityCode,
      verifiedOn: chart.verifiedOn,
    })),
    storedHeadlines: problems.map((problem) => ({
      slug: problem.slug,
      value: problem.humansAffected?.value ?? null,
      unit: problem.humansAffected?.unit ?? null,
      countKind: problem.humansAffected?.countKind ?? null,
      observationYear: problem.humansAffected?.observationYear ?? null,
      publicationYear: problem.humansAffected?.publicationYear ?? null,
      source: problem.humansAffected?.source ?? null,
      sourceUrl: problem.humansAffected?.sourceUrl ?? null,
      asOf: problem.humansAffected?.asOf ?? null,
    })),
  }
}
