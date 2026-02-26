'use client'

import { motion } from 'framer-motion'

const pillars = [
  {
    number: '01',
    title: 'Problems are infinite. So are solutions.',
    description:
      'David Deutsch proved that there is no limit to human knowledge. Every problem that is not forbidden by the laws of physics can be solved. The only question is whether we choose to solve it.',
  },
  {
    number: '02',
    title: 'Technology is the engine.',
    description:
      'From fire to semiconductors, technology is how we turn knowledge into solutions. Every great company started as someone saying "I know how to fix this."',
  },
  {
    number: '03',
    title: 'Capitalism is the scoreboard.',
    description:
      'Profit is a signal. It means you solved a problem well enough that people paid you for it. The market is not just an economy. It is a feedback loop for human progress.',
  },
]

export default function Thesis() {
  return (
    <section id="worldview" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-indigo-400 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            The Worldview
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Every Problem Is Solvable
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            David Deutsch and Elon Musk showed us two sides of the same coin.
            Deutsch proved that knowledge creation is unbounded. Musk proved
            that one person with the right problem can change everything. We are
            building on both.
          </p>
        </motion.div>

        <div className="space-y-12">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="grid md:grid-cols-[80px_1fr] gap-6 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/20 transition-all duration-300"
            >
              <span className="font-display text-3xl font-bold text-indigo-500/40">
                {pillar.number}
              </span>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-semibold mb-3">
                  {pillar.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
