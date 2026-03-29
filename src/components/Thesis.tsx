const pillars = [
  {
    number: '01',
    title: 'Every problem is soluble.',
    attribution: 'David Deutsch',
    description:
      'If the laws of physics don\'t forbid it, it\'s achievable given the right knowledge. There is no limit to what we can understand, build, and solve. The only question is whether we choose to try.',
    accent: 'text-gold',
  },
  {
    number: '02',
    title: 'The bigger the quest, the bigger the reward.',
    attribution: 'Founders Fund',
    description:
      'The greatest founders chose problems so important that the best talent in the world wanted to help solve them. SpaceX, Tesla, Moderna — they recruited through the grandeur of the mission itself.',
    accent: 'text-violet',
  },
  {
    number: '03',
    title: 'Meaningful work = your passions × objective worth.',
    attribution: 'The Thesis',
    description:
      'The best work happens at the intersection of what you\'re uniquely good at and what the world desperately needs solved. We route human attention, time, and resources toward what matters most.',
    accent: 'text-gold',
  },
]

export default function Thesis() {
  return (
    <section className="py-24 sm:py-36 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-violet font-medium tracking-[0.25em] uppercase text-xs sm:text-sm mb-4">
          The Worldview
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-16">
          Three Ideas That Change Everything
        </h2>

        <div className="space-y-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="card-space rounded-2xl p-6 sm:p-8 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <span className={`font-display text-3xl font-bold ${pillar.accent} opacity-60 flex-shrink-0`}>
                  {pillar.number}
                </span>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-cream mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-warm text-sm sm:text-base leading-relaxed mb-3">
                    {pillar.description}
                  </p>
                  <p className="text-xs text-muted">
                    &mdash; {pillar.attribution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
