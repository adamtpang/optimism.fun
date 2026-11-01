import { problems } from '@/data/problems'
import { problemDataset } from '@/lib/open-data'
import { jsonData } from '@/lib/http-data'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }))
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const data = problemDataset(slug)
  if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return jsonData(data)
}
