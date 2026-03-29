import { getDb } from '@/lib/db'
import type { XAccount } from '@/lib/db/types'

export default async function PeopleSection({ categoryId }: { categoryId: number | null }) {
  if (!categoryId) return null

  const sql = getDb()
  const people = await sql`
    SELECT * FROM x_accounts
    WHERE category_id = ${categoryId}
    ORDER BY follower_count DESC NULLS LAST
    LIMIT 8
  ` as unknown as XAccount[]

  if (people.length === 0) return null

  return (
    <section className="mb-10">
      <h2 className="text-sm font-medium text-zinc-100 uppercase tracking-wider mb-4">
        People Solving This
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {people.map((person) => (
          <a
            key={person.id}
            href={person.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl card-space p-4 hover:border-amber-500/30 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="font-display font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors text-sm">
                {person.display_name}
              </div>
              {person.follower_count && person.follower_count > 0 && (
                <span className="text-[10px] text-zinc-400 flex-shrink-0">
                  {person.follower_count >= 1_000_000
                    ? `${(person.follower_count / 1_000_000).toFixed(1)}M`
                    : person.follower_count >= 1_000
                    ? `${(person.follower_count / 1_000).toFixed(0)}K`
                    : person.follower_count} followers
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-400 mb-2">@{person.handle}</div>
            <p className="text-xs text-zinc-500 leading-relaxed">{person.why_follow}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
