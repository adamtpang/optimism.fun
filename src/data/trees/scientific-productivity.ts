// Constraint tree for optimism.fun: why does each research dollar buy less progress?
// Researched 2026-11-11. Every number below was read on a page opened this session.
// Inference is labeled as inference. Disputed findings are labeled as disputed.

import type { ConstraintTree } from '../constraints'

const BLOOM_2020 = {
  label: 'Bloom, Jones, Van Reenen and Webb, Are Ideas Getting Harder to Find?, American Economic Review 2020',
  url: 'https://www.aeaweb.org/articles?id=10.1257/aer.20180338',
}
const JONES_BURDEN = {
  label: 'Jones, The Burden of Knowledge and the Death of the Renaissance Man, NBER Working Paper 11360',
  url: 'https://www.nber.org/papers/w11360',
}
const PARK_RELEASE = {
  label: 'University of Minnesota Carlson School release on Park, Leahey and Funk, Nature 2023',
  url: 'https://carlsonschool.umn.edu/news/science-and-technology-are-becoming-less-disruptive',
}
const PETERSEN_CRITIQUE = {
  label: 'Petersen, Arroyave and Pammolli, The disruption index is biased by citation inflation (arXiv 2306.01949)',
  url: 'https://arxiv.org/abs/2306.01949',
}
const PARK_REPLY = {
  label: 'Park, Leahey and Funk, Robust Evidence for Declining Disruptiveness (arXiv 2503.00184)',
  url: 'https://arxiv.org/abs/2503.00184v1',
}
const NIH_AGE = {
  label: 'NIH Extramural Nexus, Age at first R01-equivalent award remains stable since FY21 (Aug 2026)',
  url: 'https://grants.nih.gov/news-events/nih-extramural-nexus-news/2026/08/age-at-first-r01-equivalent-award-remains-stable-since-fy21',
}
const FDP_SURVEY = {
  label: 'UC Berkeley research administration news, FDP publishes 2012 Faculty Workload Survey (16 April 2014)',
  url: 'https://news-rac.berkeley.edu/2014/04/fdp-publishes-faculty-workload-survey.html',
}
const CONVERGENT = {
  label: 'Convergent Research, Focused Research Organizations',
  url: 'https://www.convergentresearch.org',
}
const OSC_2015 = {
  label: 'AcaWiki summary of Open Science Collaboration, Estimating the reproducibility of psychological science, Science 2015',
  url: 'https://acawiki.org/Estimating_the_reproducibility_of_psychological_science',
}

