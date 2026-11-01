import type { ReactNode } from 'react'
import Container from './Container'

/** Eyebrow, title, and one-line sub. Existing copy only; the caller supplies the words. */
export default function PageHeader({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow?: string
  title: string
  sub?: string
  children?: ReactNode
}) {
  return (
    <header className="pt-20 pb-8 md:pt-24">
      <Container>
        {eyebrow && <p className="text-label text-primary">{eyebrow}</p>}
        <h1 className="text-h1 md:text-display-2 text-ink-100 mt-2 max-w-[20ch]">{title}</h1>
        {sub && <p className="text-body-lg text-ink-400 mt-3 max-w-[68ch]">{sub}</p>}
        {children}
      </Container>
    </header>
  )
}
