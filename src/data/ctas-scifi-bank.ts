/**
 * Calls to action for the five problems in problems-scifi-bank.ts.
 * Appended, not interleaved, so a rebase can keep both this spread and any
 * rows added at the end of ctas.ts.
 */
import type { Cta } from './ctas'

const CHECKED = '2026-11-20'

export const sciFiBankCtas: Cta[] = [
  {
    id: 'until-rewarming-build-organ-banking',
    problemSlugs: ['organ-banking'],
    kind: 'build',
    name: 'Until',
    url: 'https://www.untillabs.com/blog/rewarming',
    type: 'startup',
    oneLiner:
      'Until reports that its Mark 1 rewarmed a vitrified pig kidney, at 59 degrees per minute in a deep vein and 73 degrees per minute in the cortex.',
    location: 'United States',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'until-roadmap-learn-organ-banking',
    problemSlugs: ['organ-banking'],
    kind: 'learn',
    name: 'Until roadmap',
    url: 'https://www.untillabs.com/roadmap',
    type: 'report',
    oneLiner:
      'Until says it is developing reversible cryopreservation for human organs, and lists a first-in-human organ trial as future work.',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'srtr-2024-nonuse-learn-organ-banking',
    problemSlugs: ['organ-banking'],
    kind: 'learn',
    name: 'OPTN/SRTR 2024 deceased donation report',
    url: 'https://srtr.hrsa.gov/adr/2024/DOD/',
    type: 'government',
    oneLiner:
      'The report says 11,244 organs were recovered for transplant in 2024 and not transplanted, 20.7 percent of organs recovered.',
    location: 'United States',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'hrsa-waitlist-learn-organ-shortage',
    problemSlugs: ['organ-shortage', 'organ-banking'],
    kind: 'learn',
    name: 'HRSA organ donation statistics',
    url: 'https://www.organdonor.gov/learn/organ-donation-statistics',
    type: 'government',
    oneLiner:
      'Reviewed August 2026: 109,817 people are on the US transplant waiting list, and 12 people die each day waiting.',
    location: 'United States',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'egenesis-egen-2784-build-organ-shortage',
    problemSlugs: ['organ-shortage'],
    kind: 'build',
    name: 'eGenesis',
    url: 'https://egenesisbio.com/news-media/press-releases/egenesis-announces-clinical-update-in-ongoing-expanded-access-study-of-egen-2784-in-patients-with-kidney-failure',
    type: 'startup',
    oneLiner:
      'eGenesis says five patients received an EGEN-2784 pig kidney under expanded access since March 2024, and expects a Phase 1/2/3 trial to start in the first quarter of 2027.',
    location: 'Cambridge, Massachusetts',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'godt-2024-learn-organ-shortage',
    problemSlugs: ['organ-shortage'],
    kind: 'learn',
    name: 'WHO Global Observatory on Donation and Transplantation, 2024',
    url: 'https://www.transplant-observatory.org/wp-content/uploads/2026/03/glostatpubTransplantation.pdf',
    type: 'report',
    oneLiner:
      '91 countries reported 173,727 solid organ transplants for 2024, a 2 percent increase from 2023. The report says the organ shortage continues.',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'neuralink-gb-prime-build-brain-computer-interface',
    problemSlugs: ['brain-computer-interface'],
    kind: 'build',
    name: 'Neuralink GB-PRIME',
    url: 'https://www.uclh.nhs.uk/news/seven-gb-prime-patients-now-participating-neuralink-trial',
    type: 'startup',
    oneLiner:
      'UCLH says seven patients received a Neuralink implant between October and December 2025 in an early feasibility study.',
    location: 'London',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'synchron-focus-aus-build-brain-computer-interface',
    problemSlugs: ['brain-computer-interface'],
    kind: 'build',
    name: 'Synchron FOCUS-AUS',
    url: 'https://clinicaltrials.gov/study/NCT07533903',
    type: 'startup',
    oneLiner:
      'ClinicalTrials.gov lists Synchron study NCT07533903 as active, not recruiting, with an estimated enrollment of 10.',
    location: 'Melbourne',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'synchron-intent-pause-learn-brain-computer-interface',
    problemSlugs: ['brain-computer-interface'],
    kind: 'learn',
    name: 'Citeline on the Synchron pause',
    url: 'https://insights.citeline.com/medtech-insight/business/r-and-d/clinical-trials/synchron-pauses-clinical-trial-on-brain-interface-plans-to-resume-trial-with-upgraded-system-EI6NFVRTHVF3TPIX7NKBDAXLOE/',
    type: 'report',
    oneLiner:
      'Citeline, 19 November 2026, says Synchron paused enrollment in the INTENT trial of its second-generation Stentrode after a lead performance issue.',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'cdc-als-learn-brain-computer-interface',
    problemSlugs: ['brain-computer-interface'],
    kind: 'learn',
    name: 'CDC National ALS Registry fact sheet',
    url: 'https://wwwn.cdc.gov/ALS/Download/Incidence_Prevalence%20Fact%20Sheet.pdf',
    type: 'government',
    oneLiner:
      'Last reviewed June 2024: about 30,000 people in the United States are living with ALS, and about 5,000 to 6,000 are diagnosed each year.',
    location: 'United States',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'doctronic-utah-build-ai-clinical-care',
    problemSlugs: ['ai-clinical-care'],
    kind: 'build',
    name: 'Doctronic',
    url: 'https://commerce.utah.gov/ai/regulatory-relief-4/authorized-pilots/doctronic/',
    type: 'startup',
    oneLiner:
      'Utah approved a Doctronic pilot that can process 30, 60, or 90 day renewals of medicines a licensed provider already prescribed.',
    location: 'Utah',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'utah-oaip-doctronic-learn-ai-clinical-care',
    problemSlugs: ['ai-clinical-care'],
    kind: 'learn',
    name: 'Utah Office of Artificial Intelligence Policy',
    url: 'https://commerce.utah.gov/ai/regulatory-relief-4/authorized-pilots/doctronic/',
    type: 'government',
    oneLiner:
      'The Office says the pilot is still in phase 1, a physician must authorize each renewal, and no serious safety incident has been reported to it.',
    location: 'Utah',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'nejm-utah-pilot-learn-ai-clinical-care',
    problemSlugs: ['ai-clinical-care'],
    kind: 'learn',
    name: 'NEJM on Utah\'s renewal pilot',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMp2601148',
    type: 'paper',
    oneLiner:
      'Perspective published 18 April 2026 on Utah\'s pilot of an AI system that renews some prescriptions for chronic conditions.',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'who-uhc-learn-ai-clinical-care',
    problemSlugs: ['ai-clinical-care'],
    kind: 'learn',
    name: 'WHO universal health coverage fact sheet',
    url: 'https://www.who.int/news-room/fact-sheets/detail/universal-health-coverage-(uhc)',
    type: 'report',
    oneLiner:
      'The 5 December 2025 fact sheet says about 4.6 billion people were not fully covered by essential health services in 2023.',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'vitara-extend-build-artificial-womb',
    problemSlugs: ['artificial-womb'],
    kind: 'build',
    name: 'Vitara Biomedical',
    url: 'https://www.vitara.com/',
    type: 'startup',
    oneLiner:
      'Vitara describes EXTEND, a fluid-filled system intended for newborns delivered as early as 22 weeks, for up to 28 days.',
    location: 'Philadelphia',
    checkedDate: CHECKED,
    checked: true,
  },
  {
    id: 'who-preterm-learn-artificial-womb',
    problemSlugs: ['artificial-womb'],
    kind: 'learn',
    name: 'WHO preterm birth fact sheet',
    url: 'https://www.who.int/news-room/fact-sheets/detail/preterm-birth',
    type: 'report',
    oneLiner:
      'The 10 May 2023 fact sheet says an estimated 13.4 million babies were born preterm in 2020, and about 900,000 children died of preterm complications in 2019.',
    checkedDate: CHECKED,
    checked: true,
  },
]
