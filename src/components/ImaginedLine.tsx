import type { Imagined } from '@/data/types'

/** One line under the sourced facts. Renders nothing when the problem has no `imagined` field. */
export default function ImaginedLine({ imagined }: { imagined?: Imagined }) {
  if (!imagined) return null
  return (
    <p className="text-small text-ink-500 mt-4 max-w-[70ch] leading-snug break-words">
      First imagined in {imagined.work} by {imagined.author} ({imagined.year}): {imagined.note}.{' '}
      <a
        href={imagined.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline decoration-dotted underline-offset-2"
      >
        {imagined.sourceLabel}
      </a>
    </p>
  )
}
