import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const sql = getDb()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'composite'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const offset = (page - 1) * limit

  const orderMap: Record<string, string> = {
    composite: 'p.composite_score DESC',
    severity: 'p.severity_score DESC',
    opportunity: 'p.opportunity_score DESC',
    solvability: 'p.solvability_score DESC',
    newest: 'p.first_seen_at DESC',
  }
  const orderBy = orderMap[sort] || orderMap.composite

  try {
    let problems
    let countResult

    if (category && search) {
      problems = await sql`
        SELECT p.*, c.name as category_name, c.slug as category_slug,
               c.icon as category_icon, c.color as category_color
        FROM problems p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
          AND c.slug = ${category}
          AND (p.title ILIKE ${'%' + search + '%'} OR p.description ILIKE ${'%' + search + '%'})
        ORDER BY ${sql.unsafe(orderBy)}
        LIMIT ${limit} OFFSET ${offset}
      `
      countResult = await sql`
        SELECT COUNT(*)::int as total FROM problems p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND c.slug = ${category}
          AND (p.title ILIKE ${'%' + search + '%'} OR p.description ILIKE ${'%' + search + '%'})
      `
    } else if (category) {
      problems = await sql`
        SELECT p.*, c.name as category_name, c.slug as category_slug,
               c.icon as category_icon, c.color as category_color
        FROM problems p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND c.slug = ${category}
        ORDER BY ${sql.unsafe(orderBy)}
        LIMIT ${limit} OFFSET ${offset}
      `
      countResult = await sql`
        SELECT COUNT(*)::int as total FROM problems p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active' AND c.slug = ${category}
      `
    } else if (search) {
      problems = await sql`
        SELECT p.*, c.name as category_name, c.slug as category_slug,
               c.icon as category_icon, c.color as category_color
        FROM problems p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
          AND (p.title ILIKE ${'%' + search + '%'} OR p.description ILIKE ${'%' + search + '%'})
        ORDER BY ${sql.unsafe(orderBy)}
        LIMIT ${limit} OFFSET ${offset}
      `
      countResult = await sql`
        SELECT COUNT(*)::int as total FROM problems p
        WHERE p.status = 'active'
          AND (p.title ILIKE ${'%' + search + '%'} OR p.description ILIKE ${'%' + search + '%'})
      `
    } else {
      problems = await sql`
        SELECT p.*, c.name as category_name, c.slug as category_slug,
               c.icon as category_icon, c.color as category_color
        FROM problems p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
        ORDER BY ${sql.unsafe(orderBy)}
        LIMIT ${limit} OFFSET ${offset}
      `
      countResult = await sql`
        SELECT COUNT(*)::int as total FROM problems p WHERE p.status = 'active'
      `
    }

    const total = countResult[0]?.total || 0

    return NextResponse.json({
      problems,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
