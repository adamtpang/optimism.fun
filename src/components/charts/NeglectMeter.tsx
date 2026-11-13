/** Ten segments in ink. The number is printed beside the meter, in the figure face. */
export default function NeglectMeter({ score }: { score: number | null }) {
  const filled = score == null ? 0 : Math.max(0, Math.min(10, Math.round(score)))
  const label = score == null ? 'unscored' : `${score}/10`
  return (
    <span className="inline-flex items-center gap-2" aria-label={score == null ? 'Neglectedness unscored' : `${score} out of 10 neglected`}>
      <span className="inline-flex gap-[3px]" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`block w-1.5 h-3.5 ${i < filled ? 'bg-ink-100' : 'bg-neutral-200'}`} />
        ))}
      </span>
      <span className="font-figure text-small text-ink-100">{label}</span>
    </span>
  )
}
