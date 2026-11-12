// Constraint tree for optimism.fun: why is pedagogy at scale not solved yet?
// Researched 2026-11-11. Every number below was read on a page opened this session.
// Inference is labeled as inference. Blog-reported results are labeled as such.

import type { ConstraintTree } from '../constraints'

const WB_LEARNING_POVERTY = {
  label: 'World Bank press release, 70% of 10-year-olds in learning poverty (23 June 2022)',
  url: 'https://www.worldbank.org/en/news/press-release/2022/06/23/70-of-10-year-olds-now-in-learning-poverty-unable-to-read-and-understand-a-simple-text',
}
const SMART_BUYS = {
  label: 'World Bank press release on the GEEAP Smart Buys report (9 May 2023)',
  url: 'https://www.worldbank.org/en/news/press-release/2023/05/09/education-smart-buys-cost-effectively-supporting-teachers-and-parents-can-lead-to-significant-learning-improvements',
}
const UN_TEACHERS = {
  label: 'UN News on the UNESCO Global Report on Teachers: 44 million teachers needed by 2030',
  url: 'https://news.un.org/en/node/1147067',
}
const NICKOW_NBER = {
  label: 'Nickow, Oreopoulos and Quan, NBER Working Paper 27476 (2020), tutoring meta-analysis',
  url: 'https://www.nber.org/papers/w27476',
}
const NICKOW_2024 = {
  label: 'Stanford NSSA summary of the 2024 published tutoring meta-analysis (89 RCTs)',
  url: 'https://nssa.stanford.edu/studies/promise-tutoring-prek-12-learning-systematic-review-and-metaanalysis-experimental-evidence',
}
const WB_NIGERIA = {
  label: 'World Bank blog, From chalkboards to chatbots: generative AI tutoring pilot in Edo State, Nigeria',
  url: 'https://blogs.worldbank.org/en/education/From-chalkboards-to-chatbots-Transforming-learning-in-Nigeria',
}
const UIS_DATA = {
  label: 'Montoya and Crouch (UNESCO Institute for Statistics), The foundational learning data challenge (13 Sept 2023)',
  url: 'https://world-education-blog.org/2023/09/13/compare-align-track-the-foundational-learning-data-challenge/',
}

