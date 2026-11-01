import { NextResponse } from 'next/server'

const SHARED = {
  'cache-control': 'public, max-age=3600, s-maxage=86400',
  'access-control-allow-origin': '*',
}

export function jsonData(body: unknown) {
  return NextResponse.json(body, { headers: SHARED })
}

export function csvData(filename: string, csv: string) {
  return new NextResponse(csv, {
    headers: {
      ...SHARED,
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
    },
  })
}
