import { seriesRows, toCsv } from '@/lib/open-data'
import { csvData } from '@/lib/http-data'

export const dynamic = 'force-static'

export function GET() {
  return csvData('optimism-fun-series.csv', toCsv(seriesRows()))
}
