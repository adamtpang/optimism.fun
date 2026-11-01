import { datasetJson, discoveriesUpdated, discoveryRows } from '@/lib/open-data'
import { jsonData } from '@/lib/http-data'

export const dynamic = 'force-static'

export function GET() {
  return jsonData(datasetJson('discoveries', discoveryRows(), discoveriesUpdated()))
}
