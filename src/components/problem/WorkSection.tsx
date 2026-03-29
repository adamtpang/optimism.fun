import { getDb } from '@/lib/db'
import type { JobOpportunity } from '@/lib/db/types'

export default async function WorkSection({ categoryId }: { categoryId: number | null }) {
  if (!categoryId) return null

  const sql = getDb()
  const jobs = await sql`
    SELECT j.*, c.name as company_name, c.company_type, c.logo_url as company_logo,
           cat.name as category_name, cat.icon as category_icon
    FROM job_opportunities j
    LEFT JOIN companies c ON c.id = j.company_id
    LEFT JOIN categories cat ON cat.id = c.category_id
    WHERE c.category_id = ${categoryId} AND j.is_active = true
    ORDER BY j.created_at DESC
    LIMIT 6
  ` as unknown as JobOpportunity[]

  if (jobs.length === 0) return null

  return (
    <section className="mb-10">
      <h2 className="text-sm font-medium text-zinc-100 uppercase tracking-wider mb-1">
        Meaningful Work
      </h2>
      <p className="text-xs text-zinc-500 mb-4">
        Opportunities at organizations working on this problem.
      </p>
      <div className="space-y-3">
        {jobs.map((job) => (
          <a
            key={job.id}
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl card-space p-4 hover:border-amber-500/30 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors text-sm mb-1">
                  {job.title}
                </div>
                {job.company_name && (
                  <div className="text-xs text-zinc-400 mb-2">{job.company_name}</div>
                )}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {job.job_type && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      job.job_type === 'remote'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-white/5 text-zinc-500 border-zinc-700'
                    }`}>
                      {job.job_type === 'remote' ? '🌍 Remote' : job.job_type}
                    </span>
                  )}
                  {job.location && job.job_type !== 'remote' && (
                    <span className="text-[10px] text-zinc-400">{job.location}</span>
                  )}
                  {job.salary_range && (
                    <span className="text-[10px] text-zinc-400">{job.salary_range}</span>
                  )}
                </div>
                {job.problem_solving && (
                  <p className="text-xs text-zinc-500 italic">{job.problem_solving}</p>
                )}
              </div>
              <svg className="w-4 h-4 text-zinc-700 group-hover:text-amber-500 transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
