import whoReadings from '@/data/who-readings.json'
import worldbank from '@/data/snapshots/worldbank-gdp-2024.json'
import renderedSnapshot from '@/data/snapshots/rendered-2026-11-06.json'
import { owidCharts } from '@/data/owid-charts'
import { problems } from '@/data/problems'
import { RANKING_MODEL_VERSION } from '@/lib/score-export'

type WorldBankFile = [{ lastupdated?: string }, ...unknown[]]

/**
 * What a researcher can reproduce from this commit.
 * Live OWID and WHO series are not pretended to be here unless a snapshot file
 * recorded them. The WHO block is the wording read on 2026-11-06, not a series.
 */
export function renderedExport() {
  const bank = worldbank as unknown as WorldBankFile
  const lastupdated = bank[0]?.lastupdated ?? null
  return {
    model: RANKING_MODEL_VERSION,
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
    liveCapture: renderedSnapshot,
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
