import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const sql = getDb()

  try {
    const categories = await sql`
      SELECT c.*, COUNT(p.id)::int as problem_count
      FROM categories c
      LEFT JOIN problems p ON p.category_id = c.id AND p.status = 'active'
      GROUP BY c.id
      ORDER BY problem_count DESC, c.name
    `

    return NextResponse.json({ categories })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
