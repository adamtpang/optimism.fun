'use client'

import { motion } from 'framer-motion'

const resources = {
  books: [
    {
      title: 'The Beginning of Infinity',
      author: 'David Deutsch',
      description:
        'The foundational text. Explains why progress is possible and how knowledge grows without limit.',
      url: 'https://www.amazon.com/Beginning-Infinity-Explanations-Transform-World/dp/0143121359',
    },
    {
      title: 'The Fabric of Reality',
      author: 'David Deutsch',
      description:
        'Four fundamental theories that together form a coherent worldview of everything that exists.',
      url: 'https://www.amazon.com/Fabric-Reality-Parallel-Universes-Implications/dp/014027541X',
    },
    {
      title: 'Zero to One',
      author: 'Peter Thiel',
      description:
        'How to build something the world has never seen. The definitive book on startups and progress.',
      url: 'https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296',
    },
  ],
  organizations: [
    {
      title: 'Conjecture Institute',
      description:
        'Applying critical rationalism to AI safety and technology.',
      url: 'https://www.conjectureinstitute.com',
    },
    {
      title: 'Roots of Progress',
      description:
        'Building the intellectual foundation for a new philosophy of progress.',
      url: 'https://rootsofprogress.org',
    },
  ],
  opportunities: [
    {
      title: 'Emergent Ventures',
      description:
        'A fellowship fund from Tyler Cowen for ambitious people with ideas.',
      url: 'https://www.mercatus.org/emergent-ventures',
    },
    {
      title: 'Thiel Fellowship',
      description:
        '$100,000 for young people who want to build instead of going to college.',
      url: 'https://thielfellowship.org',
    },
  ],
}

function ResourceCard({
  title,
  description,
  author,
  url,
  hoverColor,
  delay,
}: {
  title: string
  description: string
  author?: string
  url: string
  hoverColor: string
  delay: number
}) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className={`block p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] ${hoverColor} transition-all duration-300 group`}
    >
      <h4 className="font-display font-semibold text-lg group-hover:text-indigo-400 transition-colors">
        {title}
      </h4>
      {author && <p className="text-sm text-slate-500 mt-1">by {author}</p>}
      <p className="text-slate-400 text-sm mt-2">{description}</p>
      <span className="inline-block mt-3 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
        Visit &rarr;
      </span>
    </motion.a>
  )
}

export default function Resources() {
  return (
    <section id="resources" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-indigo-400 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            Resources
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Level Up
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            The books, organizations, and opportunities for builders who take
            this seriously.
          </p>
        </motion.div>

        <div className="space-y-16">
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-slate-300">
              Required Reading
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {resources.books.map((book, i) => (
                <ResourceCard
                  key={book.title}
                  {...book}
                  hoverColor="hover:border-indigo-500/30"
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-slate-300">
              Aligned Organizations
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {resources.organizations.map((org, i) => (
                <ResourceCard
                  key={org.title}
                  {...org}
                  hoverColor="hover:border-purple-500/30"
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-slate-300">
              Grants &amp; Fellowships
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {resources.opportunities.map((opp, i) => (
                <ResourceCard
                  key={opp.title}
                  {...opp}
                  hoverColor="hover:border-amber-500/30"
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
