import type { ReactNode } from 'react'

/** One title, optional subtitle, the plot, and a single source caption. */
export default function Figure({
  title,
  subtitle,
  children,
  source,
  className = '',
}: {
  title: string
  subtitle?: string
  children: ReactNode
  source?: ReactNode
  className?: string
}) {
  return (
    <figure className={`bg-white border border-neutral-200 rounded-xl shadow-sm ${className}`}>
      <div className="px-6 pt-6">
        <h3 className="text-h3 text-neutral-900">{title}</h3>
        {subtitle && <p className="text-small text-neutral-600 mt-1">{subtitle}</p>}
      </div>
      <div className="px-4 py-4 bg-white">{children}</div>
      {source && <figcaption className="px-6 pb-6 text-small text-neutral-600">{source}</figcaption>}
    </figure>
  )
}
