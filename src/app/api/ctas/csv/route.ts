import { ctaRows, toCsv } from '@/lib/open-data'
import { csvData } from '@/lib/http-data'

export const dynamic = 'force-static'

export function GET() {
  return csvData('optimism-fun-ctas.csv', toCsv(ctaRows()))
}
