// Humanity's ages — the deep-history timeline behind /ages.
//
// Distinct from progress.ts: that file tracks recent (post-1800, mostly
// post-1990) numeric curves with a real baseline and latest value. This file
// is the much longer run, epochal leaps with no comparable "before/after
// number" to cite, just a date and why it mattered. Dates before recorded
// history are necessarily approximate (marked accordingly); dates from
// written history onward are specific, real, and checkable.

export type Age = {
  slug: string
  /** Negative = years before present (BP-style), positive = a real calendar year. */
  year: number
  yearLabel: string
  name: string
  description: string
  source: string
  sourceUrl: string
  /** How precise the date really is — deep prehistory is not a specific year. */
  precision: 'approximate' | 'dated'
}

export const ages: Age[] = [
  {
    slug: 'homo-sapiens',
    year: -300_000,
    yearLabel: '~300,000 years ago',
    name: 'Homo sapiens emerges',
    description:
      'Fossil evidence from Jebel Irhoud, Morocco, pushed the earliest known Homo sapiens back to roughly 300,000 years ago, about 100,000 years earlier than the previous consensus. Everything below is what one species did with the time since.',
    source: 'Nature — Hublin et al. 2017, Jebel Irhoud fossils',
    sourceUrl: 'https://www.nature.com/articles/nature22336',
    precision: 'approximate',
  },
  {
    slug: 'agricultural-revolution',
    year: -10_000,
    yearLabel: '~10,000 BCE',
    name: 'Agricultural Revolution',
    description:
      'Plant and animal domestication began independently in several regions, starting with the Fertile Crescent. Farming let a fixed area of land support far more people than foraging, which is what made cities, specialization, and surplus-funded institutions possible at all.',
    source: 'Our World in Data — Origins of Agriculture',
    sourceUrl: 'https://ourworldindata.org/history-of-agriculture',
    precision: 'approximate',
  },
  {
    slug: 'writing',
    year: -3200,
    yearLabel: '~3200 BCE',
    name: 'Writing invented',
    description:
      'Sumerian cuneiform, the earliest writing system with strong evidence, emerged in Mesopotamia for administrative record-keeping. This is the point knowledge stops being bounded by one person\'s memory or one generation\'s oral transmission.',
    source: 'British Museum — Cuneiform',
    sourceUrl: 'https://www.britishmuseum.org/collection/term/x21803',
    precision: 'approximate',
  },
  {
    slug: 'printing-press',
    year: 1440,
    yearLabel: '1440',
    name: 'Gutenberg\'s printing press',
    description:
      'Movable-type printing collapsed the cost of copying a text by roughly two orders of magnitude. Literacy, and later the Scientific Revolution and Reformation, were downstream of information suddenly being cheap to reproduce.',
    source: 'Britannica — Johannes Gutenberg',
    sourceUrl: 'https://www.britannica.com/biography/Johannes-Gutenberg',
    precision: 'dated',
  },
  {
    slug: 'steam-engine',
    year: 1769,
    yearLabel: '1769',
    name: 'Watt\'s steam engine patented',
    description:
      'James Watt\'s separate-condenser design made steam power practical beyond pumping water out of mines, and is conventionally treated as the starting gun for the Industrial Revolution: for the first time, human and animal muscle was no longer the ceiling on mechanical work.',
    source: 'Britannica — James Watt',
    sourceUrl: 'https://www.britannica.com/biography/James-Watt',
    precision: 'dated',
  },
  {
    slug: 'electrification',
    year: 1879,
    yearLabel: '1879',
    name: 'Practical incandescent light bulb',
    description:
      'Edison\'s long-lasting carbon-filament bulb made electric lighting commercially viable, and electrification followed over the next five decades: light, then motors, then an entire grid most of the modern economy still runs on.',
    source: 'Library of Congress — Edison\'s Lightbulb',
    sourceUrl: 'https://www.loc.gov/collections/edison-company-motion-pictures-and-sound-recordings/articles-and-essays/biography/edison-invents/electric-light-and-power/',
    precision: 'dated',
  },
  {
    slug: 'first-flight',
    year: 1903,
    yearLabel: 'December 17, 1903',
    name: 'First powered flight',
    description:
      'The Wright Flyer\'s 12-second, 120-foot flight at Kitty Hawk was the first sustained, controlled, powered flight by a heavier-than-air craft. Sixty-six years later a much faster-moving version of the same lineage put people on the Moon.',
    source: 'Smithsonian National Air and Space Museum',
    sourceUrl: 'https://airandspace.si.edu/explore/stories/wright-brothers',
    precision: 'dated',
  },
  {
    slug: 'nuclear-age',
    year: 1945,
    yearLabel: 'July 16, 1945',
    name: 'Trinity test — nuclear age begins',
    description:
      'The first detonation of a nuclear weapon, in the New Mexico desert, opened a civilizational-scale energy source and a civilizational-scale risk in the same instant. Every energy-abundance conversation since carries this in the background.',
    source: 'U.S. Department of Energy — Manhattan Project history',
    sourceUrl: 'https://www.energy.gov/management/articles/manhattan-project-trinity-test-1945',
    precision: 'dated',
  },
  {
    slug: 'space-age',
    year: 1957,
    yearLabel: 'October 4, 1957',
    name: 'Sputnik — the Space Age begins',
    description:
      'The Soviet Union\'s Sputnik 1 was the first artificial satellite. It weighed 184 pounds and did nothing but beep, and it still triggered a full civilizational reorientation of resources toward space within a decade.',
    source: 'NASA — Sputnik and the Dawn of the Space Age',
    sourceUrl: 'https://www.nasa.gov/history/sputnik-and-the-dawn-of-the-space-age/',
    precision: 'dated',
  },
  {
    slug: 'moon-landing',
    year: 1969,
    yearLabel: 'July 20, 1969',
    name: 'Moon landing',
    description:
      'Apollo 11 put the first humans on a surface other than Earth\'s, 66 years after the Wright brothers\' first 12-second flight. No human has gone farther than low Earth orbit since 1972 — the fastest part of the space curve was already behind us by this point, a real caution against assuming any curve keeps compounding.',
    source: 'NASA — Apollo 11 Mission Overview',
    sourceUrl: 'https://www.nasa.gov/mission/apollo-11/',
    precision: 'dated',
  },
  {
    slug: 'world-wide-web',
    year: 1991,
    yearLabel: 'August 6, 1991',
    name: 'World Wide Web goes public',
    description:
      'Tim Berners-Lee published the first website and made the WWW protocol publicly available from CERN. The internet-adoption curve tracked live on /signals starts counting from here.',
    source: 'CERN — A short history of the Web',
    sourceUrl: 'https://home.cern/science/computing/birth-web/short-history-web',
    precision: 'dated',
  },
]
