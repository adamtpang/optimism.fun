import type { ChartPackage } from '@/data/chart-packages'

/**
 * The slots every chart carries: source, license, date accessed, processing
 * note, limitation, and the three download files. Layout only, no polish.
 *
 * An empty slot is printed as empty. A chart is not ready to publish while
 * any slot here says so.
 */
const DOWNLOADS: { key: keyof ChartPackage['downloads']; label: string; what: string }[] = [
  { key: 'csv', label: 'CSV', what: 'the charted numbers' },
  { key: 'metadata', label: 'Metadata JSON', what: 'source, license and units, machine-readable' },
  { key: 'readme', label: 'README', what: 'the same, for a person' },
]

function Slot({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-neutral-200 py-2.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-small text-ink-400">{label}</dt>
      <dd className="text-small text-ink-100 break-words">{children}</dd>
    </div>
  )
}

const Missing = ({ children }: { children: React.ReactNode }) => (
  <span className="text-destructive">{children}</span>
)

export default function ChartFooter({ pkg }: { pkg: ChartPackage }) {
  const ready =
    pkg.license.name !== null && DOWNLOADS.every((d) => pkg.downloads[d.key] !== null) && pkg.source.published !== null

  return (
    <footer aria-label="Source and downloads for this chart" className="mt-4 border-t border-neutral-300">
      <dl>
        <Slot label="Source">
          <a href={pkg.source.url} target="_blank" rel="noopener noreferrer" className="text-info underline">
            {pkg.source.citation}
          </a>
          {pkg.source.published ? (
            <span className="text-ink-400"> Published {pkg.source.published}.</span>
          ) : (
            <Missing> Publication date not stated by the source.</Missing>
          )}
        </Slot>
        <Slot label="License">
          {pkg.license.name ? (
            pkg.license.url ? (
              <a href={pkg.license.url} target="_blank" rel="noopener noreferrer" className="text-info underline">
                {pkg.license.name}
              </a>
            ) : (
              pkg.license.name
            )
          ) : (
            <Missing>Not confirmed.</Missing>
          )}{' '}
          <span className="text-ink-400">{pkg.license.note}</span>
        </Slot>
        <Slot label="Accessed">
          <span className="font-figure">{pkg.accessed}</span>
          <span className="text-ink-400">
            {' '}
            Snapshot <span className="font-figure">sha256:{pkg.snapshot.sha256.slice(0, 12)}</span>
          </span>
        </Slot>
        <Slot label="Processing">{pkg.processing}</Slot>
        <Slot label="Limitation">{pkg.limitation}</Slot>
        <Slot label="Download">
          <ul className="flex flex-wrap gap-2">
            {DOWNLOADS.map((d) => {
              const href = pkg.downloads[d.key]
              return (
                <li key={d.key}>
                  {href ? (
                    <a
                      href={href}
                      download
                      className="inline-flex min-h-11 items-center rounded border border-neutral-300 px-3 text-primary"
                    >
                      {d.label}
                    </a>
                  ) : (
                    <span
                      className="inline-flex min-h-11 items-center rounded border border-dashed border-neutral-300 px-3 text-ink-500"
                      title={`${d.label}: ${d.what}`}
                    >
                      {d.label}: not built yet
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </Slot>
      </dl>
      {!ready && (
        <p className="py-2.5 text-small text-destructive" role="status">
          Not ready to publish: a slot above is still empty.
        </p>
      )}
    </footer>
  )
}
