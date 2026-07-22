/**
 * Where the money is — and how much of it can actually move.
 *
 * The visual argument: bar length is total capital, the SOLID portion is what
 * could realistically be deployed into something new. BlackRock's bar is vast
 * and almost entirely hollow; a family office's is smaller and mostly filled.
 * AUM is not deployability, and that gap is the whole point.
 *
 * Stocks and annual flows are shown in separate groups — comparing $55T of
 * pension assets to $25B/yr of foundation giving would be dishonest.
 */
import type { CapitalPool } from '@/data/types'
import { fmtUsdCompact } from '@/lib/allocation'
import { deployableUsd } from '@/data/capital-map'

const KIND_LABEL: Record<CapitalPool['kind'], string> = {
  'asset-manager': 'asset manager',
  sovereign: 'sovereign',
  pension: 'pension',
  endowment: 'endowment',
  'family-office': 'family office',
  corporate: 'corporate',
  government: 'government',
}

function PoolRow({ pool, max }: { pool: CapitalPool; max: number }) {
  // sqrt scaling keeps the smaller pools visible without lying about order.
  const width = Math.sqrt(pool.total.value / max) * 100
  const pct = Math.round(pool.deployableShare * 100)

  return (
    <div className="py-3 border-b border-hair last:border-b-0">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <div className="min-w-0">
          <span className="font-sans text-[13.5px] text-ink-100">{pool.name}</span>
          <span className="ml-2 font-mono text-[9px] uppercase tracking-wide text-ink-600">
            {KIND_LABEL[pool.kind]}
          </span>
        </div>
        <div className="shrink-0 text-right font-mono text-[11px] tabular-nums">
          <span className="text-ink-300">{fmtUsdCompact(pool.total.value)}</span>
          <span className="text-ink-600"> total</span>
        </div>
      </div>

      {/* bar: full width = total, solid = deployable */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-3 relative" title={`${pct}% realistically deployable`}>
          <div
            className="absolute inset-y-0 left-0 rounded-sm"
            style={{ width: `${width}%`, backgroundColor: 'rgba(14,165,233,0.16)' }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-sm"
            style={{ width: `${width * pool.deployableShare}%`, backgroundColor: '#0ea5e9' }}
          />
        </div>
        <span className="shrink-0 w-28 text-right font-mono text-[10px] tabular-nums text-amber-300">
          {fmtUsdCompact(deployableUsd(pool))} live
        </span>
      </div>

      <p className="mt-1.5 text-ink-500 text-[11.5px] leading-snug">{pool.note}</p>
      <p className="mt-1 font-mono text-[9.5px] text-ink-700">
        {pool.total.source} · confidence {pool.total.confidence} · deployable share is an editorial
        estimate
      </p>
    </div>
  )
}

export default function CapitalPools({ pools }: { pools: CapitalPool[] }) {
  const stocks = pools
    .filter((p) => p.total.unit === 'USD')
    .sort((a, b) => b.total.value - a.total.value)
  const flows = pools
    .filter((p) => p.total.unit !== 'USD')
    .sort((a, b) => b.total.value - a.total.value)

  const maxStock = Math.max(...stocks.map((p) => p.total.value), 1)
  const maxFlow = Math.max(...flows.map((p) => p.total.value), 1)

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500 mb-1">
          Assets held (stocks)
        </p>
        <div className="border-t border-hair">
          {stocks.map((p) => (
            <PoolRow key={p.slug} pool={p} max={maxStock} />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-500 mb-1">
          Deployed per year (flows)
        </p>
        <div className="border-t border-hair">
          {flows.map((p) => (
            <PoolRow key={p.slug} pool={p} max={maxFlow} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] text-ink-500">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 h-2.5 rounded-sm"
            style={{ backgroundColor: '#0ea5e9' }}
          />
          realistically deployable
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 h-2.5 rounded-sm"
            style={{ backgroundColor: 'rgba(14,165,233,0.16)' }}
          />
          held but structurally inert
        </span>
        <span>bar length is square-rooted so smaller pools stay visible</span>
      </div>
    </div>
  )
}
