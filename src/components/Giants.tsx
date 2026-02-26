'use client'

import { motion } from 'framer-motion'

const giants = [
  {
    name: 'David Deutsch',
    role: 'Physicist & Philosopher',
    description:
      'Proved that problems are soluble and knowledge is infinite. His books are the foundation of this entire worldview.',
    initials: 'DD',
    gradient: 'from-indigo-600 to-purple-600',
    // Replace with: /images/david-deutsch.jpg
  },
  {
    name: 'Elon Musk',
    role: 'Engineer & Entrepreneur',
    description:
      'Showed that one person can take on the biggest problems on the planet and win. Electric cars, rockets, neural interfaces. Applied optimism at scale.',
    initials: 'EM',
    gradient: 'from-blue-600 to-cyan-600',
    // Replace with: /images/elon-musk.jpg
  },
  {
    name: 'Peter Thiel',
    role: 'Investor & Author',
    description:
      'Argued that going from zero to one is what creates real value. Competition is for losers. Build something the world has never seen.',
    initials: 'PT',
    gradient: 'from-emerald-600 to-teal-600',
    // Replace with: /images/peter-thiel.jpg
  },
  {
    name: 'Jason Crawford',
    role: 'Founder, Roots of Progress',
    description:
      'Building the intellectual foundation for a new philosophy of progress. Understanding where we came from so we know where to go.',
    initials: 'JC',
    gradient: 'from-amber-600 to-orange-600',
    // Replace with: /images/jason-crawford.jpg
  },
]

export default function Giants() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-indigo-400 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            Standing on Shoulders
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            The People We Build On
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            These thinkers and builders saw further than most. Their work is the
            foundation. We are here to apply it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {giants.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-5 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
            >
              {/* Avatar placeholder - replace with next/image when you have photos */}
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${person.gradient} flex items-center justify-center`}
              >
                <span className="font-display font-bold text-white text-sm">
                  {person.initials}
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  {person.name}
                </h3>
                <p className="text-sm text-slate-500 mb-2">{person.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {person.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
