import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// POST: Create or get a player (upsert by email)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, display_name, player_type, interests } = body

    if (!email) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      )
    }

    const sql = getDb()

    const result = await sql`
      INSERT INTO players (email, display_name, player_type, interests)
      VALUES (${email}, ${display_name || null}, ${player_type || null}, ${interests || []})
      ON CONFLICT (email)
      DO UPDATE SET
        player_type = COALESCE(EXCLUDED.player_type, players.player_type),
        interests = EXCLUDED.interests,
        display_name = COALESCE(EXCLUDED.display_name, players.display_name),
        last_active_at = now()
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (err) {
    console.error('Player create error:', err)
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    )
  }
}

// GET: Get player by email
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'email param required' },
        { status: 400 }
      )
    }

    const sql = getDb()
    const result = await sql`
      SELECT * FROM players WHERE email = ${email}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (err) {
    console.error('Player get error:', err)
    return NextResponse.json(
      { error: 'Failed to get player' },
      { status: 500 }
    )
  }
}

// PATCH: Update player preferences
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, interests, work_preferences } = body

    if (!email) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      )
    }

    const sql = getDb()

    const result = await sql`
      UPDATE players SET
        interests = COALESCE(${interests || null}, interests),
        work_preferences = COALESCE(${work_preferences ? JSON.stringify(work_preferences) : null}::jsonb, work_preferences),
        last_active_at = now()
      WHERE email = ${email}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (err) {
    console.error('Player update error:', err)
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    )
  }
}
