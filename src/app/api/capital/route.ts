import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()

  const [capitalData, stats, topCompanies] = await Promise.all([
    sql`
      SELECT cc.*, cat.name as category_name, cat.slug as category_slug,
             cat.icon as category_icon, cat.color as category_color
      FROM category_capital cc
      JOIN categories cat ON cat.id = cc.category_id
      ORDER BY cc.total_market_cap_usd DESC
    `,
    sql`
      SELECT
        COALESCE(SUM(total_market_cap_usd), 0)::bigint as total_capital,
        COALESCE(SUM(company_count), 0)::int as total_companies,
        COUNT(*)::int as categories_funded
      FROM category_capital
    `,
    sql`
      SELECT c.*, cat.name as category_name, cat.icon as category_icon,
             cat.color as category_color
      FROM companies c
      LEFT JOIN categories cat ON cat.id = c.category_id
      WHERE c.market_cap_usd IS NOT NULL
      ORDER BY c.market_cap_usd DESC
      LIMIT 10
    `,
  ])

  return NextResponse.json({
    categories: capitalData,
    stats: stats[0] || { total_capital: 0, total_companies: 0, categories_funded: 0 },
    topCompanies,
  })
}
