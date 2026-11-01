import { datasetJson, seriesRows, seriesUpdated } from '@/lib/open-data'
import { jsonData } from '@/lib/http-data'

export const dynamic = 'force-static'

export function GET() {
  return jsonData(datasetJson('series', seriesRows(), seriesUpdated()))
}
