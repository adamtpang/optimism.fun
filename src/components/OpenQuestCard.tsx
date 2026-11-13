import type { OpenQuest } from '@/lib/open-quests'
import { NOT_SOURCED } from '@/lib/quest-types'

export default function OpenQuestCard({ quest }: { quest: OpenQuest }) {
  return (
    <article className="border border-dashed border-primary bg-neutral-50 p-4 min-w-0">
      <p className="text-small text-primary">Open quest, not a real company</p>
      <h3 className="text-h2 text-ink-100 mt-2 break-words">{quest.name}</h3>
      <p className="text-small text-ink-400 mt-2">
        Problem: {quest.problemName}. This placeholder is not counted as supply. It has no revenue, funding, or valuation.
      </p>
      <p className="text-small text-ink-300 mt-3 break-words">
        Gap it would fill: {quest.gap}
        {quest.gapSourceUrl && (
          <>
            {' '}
            <a href={quest.gapSourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-words">
              {quest.gapSource ?? 'Source'}
            </a>
          </>
        )}
      </p>
      <h4 className="text-small text-ink-500 mt-4">Demand numbers</h4>
      <ul className="mt-2 space-y-1">
        {quest.demand.map((row) => (
          <li key={row.label} className="text-small text-ink-300 break-words">
            {row.label}: {row.display}
            {row.value != null && row.unit ? ` ${row.unit}` : ''}
            {row.sourceUrl && (
              <>
                {' '}
                <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Source
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
      <h4 className="text-small text-ink-500 mt-4">Founder fit</h4>
      <ul className="mt-2 space-y-1">
        {quest.fit.map((row) => (
          <li key={row.label} className="text-small text-ink-300 break-words">
            {row.label}: {row.value || NOT_SOURCED}
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <a href={quest.href} className="inline-flex items-center min-h-11 px-3 border border-primary text-primary text-small">
          Take this quest
        </a>
      </p>
    </article>
  )
}
