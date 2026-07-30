/**
 * Hero figure — the one number a page leads with.
 *
 * Per the dataviz contract: >=48px, in the SAME SANS as everything else (a
 * serif or display face here reads as off-brand decoration), and with the
 * font's default proportional figures — `tabular-nums` gives every digit the
 * width of a zero, which makes a number like 121 look loose at display size.
 *
 * Exactly one per view. A second big number is a stat tile, not a hero.
 */

export default function HeroFigure({
  value,
  label,
  caption,
  className = '',
}: {
  /** The number itself, pre-formatted (e.g. "10 of 22", "$94.4T"). */
  value: string
  /** Sentence case, no trailing colon. */
  label: string
  /** Optional one-line qualifier under the number. */
  caption?: string
  className?: string
}) {
  return (
    <figure className={className}>
      <figcaption className="font-mono text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-2">
        {label}
      </figcaption>
      {/* font-sans + proportional figures, both deliberate */}
      <div className="font-sans font-semibold text-ink-100 leading-none text-5xl md:text-6xl">
        {value}
      </div>
      {caption && (
        <p className="mt-3 text-ink-400 text-sm leading-relaxed max-w-md">{caption}</p>
      )}
    </figure>
  )
}
