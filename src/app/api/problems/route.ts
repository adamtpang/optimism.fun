import { datasetJson, problemRows, problemsUpdated } from '@/lib/open-data'
import { jsonData } from '@/lib/http-data'

export const dynamic = 'force-static'

export function GET() {
  const rows = problemRows()
  return jsonData(datasetJson('problems', rows, problemsUpdated()))
}
