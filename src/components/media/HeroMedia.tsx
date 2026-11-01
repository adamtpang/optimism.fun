import { Fragment, type ReactNode } from 'react'

export type MediaSource = {
  avif: string
  webp: string
  /** Omit on the last source so it is the default. */
  media?: string
}

/**
 * Art-directed picture. Prebuilt AVIF then WebP. Pass the 828 pair first
 * with a max-width media query so a phone does not fetch the desktop file.
 */
export default function HeroMedia({
  alt,
  sources,
  width,
  height,
  priority = false,
  className = '',
  children,
}: {
  alt: string
  sources: MediaSource[]
  width: number
  height: number
  priority?: boolean
  className?: string
  children?: ReactNode
}) {
  const fallback = sources[sources.length - 1]
  return (
    <picture className="block h-full w-full">
      {sources.map((source) => (
        <Fragment key={source.avif}>
          <source media={source.media} srcSet={source.avif} type="image/avif" />
          <source media={source.media} srcSet={source.webp} type="image/webp" />
        </Fragment>
      ))}
      <img
        src={fallback?.webp}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={`h-full w-full object-cover ${className}`}
      />
      {children}
    </picture>
  )
}
