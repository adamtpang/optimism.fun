import type { MediaCredit } from './credits'

/** Renders one credit line from CREDITS.md. The link target is the URL in that file. */
export default function Credit({
  credit,
  onDark = false,
  className = '',
}: {
  credit: MediaCredit
  onDark?: boolean
  className?: string
}) {
  return (
    <p className={`text-small ${onDark ? 'text-neutral-300' : 'text-neutral-600'} ${className}`}>
      <a href={credit.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
        {credit.text}
      </a>
    </p>
  )
}
