import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { fetchAllSources } from '@/lib/pipeline/sources'
import { extractProblems } from '@/lib/pipeline/claude'
import { slugify } from '@/lib/pipeline/slugify'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()

  const runResult = await sql`INSERT INTO pipeline_runs (status) VALUES ('running') RETURNING id`
  const runId = runResult[0].id

  try {
    // 1. Fetch from all sources
    const rawArticles = await fetchAllSources()

    // 2. Extract problems with Claude
    const extractedProblems = await extractProblems(rawArticles)

    // 3. Upsert into database
    let created = 0
    let updated = 0

    for (const problem of extractedProblems) {
      const slug = slugify(problem.title)

      const categoryResult = await sql`
        SELECT id FROM categories WHERE name = ${problem.category} LIMIT 1
      `
      const categoryId = categoryResult[0]?.id ?? null

      const upsertResult = await sql`
        INSERT INTO problems (title, slug, description, category_id,
          severity_score, opportunity_score, solvability_score,
          affected_population, location, source_url, source_name)
        VALUES (${problem.title}, ${slug}, ${problem.description},
          ${categoryId},
          ${problem.severity_score}, ${problem.opportunity_score},
          ${problem.solvability_score},
          ${problem.affected_population}, ${problem.location},
          ${problem.source_url}, ${problem.source_name})
        ON CONFLICT (title) DO UPDATE SET
          description = EXCLUDED.description,
          severity_score = EXCLUDED.severity_score,
          opportunity_score = EXCLUDED.opportunity_score,
          solvability_score = EXCLUDED.solvability_score,
          last_updated_at = NOW()
        RETURNING (xmax = 0) as is_new
      `

      if (upsertResult[0]?.is_new) created++
      else updated++
    }

    // 4. Log completion
    await sql`
      UPDATE pipeline_runs SET
        status = 'completed',
        completed_at = NOW(),
        problems_found = ${extractedProblems.length},
        problems_created = ${created},
        problems_updated = ${updated}
      WHERE id = ${runId}
    `

    return NextResponse.json({
      success: true,
      found: extractedProblems.length,
      created,
      updated,
    })
  } catch (error) {
    await sql`
      UPDATE pipeline_runs SET
        status = 'failed',
        completed_at = NOW(),
        error_message = ${(error as Error).message}
      WHERE id = ${runId}
    `

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
