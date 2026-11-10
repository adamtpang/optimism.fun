import type { QuestView, SourcedParty, DemandFact, QuestFinding } from '@/lib/quest-types'
import { NOT_SOURCED } from '@/lib/quest-types'

function PartyList({ rows, empty }: { rows: SourcedParty[]; empty: string }) {
  if (rows.length === 0) return <p className="text-sm text-ink-400">{empty}</p>
  return (
    <ul className="mt-2 space-y-3">
      {rows.map((row) => (
        <li key={`${row.name}-${row.detail}-${row.source}`} className="min-w-0">
          {row.href ? (
            <a href={row.href} target="_blank" rel="noopener noreferrer" className="text-ink-100 hover:text-primary break-words">
              {row.name}
            </a>
          ) : (
            <span className="text-ink-100 break-words">{row.name}</span>
          )}
          {row.detail && <p className="text-sm text-ink-400 mt-1 break-words">{row.detail}</p>}
          {row.source && (
            <p className="text-sm text-ink-500 mt-1 break-words">
              {row.sourceUrl ? (
                <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {row.source}
                </a>
              ) : (
                row.source
              )}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}

function FindingBlock({ finding }: { finding: QuestFinding }) {
  return (
    <article className="mt-3 min-w-0">
      <a href={finding.url} target="_blank" rel="noopener noreferrer" className="text-ink-100 hover:text-primary break-words">
        {finding.title}
      </a>
      <p className="text-sm text-ink-500 mt-1">
        {finding.source}
        {finding.published ? ` · ${finding.published}` : ''}
        {` · ${finding.review}`}
        {` · tagged ${finding.changes}`}
        {finding.status ? ` · ${finding.status}` : ''}
      </p>
      <p className="text-sm text-ink-300 mt-2 break-words">{finding.summary}</p>
      {finding.notice && (
        <p className="text-sm text-ink-400 mt-2 break-words">
          {finding.notice}{' '}
          {finding.noticeUrl && (
            <a href={finding.noticeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Notice
            </a>
          )}
        </p>
      )}
    </article>
  )
}

function DemandList({ rows }: { rows: DemandFact[] }) {
  return (
    <dl className="mt-2 space-y-3">
      {rows.map((row, index) => (
        <div key={`${row.label}-${index}`} className="min-w-0">
          <dt className="text-sm text-ink-500 break-words">{row.label}</dt>
          <dd className="text-sm text-ink-100 mt-1 break-words">
            {row.value}
            {row.unit ? ` ${row.unit}` : ''}
          </dd>
          {row.source && (
            <dd className="text-sm text-ink-500 mt-1 break-words">
              {row.sourceUrl ? (
                <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {row.source}
                </a>
              ) : (
                row.source
              )}
              {row.asOf ? ` · ${row.asOf}` : ''}
            </dd>
          )}
        </div>
      ))}
    </dl>
  )
}

export default function QuestList({ quests }: { quests: QuestView[] }) {
  return (
    <div className="mt-10 space-y-3">
      {quests.map((quest, index) => (
        <details key={quest.slug} id={quest.slug} open={index === 0} className="border border-hair min-w-0">
          <summary className="cursor-pointer px-4 py-3 list-none">
            <p className="font-mono text-small uppercase tracking-wider text-ink-500">
              Site rank {quest.rank}
              {quest.domainLabel ? ` · ${quest.domainLabel}` : ''}
              {` · ${quest.tier}`}
            </p>
            <h2 className="font-serif text-2xl text-ink-100 mt-1 break-words">{quest.name}</h2>
            <p className="text-sm text-ink-400 mt-2 break-words">{quest.gapLine}</p>
            <p className="font-mono text-small uppercase tracking-wider text-primary mt-2">Open</p>
          </summary>
          <div className="px-4 pb-5 space-y-6 border-t border-hair">
            <p className="text-sm text-ink-300 pt-4 break-words">{quest.tagline}</p>

            <section>
              <h3 className="font-mono text-small uppercase tracking-wider text-primary">What just became possible</h3>
              {quest.possible.length > 0 ? (
                quest.possible.map((finding) => <FindingBlock key={finding.id} finding={finding} />)
              ) : (
                <p className="text-sm text-ink-400 mt-2">{NOT_SOURCED}</p>
              )}
              {quest.possible.length === 0 && quest.newestFinding && (
                <div className="mt-4">
                  <h4 className="font-mono text-small uppercase tracking-wider text-ink-500">Newest sourced finding</h4>
                  <p className="text-sm text-ink-400 mt-2">
                    This row is tagged {quest.newestFinding.changes}, so it is not shown as a new capability.
                  </p>
                  <FindingBlock finding={quest.newestFinding} />
                </div>
              )}
              {quest.retractedOnly && (
                <p className="text-sm text-ink-400 mt-2">The only findings on file are retracted.</p>
              )}
            </section>

            <section>
              <h3 className="font-mono text-small uppercase tracking-wider text-primary">Who is building</h3>
              <PartyList rows={quest.builders} empty={NOT_SOURCED} />
              {quest.namedPeople.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-mono text-small uppercase tracking-wider text-ink-500">Named on the problem</h4>
                  <PartyList rows={quest.namedPeople} empty={NOT_SOURCED} />
                </div>
              )}
            </section>

            <section>
              <h3 className="font-mono text-small uppercase tracking-wider text-primary">Who funds it</h3>
              <PartyList rows={quest.funders} empty={NOT_SOURCED} />
            </section>

            <section>
              <h3 className="font-mono text-small uppercase tracking-wider text-primary">The gap</h3>
              <p className="text-sm text-ink-300 mt-2 break-words">{quest.gapLine}</p>
              <DemandList rows={quest.demand} />
              <p className="mt-4">
                <a href={quest.href} className="font-mono text-small uppercase tracking-wider text-primary hover:underline">
                  Open the problem
                </a>
              </p>
            </section>
          </div>
        </details>
      ))}
    </div>
  )
}
