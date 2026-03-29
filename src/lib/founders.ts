export interface FoundersEpisode {
  title: string
  episodeNumber: number
  subject: string
  description: string
  url: string
  categorySlug: string
  keyInsight: string
}

export const FOUNDERS_EPISODES: FoundersEpisode[] = [
  // Health
  {
    title: 'The Man Who Saved Your Life',
    episodeNumber: 248,
    subject: 'Maurice Hilleman',
    description: 'The most prolific vaccine developer in history  - saved more lives than any other scientist.',
    url: 'https://www.founderspodcast.com/episodes/248',
    categorySlug: 'health',
    keyInsight: 'The greatest impact comes from solving problems most people don\'t even see.',
  },
  {
    title: 'Atul Gawande on Being Mortal',
    episodeNumber: 206,
    subject: 'Atul Gawande',
    description: 'A surgeon\'s examination of how medicine fails the people it is supposed to help.',
    url: 'https://www.founderspodcast.com/episodes/206',
    categorySlug: 'health',
    keyInsight: 'The best solutions require understanding the full human experience of the problem.',
  },
  // Climate / Energy
  {
    title: 'How Elon Musk Built Tesla',
    episodeNumber: 224,
    subject: 'Elon Musk',
    description: 'The inside story of building the world\'s most valuable car company from first principles.',
    url: 'https://www.founderspodcast.com/episodes/224',
    categorySlug: 'climate',
    keyInsight: 'If physics doesn\'t forbid it, it\'s achievable. Start from the laws of physics, not convention.',
  },
  {
    title: 'The Story of Standard Oil',
    episodeNumber: 25,
    subject: 'John D. Rockefeller',
    description: 'How one man\'s obsessive focus on efficiency transformed energy for the world.',
    url: 'https://www.founderspodcast.com/episodes/25',
    categorySlug: 'energy',
    keyInsight: 'The person who can cut costs and improve quality simultaneously will dominate any industry.',
  },
  {
    title: 'The Autobiography of Andrew Carnegie',
    episodeNumber: 179,
    subject: 'Andrew Carnegie',
    description: 'From impoverished Scottish immigrant to the richest man on earth through steel.',
    url: 'https://www.founderspodcast.com/episodes/179',
    categorySlug: 'energy',
    keyInsight: 'Put all your eggs in one basket, and then watch that basket.',
  },
  // Technology
  {
    title: 'Steve Jobs by Walter Isaacson',
    episodeNumber: 1,
    subject: 'Steve Jobs',
    description: 'The first episode. The intersection of technology and liberal arts.',
    url: 'https://www.founderspodcast.com/episodes/1',
    categorySlug: 'technology',
    keyInsight: 'Focus is saying no to the hundred other good ideas.',
  },
  {
    title: 'The Intel Trinity',
    episodeNumber: 121,
    subject: 'Robert Noyce, Gordon Moore, Andy Grove',
    description: 'Three people who created the foundation of the modern computing industry.',
    url: 'https://www.founderspodcast.com/episodes/121',
    categorySlug: 'technology',
    keyInsight: 'Only the paranoid survive. But the ambitious thrive.',
  },
  {
    title: 'Jeff Bezos and the Age of Amazon',
    episodeNumber: 175,
    subject: 'Jeff Bezos',
    description: 'Building the everything store through relentless customer obsession.',
    url: 'https://www.founderspodcast.com/episodes/175',
    categorySlug: 'technology',
    keyInsight: 'Your margin is my opportunity. Work backwards from the customer.',
  },
  // Economy / Governance
  {
    title: 'Sam Walton: Made in America',
    episodeNumber: 234,
    subject: 'Sam Walton',
    description: 'How the world\'s greatest retailer solved the cost problem for everyday Americans.',
    url: 'https://www.founderspodcast.com/episodes/234',
    categorySlug: 'economy',
    keyInsight: 'There\'s only one boss  - the customer. And they can fire everybody by spending their money somewhere else.',
  },
  {
    title: 'Poor Charlie\'s Almanack',
    episodeNumber: 90,
    subject: 'Charlie Munger',
    description: 'The wit and wisdom of Berkshire Hathaway\'s vice chairman on mental models.',
    url: 'https://www.founderspodcast.com/episodes/90',
    categorySlug: 'economy',
    keyInsight: 'Invert, always invert. Turn a problem upside down and solve it backwards.',
  },
  // Education
  {
    title: 'The Story of Edwin Land and Polaroid',
    episodeNumber: 96,
    subject: 'Edwin Land',
    description: 'The forgotten genius who invented instant photography and inspired Steve Jobs.',
    url: 'https://www.founderspodcast.com/episodes/96',
    categorySlug: 'education',
    keyInsight: 'The essential part of creativity is not being afraid to fail.',
  },
  {
    title: 'The Wright Brothers',
    episodeNumber: 157,
    subject: 'Wilbur & Orville Wright',
    description: 'Two bicycle mechanics who taught themselves to fly.',
    url: 'https://www.founderspodcast.com/episodes/157',
    categorySlug: 'education',
    keyInsight: 'Self-education plus obsessive experimentation beats credentials every time.',
  },
  // Food / Water / Agriculture
  {
    title: 'Ray Kroc and the Making of McDonald\'s',
    episodeNumber: 233,
    subject: 'Ray Kroc',
    description: 'How a milkshake machine salesman built the world\'s most successful food system.',
    url: 'https://www.founderspodcast.com/episodes/233',
    categorySlug: 'food',
    keyInsight: 'Nothing in the world can take the place of persistence.',
  },
  // Infrastructure / Space
  {
    title: 'Liftoff: Elon Musk and SpaceX',
    episodeNumber: 192,
    subject: 'Elon Musk',
    description: 'The desperate early years of building a rocket company from scratch.',
    url: 'https://www.founderspodcast.com/episodes/192',
    categorySlug: 'space',
    keyInsight: 'When something is important enough, you do it even if the odds are not in your favor.',
  },
  {
    title: 'The Power Broker: Robert Moses',
    episodeNumber: 265,
    subject: 'Robert Moses',
    description: 'The man who built modern New York and the dangers of unchecked infrastructure power.',
    url: 'https://www.founderspodcast.com/episodes/265',
    categorySlug: 'infrastructure',
    keyInsight: 'Infrastructure shapes civilization. The builder of roads determines the shape of cities.',
  },
  // Biology
  {
    title: 'The Gene: An Intimate History',
    episodeNumber: 310,
    subject: 'Siddhartha Mukherjee',
    description: 'The story of the gene and the future of human biology.',
    url: 'https://www.founderspodcast.com/episodes/310',
    categorySlug: 'biology',
    keyInsight: 'The most powerful technology is understanding the code that created us.',
  },
  // General / Cross-category wisdom
  {
    title: 'Zero to One',
    episodeNumber: 29,
    subject: 'Peter Thiel',
    description: 'The contrarian guide to building something the world has never seen.',
    url: 'https://www.founderspodcast.com/episodes/29',
    categorySlug: 'technology',
    keyInsight: 'What important truth do very few people agree with you on?',
  },
  {
    title: 'The Innovator\'s Dilemma',
    episodeNumber: 45,
    subject: 'Clayton Christensen',
    description: 'Why great companies fail and how disruptive innovation creates opportunities.',
    url: 'https://www.founderspodcast.com/episodes/45',
    categorySlug: 'technology',
    keyInsight: 'The biggest opportunities are in markets that incumbents dismiss as too small.',
  },
]

export function getEpisodesForCategory(categorySlug: string): FoundersEpisode[] {
  return FOUNDERS_EPISODES.filter(e => e.categorySlug === categorySlug)
}

export function getFeaturedEpisodes(limit: number = 3): FoundersEpisode[] {
  return FOUNDERS_EPISODES.slice(0, limit)
}
