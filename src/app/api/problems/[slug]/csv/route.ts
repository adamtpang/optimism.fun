import { problems } from '@/data/problems'
import { problemCsv } from '@/lib/open-data'
import { csvData } from '@/lib/http-data'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }))
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const csv = problemCsv(slug)
  if (!csv) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return csvData(`optimism-fun-${slug}.csv`, csv)
}
