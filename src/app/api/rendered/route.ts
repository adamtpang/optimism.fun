import { jsonData } from '@/lib/http-data'
import { renderedExport } from '@/lib/rendered-export'

export const dynamic = 'force-static'

export function GET() {
  return jsonData(renderedExport())
}
