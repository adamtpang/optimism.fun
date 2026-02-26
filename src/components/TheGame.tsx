'use client'

import { motion } from 'framer-motion'

const cards = [
  {
    emoji: '\u{1F4B0}',
    title: 'Money Cards',
    subtitle: 'Capital looking for deployment',
    description:
      'VCs, angels, fund managers sitting on billions. They need founders who can put it to work. Capital without a problem to solve is dead weight.',
    gradient: 'from-amber-500/20 to-orange-500/20',
    borderHover: 'hover:border-amber-500/30',
    glowHover: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]',
  },
  {
    emoji: '\u{1F3AF}',
    title: 'Problem Cards',
    subtitle: 'Pain points with a price tag',
    description:
      'Every frustrated customer, every inefficiency, every gap in the market is a card waiting to be played. The bigger the pain, the bigger the opportunity.',
    gradient: 'from-rose-500/20 to-red-500/20',
    borderHover: 'hover:border-rose-500/30',
    glowHover: 'hover:shadow-[0_0_40px_rgba(244,63,94,0.1)]',
  },
  {
    emoji: '\u{26A1}',
    title: 'Solution Cards',
    subtitle: 'That is you',
    description:
      'Your skills, your knowledge, your ability to build something that solves a real problem for real people. Every person on earth is a potential solution card.',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    borderHover: 'hover:border-indigo-500/30',
    glowHover: 'hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]',
  },
]

export default function TheGame() {
  return (
    <section id="game" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-indigo-400 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            The Game
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Capitalism Is a Coordination Game
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Think of the economy like a board game. There are three types of
            cards. The goal is to match them. Money finds problems. Problems
            find solvers. Solvers build solutions. Everyone wins.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative p-8 rounded-2xl bg-gradient-to-br ${card.gradient} border border-white/[0.06] ${card.borderHover} ${card.glowHover} transition-all duration-300`}
            >
              <span className="text-5xl mb-6 block">{card.emoji}</span>
              <h3 className="font-display text-2xl font-bold mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4">{card.subtitle}</p>
              <p className="text-slate-400 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
