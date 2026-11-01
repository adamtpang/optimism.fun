/** Ten segments in chart-2. The number is printed beside the meter. */
export default function NeglectMeter({ score }: { score: number | null }) {
  const filled = score == null ? 0 : Math.max(0, Math.min(10, Math.round(score)))
  const label = score == null ? '—' : `${score}/10`
  return (
    <span className="inline-flex items-center gap-2" aria-label={score == null ? 'Neglectedness unscored' : `${score} out of 10 neglected`}>
      <span className="inline-flex gap-[3px]" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`block w-1.5 h-3.5 rounded-[2px] ${i < filled ? 'bg-chart-2' : 'bg-neutral-200'}`}
          />
        ))}
      </span>
      <span className="text-small text-neutral-700 tabular-nums w-9">{label}</span>
    </span>
  )
}
