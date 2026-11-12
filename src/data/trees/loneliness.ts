import type { ConstraintTree } from '../constraints'

/**
 * Loneliness. Sources opened 2026-11-11: the WHO Commission on Social
 * Connection release, the University of Kansas summary of Hall's hours study,
 * Masi et al.'s meta-analysis of interventions, and Bisnow on the co-living
 * failures. Claims we could not open a primary page for (for example the US
 * time-use decline) are left out rather than repeated from news coverage.
 */
const WHO_2025 = {
  label: 'WHO, Social connection linked to improved health and reduced risk of early death, 2025-06-30',
  url: 'https://www.who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death',
}
const HALL = {
  label: 'University of Kansas, on Hall, Journal of Social and Personal Relationships, 2018',
  url: 'https://news.ku.edu/news/article/2018/03/06/study-reveals-number-hours-it-takes-make-friend',
}
const MASI = {
  label: 'Masi, Chen, Hawkley and Cacioppo, A Meta-Analysis of Interventions to Reduce Loneliness, Pers Soc Psychol Rev, 2011',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3865701/',
}
const BISNOW = {
  label: 'Bisnow, Co-living firm Common to shutter after aggressive expansion ends in bankruptcy, 2024-06-03',
  url: 'https://www.bisnow.com/national/news/multifamily/co-living-firm-common-to-shutter-after-aggressive-expansion-ends-in-bankruptcy-124520',
}

export const lonelinessTree: ConstraintTree = {
  problemSlug: 'loneliness',
  outcome:
    'Fewer people lonely. Today WHO puts it at 1 in 6 people worldwide, about 24 percent in low-income countries and about 11 percent in high-income ones, and links loneliness to more than 871,000 deaths a year.',
  whyUnsolved:
    'A friendship takes many hours with the same person. Hall measured roughly 50 hours to a casual friend, about 90 to a friend, and more than 200 to a close friend, and hours spent working together counted for less. Adult life rarely supplies those hours without planning. Most products offer an introduction, which is the cheap part. The settings that do supply the hours, such as shared housing, have struggled as businesses. And for people who are already lonely, contact alone helps less than changing how they read other people.',
  bindingId: 'repeated-hours',
  updated: '2026-11-11',
  root: [
    {
      id: 'repeated-hours',
      claim:
        'The binding constraint is repeated time with the same people. Adults do not get the 50 to 200 hours a friendship takes unless a setting supplies them.',
      kind: 'coordination',
      whyUnsolved:
        'Nobody owns the hours after the introduction. A match, an event or a group chat is one meeting. Hall found the hours have to be leisure time together, and that time at work counts for less. WHO lists social infrastructure such as parks, libraries and cafes among the solutions, which is the same point at city scale.',
      falsifier:
        'A study showing that lonely adults already spend as many leisure hours with the same people as non-lonely adults, or a scalable intervention that cuts loneliness without adding repeated time together.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'high',
        why: 'We found no organization whose measured output is repeated hours between the same people. One more team that measures that, and shows loneliness falling with it, would be new evidence.',
      },
      entryPoints: [
        {
          who: 'talent',
          action:
            'Run one standing weekly gathering with the same 8 to 15 people for 12 weeks. Record hours together per person and a loneliness score at week 0 and week 12.',
        },
        {
          who: 'operator',
          action:
            'If you run a residence, a campus or a cohort program, measure repeat encounters between the same residents, not event attendance, and publish the number.',
        },
        {
          who: 'capital',
          action: 'Fund a trial that measures hours together and loneliness in the same people, with a comparison group.',
        },
      ],
      sources: [HALL, WHO_2025],
    },
    {
      id: 'social-cognition',
      claim:
        'For people who are already lonely, more contact is not enough. The interventions that worked best changed how lonely people think about others.',
      kind: 'delivery',
      whyUnsolved:
        'Masi and colleagues compared four kinds of program: social skills, social support, more opportunities for contact, and addressing maladaptive social cognition. In the randomized studies the last kind did best. That work is delivered as therapy, one person at a time, which is slow and costly to scale.',
      falsifier:
        'Randomized trials in which programs that only add contact reduce loneliness as much as programs that address social cognition.',
      tested:
        'Masi et al. report a mean effect of -0.198 across randomized group comparison studies, smaller than the -0.367 and -0.459 seen in weaker study designs. So the measured effect of any program is modest, and the best evidence favors the social cognition approach. We did not find a later meta-analysis that overturns this, and we did not search exhaustively.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'medium',
        why: 'The method exists. The open question is delivering it cheaply and to groups, inside settings that also supply the hours.',
      },
      entryPoints: [
        {
          who: 'talent',
          action:
            'If you are a clinician or researcher, test a group format of the social cognition approach inside an existing community setting and report the effect size.',
        },
        {
          who: 'capital',
          action: 'Fund a randomized trial that combines a social cognition program with a standing weekly group, against either one alone.',
        },
      ],
      sources: [MASI],
    },
    {
      id: 'bundle-economics',
      claim:
        'The settings that put people near each other every day, such as shared housing, have not held up as businesses, so the supply of them stays small.',
      kind: 'payment',
      whyUnsolved:
        'Common, a co-living operator that raised more than $130M in venture capital, filed for Chapter 7 bankruptcy in 2024. Bisnow ties the failure to its contracts and business model, to interest rates, to rising operating costs, and to the pandemic cutting demand for shared apartments. The same report names Starcity, The Collective and Quarters as earlier failures. The reported causes are financial. None of them is evidence that residents did not want the community.',
      falsifier:
        'A shared-living or membership community that has run for five or more years at a profit and reports lower loneliness among members than a comparison group.',
      suppliers: [],
      supplyState: 'thin',
      additionality: {
        level: 'medium',
        why: 'A model that covers its costs without owning or leasing buildings at scale would remove the cause the failures share.',
      },
      entryPoints: [
        {
          who: 'operator',
          action:
            'Test a version with no real-estate risk first: a paid weekly gathering in borrowed space. Prove people renew before signing any lease.',
        },
        {
          who: 'capital',
          action:
            'Before funding a community operator, ask for member renewal and repeat-attendance numbers, not occupancy alone.',
        },
      ],
      sources: [BISNOW],
    },
  ],
}