export const pedagogyTree: ConstraintTree = {
  problemSlug: 'pedagogy',
  outcome:
    'Every child can read and understand a simple text by age 10. In 2022 an estimated 70 percent of 10-year-olds in low- and middle-income countries could not, up from 57 percent before the pandemic.',
  whyUnsolved:
    'Most of these children are in school. The gap is what happens in the classroom. Teaching matched to each child, and structured lesson support for teachers, raise learning at low cost in trials, but few systems deliver them at scale. One-to-one tutoring works but needs staff the world does not have, and AI tutoring has one short trial behind it. Many countries cannot measure early-grade learning at all.',
  bindingId: 'instruction',
  updated: '2026-11-11',
  root: [
    {
      id: 'instruction',
      claim: 'Children sit in class but the teaching is not matched to what they can already do.',
      kind: 'delivery',
      whyUnsolved:
        'Lessons follow the grade curriculum, not the level of the child. The methods that fix this are known. An expert panel hosted by the World Bank, UNICEF, FCDO and USAID ranked teaching by learning level as a "great buy" and structured lesson plans with coaching as a key cost-effective approach. Rolling them out means changing daily practice for millions of teachers. Binding choice is inference.',
      falsifier:
        'Systems that adopt level-based teaching or structured pedagogy at scale show no learning gains. Or learning poverty falls widely without any change in classroom practice.',
      tested:
        'Looked for failure at scale and found the opposite in the one source opened. Kenya\'s PRIMR programme produced reading fluency gains equal to more than one year of normal learning and was scaled nationally as Tusome. Teaching at the Right Level was tested in Ghana and scaled in India, Cote d\'Ivoire and Zambia. The same panel rated computer hardware alone, and inputs without teacher support, as "bad buys". Weak point: this is a press summary of the panel report. Cost per child and the size of gains after scale-up were not on the page.',
      suppliers: [
        'Global Education Evidence Advisory Panel (FCDO, UNICEF Innocenti, USAID, World Bank)',
        'Teaching at the Right Level programmes (India, Ghana, Cote d\'Ivoire, Zambia)',
        'Tusome Early Grade Reading (Kenya Ministry of Education with USAID)',
      ],
      supplyState: 'thin',
      additionality: {
        level: 'high',
        why: 'Inference: the methods are proven in trials and learning poverty is still 70 percent, so each system that adopts them reaches children no current programme reaches.',
      },
      entryPoints: [
        { who: 'operator', action: 'If you run schools, pilot level-based grouping for one hour a day in 10 schools with a published reading baseline.' },
        { who: 'talent', action: 'Build structured lesson plans and a coaching checklist for early-grade reading in one language, under a ministry or school network.' },
        { who: 'capital', action: 'Fund the scale-up of one structured pedagogy programme with an independent learning assessment attached.' },
      ],
      sources: [WB_LEARNING_POVERTY, SMART_BUYS],
    },
    {
      id: 'tutoring-cost',
      claim: 'One-to-one tutoring works, but there are not enough adults to give it to every child.',
      kind: 'engineering',
      whyUnsolved:
        'The world is short 44 million teachers for ordinary classrooms by 2030, 15 million of them in sub-Saharan Africa. Paying the salaries would take an estimated $120 billion a year. A human tutor per child is far beyond that. The open question is whether software can deliver the tutoring effect without the tutor.',
      falsifier:
        'A randomized trial at scale shows AI tutoring matching human tutoring gains over a full school year. That would turn this into a delivery problem. Or human tutoring is shown to scale cheaply with volunteers.',
      tested:
        'Partly tested. Human tutoring: a meta-analysis of randomized trials found a pooled effect of 0.37 standard deviations in its 2020 working paper and 0.288 across 89 trials in the 2024 published version. Effects were larger with teachers or paraprofessionals as tutors, which are the scarce staff. These measured effects are well below the two standard deviations in Bloom\'s 1984 claim, which was not re-read this session. AI tutoring: a World Bank after-school pilot in Edo State, Nigeria reported about 0.3 standard deviations in six weeks. That figure is from a World Bank blog, covers one subject and one six-week term, and long-run effects are listed as unknown.',
      suppliers: ['World Bank with Edo State, Nigeria (generative AI tutoring pilot)'],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Not researched this session how many teams build AI tutors or which have trial evidence. The evidence gap, not the product count, looks like the open space.',
      },
      entryPoints: [
        { who: 'talent', action: 'Run a randomized trial of one AI tutor over a full school year and publish the effect in standard deviations.' },
        { who: 'capital', action: 'Fund an independent replication of the Edo State pilot in a second country and a second subject.' },
        { who: 'operator', action: 'If you run an after-school programme, add a tutoring arm with random assignment so the result can be measured.' },
      ],
      sources: [UN_TEACHERS, NICKOW_NBER, NICKOW_2024, WB_NIGERIA],
    },
    {
      id: 'learning-data',
      claim: 'Many countries cannot see whether young children are learning, so they cannot steer.',
      kind: 'coordination',
      whyUnsolved:
        'Comparable learning data is much thinner for grades 2 and 3 than for the end of primary. Only two regional assessments, PASEC in Africa and ERCE in Latin America, can be used to report early-grade learning. The UNESCO Institute for Statistics says comparable data is not progressing fast or equally enough. The count of countries with no early-grade data is unknown: the source shows it only in a chart.',
      falsifier:
        'Countries with regular early-grade assessment improve no faster than countries without it.',
      suppliers: ['UNESCO Institute for Statistics (AMPL assessments)', 'PASEC', 'ERCE'],
      supplyState: 'thin',
      additionality: {
        level: 'medium',
        why: 'Inference: measurement does not teach anyone, but the first two constraints cannot be managed without it. A cheap comparable test adds most where no assessment exists.',
      },
      entryPoints: [
        { who: 'talent', action: 'Map which countries have no comparable grade 2 or 3 reading data and publish the list with sources.' },
        { who: 'capital', action: 'Pay for one round of a comparable early-grade assessment in a country that has none.' },
      ],
      sources: [UIS_DATA, WB_LEARNING_POVERTY],
    },
  ],
}