export const scientificProductivityTree: ConstraintTree = {
  problemSlug: 'scientific-productivity',
  outcome:
    'More discoveries per researcher-year. Today the trend runs the other way: keeping chip density doubling takes more than 18 times as many researchers as in the early 1970s.',
  whyUnsolved:
    'Three things pull output per researcher down. Each field asks for more learning before a person can add to it, so careers start later and work narrows. The funding system takes a large share of the time researchers do have. And some published results do not replicate, so later work may rest on results that do not hold. Inference: the first is the best documented and the hardest to change.',
  bindingId: 'burden-of-knowledge',
  updated: '2026-11-11',
  root: [
    {
      id: 'burden-of-knowledge',
      claim: 'New ideas take more researchers and more training to find than they used to.',
      kind: 'science',
      whyUnsolved:
        'Bloom and co-authors found research effort rising substantially while research productivity declines sharply across industries, products and firms. Jones\'s model says that as knowledge piles up, people train longer, specialise and work in teams. At NIH the median age at a first major grant has sat near 42 since 2021, after rising through the 1990s and 2000s. NIH gives no cause for the rise; reading it as a sign of the knowledge burden is inference. Nobody can make the frontier closer. The open question is whether tools can cut the time to reach it. Binding choice is inference.',
      falsifier:
        'Fields where output per researcher is flat or rising for decades. Or evidence that the measured decline is an artifact of how output is counted.',
      tested:
        'Looked for evidence against. One widely cited measure is disputed. Park, Leahey and Funk reported that disruptiveness scores for papers fell 91.9 to 100 percent between 1945 and 2010, across 45 million papers. Petersen and co-authors argue that the index is biased by citation inflation and cannot be compared across time. A separate critique by Holst and co-authors blamed papers with no references; the original authors replied that the decline holds under those critics\' own data and exclusions. No reply to the citation-inflation critique was read this session. So the citation-based evidence is contested. The Bloom result rests on different data, researcher counts against output, and no refutation of it was searched for this session.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Not researched this session who builds tools that shorten the path to the frontier, such as AI research assistants or automated labs, or whether any has measured gains.',
      },
      entryPoints: [
        { who: 'talent', action: 'Pick one field and measure researcher-years per unit of output over time, using the Bloom method, and publish the series.' },
        { who: 'talent', action: 'Test one AI research tool against a control group of researchers on a fixed task and report time saved.' },
        { who: 'capital', action: 'Fund an independent replication of the disruptiveness decline on a clean dataset to settle the dispute.' },
      ],
      sources: [BLOOM_2020, JONES_BURDEN, NIH_AGE, PARK_RELEASE, PETERSEN_CRITIQUE, PARK_REPLY],
    },
    {
      id: 'funding-structure',
      claim: 'The funding system spends researcher time on process and leaves some kinds of work with no home.',
      kind: 'coordination',
      whyUnsolved:
        'In a 2012 survey of 13,453 principal investigators at 111 US institutions, researchers estimated that 42 percent of their research time on federal projects went to meeting requirements, not active research. The source says the 2005 survey gave similar results, suggesting little change. The 2012 response rate was 26 percent. Separately, Convergent Research describes Focused Research Organizations as time-bound efforts to produce public goods that unblock scientific progress. Inference: rules are added one at a time by many agencies and nobody is charged with removing them.',
      falsifier:
        'Researchers freed from administrative work produce no more than those who are not. Or the 42 percent figure does not hold when time is logged, not self-reported.',
      tested:
        'Not tested for output. The 42 percent figure is self-reported and from 2012. No later round of the survey was opened this session, so the current figure is unknown here.',
      suppliers: [
        'Federal Demonstration Partnership (measures the burden)',
        'Convergent Research (launches Focused Research Organizations)',
      ],
      supplyState: 'thin',
      additionality: {
        level: 'medium',
        why: 'Inference: the burden is measured but few groups are named as removing it. Convergent\'s homepage shows eight Focused Research Organizations and links to more, which is small against the size of public research.',
      },
      entryPoints: [
        { who: 'talent', action: 'Log one lab\'s hours for a month by task and compare the result with the 42 percent survey figure.' },
        { who: 'operator', action: 'If you run a research office, remove one internal approval step and publish the hours saved.' },
        { who: 'capital', action: 'Fund one Focused Research Organization, or a grant program with a two-page application and a decision in weeks.' },
      ],
      sources: [FDP_SURVEY, CONVERGENT],
    },
    {
      id: 'reliability',
      claim: 'A share of published findings does not replicate, so later work may rest on results that do not hold.',
      kind: 'coordination',
      whyUnsolved:
        'When the Open Science Collaboration reran published psychology studies, 36 percent of replications were statistically significant, against about 97 percent of the originals. A failed replication does not by itself show the original was wrong. This figure is for psychology. Rates in other fields were not researched this session.',
      falsifier:
        'Large replication projects in other fields find that most results hold. Or fields with low replication rates advance as fast as fields with high ones.',
      suppliers: ['Open Science Collaboration'],
      supplyState: 'unresearched',
      additionality: {
        level: 'unknown',
        why: 'Not researched this session who funds replication, or how much research effort is lost to results that do not hold.',
      },
      entryPoints: [
        { who: 'talent', action: 'Replicate one highly cited result in your own field and publish the outcome either way.' },
        { who: 'capital', action: 'Fund a replication round for the ten most-cited findings in one subfield.' },
      ],
      sources: [OSC_2015],
    },
  ],
}
