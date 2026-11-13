import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { VISITOR_CLASSES } from '@/lib/visitor-classes'

/**
 * The design system on one screen. A working reference for whoever is building,
 * not a public page: it returns 404 in production.
 */
export const metadata: Metadata = {
  title: 'Design system | optimism.fun',
  robots: { index: false, follow: false },
}

const SURFACES = [
  { name: 'Canvas', token: '--surface-canvas', className: 'bg-background' },
  { name: 'Paper', token: '--surface-paper', className: 'bg-paper' },
  { name: 'Hover', token: '--surface-hover', className: 'bg-neutral-100' },
]

const TEXT_STEPS = [
  { name: 'Primary', className: 'text-ink-100', use: 'Headlines and body' },
  { name: 'Secondary', className: 'text-ink-300', use: 'Supporting copy' },
  { name: 'Tertiary', className: 'text-ink-400', use: 'Captions' },
  { name: 'Muted', className: 'text-ink-500', use: 'Labels and metadata' },
]

const TYPE_SCALE = [
  { role: 'Display', className: 'text-display-2', spec: '48 / 52, semibold', sample: 'The beginning of infinity' },
  { role: 'H1', className: 'text-h1', spec: '36 / 40, semibold', sample: 'Why it is not solved yet' },
  { role: 'H2', className: 'text-h2', spec: '28 / 34, semibold', sample: 'Who is already on it' },
  { role: 'H3', className: 'text-h3', spec: '20 / 28, semibold', sample: 'The binding constraint' },
  { role: 'Body', className: 'text-body', spec: '16 / 24', sample: 'A friendship takes more than 200 hours with the same person.' },
  { role: 'Small', className: 'text-small', spec: '14 / 20, the floor', sample: 'Source: WHO Commission on Social Connection, 2025' },
]

const CHART = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'chart-other'] as const

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-10">
      <h2 className="text-h2 text-ink-100">{title}</h2>
      {note && <p className="text-body text-ink-300 mt-2 max-w-2xl">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main className="site-shell py-12">
      <p className="text-small text-ink-500">Working reference, hidden in production</p>
      <h1 className="text-display-2 text-ink-100 mt-2">Design system</h1>
      <p className="text-body-lg text-ink-300 mt-3 max-w-2xl">
        Light paper, dark ink, one typeface. Teal means act. Three bold colors mean one thing each: this part is
        for patrons, for founders, or for researchers.
      </p>

      <Section
        title="The three classes"
        note="A class color appears only on that class's call to action and its labels. Nothing else on a page may use it, so the color always means the same thing."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {VISITOR_CLASSES.map((c) => (
            <div key={c.id} className="border border-border rounded-lg overflow-hidden bg-background" data-class={c.id}>
              <div className={`${c.panel} p-5`}>
                <p className={`text-label ${c.text}`}>{c.label}</p>
                <p className="text-body text-ink-100 mt-1">{c.who}</p>
              </div>
              <div className="p-5 space-y-4">
                <button type="button" className={`min-h-11 w-full rounded-md px-4 py-2 text-label ${c.solid}`}>
                  {c.ask} &rarr;
                </button>
                <p className={`text-small ${c.text}`}>
                  {c.label} text on white, for links and labels.
                </p>
                <dl className="text-small text-ink-500 grid grid-cols-2 gap-x-3 gap-y-1">
                  <dt>Fill</dt>
                  <dd className="font-mono">--class-{c.id}-fill</dd>
                  <dt>Ink</dt>
                  <dd className="font-mono">--class-{c.id}-ink</dd>
                  <dt>Tint</dt>
                  <dd className="font-mono">--class-{c.id}-tint</dd>
                </dl>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-h3 text-ink-100 mt-10">Together, as they will sit under a chart</h3>
        <div className="mt-4 border border-border rounded-lg bg-paper p-5" data-testid="class-bar-preview">
          <p className="text-small text-ink-500 mb-3">What will you do about it?</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {VISITOR_CLASSES.map((c) => (
              <button key={c.id} type="button" className={`min-h-11 rounded-md px-4 py-2 text-label text-left ${c.solid}`}>
                <span className="block text-small opacity-90">{c.label}</span>
                {c.ask} &rarr;
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Neutral action and information" note="Teal is the action color for anything that is not class-specific. Blue links and information marks stay as they are.">
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className="min-h-11 rounded-md bg-primary text-primary-foreground px-4 py-2 text-label">
            Primary action
          </button>
          <button type="button" className="min-h-11 rounded-md border border-input bg-background text-ink-100 px-4 py-2 text-label">
            Secondary action
          </button>
          <a href="#" className="text-body text-primary underline">
            A text link
          </a>
          <span className="text-body text-info">Information blue</span>
          <span className="text-body text-destructive">Error red</span>
        </div>
      </Section>

      <Section title="Surfaces and text">
        <div className="grid gap-4 md:grid-cols-3">
          {SURFACES.map((s) => (
            <div key={s.name} className={`${s.className} border border-border rounded-lg p-5`}>
              <p className="text-label text-ink-100">{s.name}</p>
              <p className="text-small text-ink-500 font-mono">{s.token}</p>
              <div className="mt-4 space-y-1">
                {TEXT_STEPS.map((t) => (
                  <p key={t.name} className={`text-body ${t.className}`}>
                    {t.name}: {t.use}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type" note="Inter only. Six sizes cover every page. 14px is the smallest text anywhere. One extra size, Data, is for a hero number.">
        <div className="divide-y divide-border border-y border-border">
          {TYPE_SCALE.map((t) => (
            <div key={t.role} className="grid md:grid-cols-[10rem_minmax(0,1fr)] gap-2 py-4 items-baseline">
              <p className="text-small text-ink-500">
                {t.role}
                <span className="block font-mono">{t.className}</span>
                <span className="block">{t.spec}</span>
              </p>
              <p className={`${t.className} text-ink-100`}>{t.sample}</p>
            </div>
          ))}
          <div className="grid md:grid-cols-[10rem_minmax(0,1fr)] gap-2 py-4 items-baseline">
            <p className="text-small text-ink-500">
              Data
              <span className="block font-mono">text-data-xl</span>
              <span className="block">48 / 52, tabular</span>
            </p>
            <p className="text-data-xl text-ink-100 tabular-nums">871,000</p>
          </div>
        </div>
      </Section>

      <Section title="Chart colors" note="For data series only. Class colors are never used for a data series, and chart colors are never used for a button.">
        <div className="flex flex-wrap gap-3">
          {CHART.map((c) => (
            <div key={c} className="text-small text-ink-500">
              <div className="h-12 w-24 rounded-md border border-border" style={{ background: `var(--${c})` }} />
              <span className="font-mono">--{c}</span>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
