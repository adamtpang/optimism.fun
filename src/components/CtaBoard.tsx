import { CTA_KINDS, listCtas, type CtaKind } from '@/data/ctas'

const COPY: Record<CtaKind, { label: string; hint: string }> = {
  build: { label: 'Build', hint: 'Startups, labs, open work' },
  fund: { label: 'Fund', hint: 'Grants, prizes, funders' },
  buy: { label: 'Buy', hint: 'Products to use or back' },
  learn: { label: 'Learn', hint: 'Explainers and papers' },
}

const TYPE_LABEL: Record<string, string> = {
  nonprofit: 'Nonprofit',
  startup: 'Startup',
  fund: 'Fund',
  grant: 'Grant',
  product: 'Product',
  report: 'Report',
  prize: 'Prize',
  paper: 'Paper',
  government: 'Government',
}

export default function CtaBoard({
  problemSlug,
  riskSlug,
  embedded = false,
}: {
  problemSlug?: string
  riskSlug?: string
  embedded?: boolean
}) {
  const items = listCtas({ problemSlug, riskSlug })

  return (
    <section id={embedded ? undefined : 'do'} className={embedded ? 'mt-8' : 'max-w-5xl mx-auto px-4 sm:px-6 py-10 border-b border-hair'}>
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
        <h2 className="font-serif text-2xl text-ink-100">What you can do</h2>
        <a href="/data" className="font-mono text-[11px] uppercase tracking-wider text-amber-300 hover:underline">
          Open data
        </a>
      </div>
      {items.length === 0 && (
        <p className="text-ink-400 text-sm mb-4">No checked action is listed for this yet.</p>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        {CTA_KINDS.map((kind) => {
          const rows = items.filter((c) => c.kind === kind)
          return (
            <div key={kind} className="border border-hair min-w-0">
              <div className="px-3 py-2 border-b border-hair">
                <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-100">{COPY[kind].label}</h3>
                <p className="text-xs text-ink-500 mt-0.5">{COPY[kind].hint}</p>
              </div>
              {rows.length === 0 ? (
                <p className="px-3 py-4 text-sm text-ink-500">None yet.</p>
              ) : (
                <ul>
                  {rows.map((cta) => (
                    <li key={cta.id} className="px-3 py-3 border-b border-hair last:border-b-0">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
                        {TYPE_LABEL[cta.type] ?? cta.type}
                        {cta.location ? ` · ${cta.location}` : ''}
                      </p>
                      <a
                        href={cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-100 hover:text-amber-300 mt-1 inline-block"
                      >
                        {cta.name}
                      </a>
                      <p className="text-sm text-ink-400 mt-1 leading-snug">{cta.oneLiner}</p>
                      {cta.amount && (
                        <p className="text-sm text-ink-200 mt-2 leading-snug">
                          {cta.amount.text}{' '}
                          <a
                            href={cta.amount.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-300 underline decoration-dotted underline-offset-2"
                          >
                            source
                          </a>
                        </p>
                      )}
                      <p className="font-mono text-[10px] text-ink-500 mt-2">Checked {cta.checkedDate}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
