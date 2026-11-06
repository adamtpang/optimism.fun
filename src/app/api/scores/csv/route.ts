import { toCsv } from '@/lib/open-data'
import { csvData } from '@/lib/http-data'
import { scoreRows } from '@/lib/score-export'

export const dynamic = 'force-static'

export function GET() {
  return csvData('optimism-fun-scores.csv', toCsv(scoreRows()))
}
