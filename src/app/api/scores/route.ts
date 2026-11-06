import { datasetJson } from '@/lib/open-data'
import { jsonData } from '@/lib/http-data'
import { RANKING_FORMULAS, RANKING_MODEL_VERSION, WORKED_EXAMPLE, scoreRows } from '@/lib/score-export'

export const dynamic = 'force-static'

export function GET() {
  const rows = scoreRows()
  return jsonData({
    ...datasetJson('scores', rows, '2026-11-06'),
    model: RANKING_MODEL_VERSION,
    formulas: RANKING_FORMULAS,
    workedExample: WORKED_EXAMPLE,
    interval: 'No validated statistical interval is published. sensitivity_low and sensitivity_high are model sensitivities to a missing annual-severity default.',
  })
}
