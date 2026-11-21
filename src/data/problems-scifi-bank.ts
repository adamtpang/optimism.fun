/**
 * Five problems from a 2026-11-20 pass over unbuilt ideas.
 * The science-fiction line on each row is a paraphrase of the lineage Adam
 * named. It is not a source for any number.
 *
 * Kept in its own module so a rebase onto the heart-disease branch only has
 * to keep this spread, not merge two large objects at the end of problems.ts.
 */
import type { Problem } from './types'

const AS_OF = '2026-11-20'

const NOT_BORING = {
  sourceUrl: 'https://notboring.com/sci-fi-idea-bank',
  sourceLabel: 'Not Boring Sci-Fi Idea Bank',
} as const

const HRSA_WAITLIST = 'https://www.organdonor.gov/learn/organ-donation-statistics'
const SRTR_DONATION = 'https://srtr.hrsa.gov/adr/2024/DOD/'
const UNTIL_REWARM = 'https://www.untillabs.com/blog/rewarming'
const UNTIL_ROADMAP = 'https://www.untillabs.com/roadmap'
const EGENESIS =
  'https://egenesisbio.com/news-media/press-releases/egenesis-announces-clinical-update-in-ongoing-expanded-access-study-of-egen-2784-in-patients-with-kidney-failure'
const GODT =
  'https://www.transplant-observatory.org/wp-content/uploads/2026/03/glostatpubTransplantation.pdf'
const UCLH = 'https://www.uclh.nhs.uk/news/seven-gb-prime-patients-now-participating-neuralink-trial'
const SYNCHRON_TRIAL = 'https://clinicaltrials.gov/study/NCT07533903'
const SYNCHRON_PAUSE =
  'https://insights.citeline.com/medtech-insight/business/r-and-d/clinical-trials/synchron-pauses-clinical-trial-on-brain-interface-plans-to-resume-trial-with-upgraded-system-EI6NFVRTHVF3TPIX7NKBDAXLOE/'
const CDC_ALS = 'https://wwwn.cdc.gov/ALS/Download/Incidence_Prevalence%20Fact%20Sheet.pdf'
const WHO_SCI = 'https://www.who.int/news-room/fact-sheets/detail/spinal-cord-injury'
const UTAH_DOCTRONIC = 'https://commerce.utah.gov/ai/regulatory-relief-4/authorized-pilots/doctronic/'
const NEJM_UTAH = 'https://www.nejm.org/doi/full/10.1056/NEJMp2601148'
const WHO_UHC = 'https://www.who.int/news-room/fact-sheets/detail/universal-health-coverage-(uhc)'
const VITARA = 'https://www.vitara.com/'
const WHO_PRETERM = 'https://www.who.int/news-room/fact-sheets/detail/preterm-birth'

export const sciFiBankProblems: Problem[] = [
  {
    slug: 'organ-banking',
    name: 'Organ banking',
    tier: 'welfare',
    domain: 'health',
    sectors: ['physical-health-and-disease'],
    tagline:
      'In 2024, 11,244 organs recovered for transplant in the United States were not transplanted. 109,817 people are on the US waiting list.',
    description:
      'Organ banking is the attempt to cool a donor organ into a glass-like state and warm it back without ice, so a kidney, liver, heart, or lung can wait for a matched patient instead of a few hours on ice. Until, formerly Cradle, reported on 12 May 2026 that its Mark 1 system rewarmed a vitrified pig kidney, at an average 59 degrees per minute in a deep vein and 73 degrees per minute in the cortex. Its roadmap still lists a first-in-human organ trial, and reversible whole-body preservation, as work ahead. The same US waiting list is counted on the organ-shortage problem. The two rows are not added. Neither is mapped onto kidney disease, hypertension, or longevity, so those deaths are not counted again here. Whole-body revival is the long-term use Until describes. It is not given longevity\'s death toll.',
    humansAffected: {
      value: 109_817,
      unit: 'people on the US national transplant waiting list. The same list is on the organ-shortage problem and is not added to it. Not a global count.',
      countKind: 'population',
      observationYear: 2026,
      source: 'HRSA organdonor.gov, Organ Donation Statistics, date last reviewed August 2026. The page states 109,817 people on the national transplant waiting list.',
      sourceUrl: HRSA_WAITLIST,
      confidence: 'high',
      asOf: AS_OF,
    },
    severityNote:
      'No death rate is scored. HRSA says 12 people die each day waiting and does not state an annual total on that page, so 12 was not multiplied by 365. The 109,817 people are the same US list as on organ shortage. OPTN/SRTR says 11,244 recovered organs were not transplanted in 2024 and does not attribute that nonuse to preservation time. Whole-body revival is not given the longevity death toll.',
    scale: {
      value: 11_244,
      unit: 'US organs recovered for transplant but not transplanted (2024). 20.7 percent of organs recovered. The report does not say the cause was time.',
      trend: 'worsening',
      series: [
        { year: 2023, value: 10_085 },
        { year: 2024, value: 11_244 },
      ],
      source:
        'OPTN/SRTR 2024 Annual Data Report, deceased organ donation: 11,244 organs recovered for transplant but not transplanted in 2024, up from 10,085 in 2023. Nonuse was 20.7 percent of organs recovered in 2024.',
      sourceUrl: SRTR_DONATION,
      confidence: 'high',
      asOf: AS_OF,
    },
    transformation: {
      before:
        'A recovered organ has hours, not a bank. In 2024, 11,244 US organs were recovered for transplant and not transplanted. 109,817 people are on the US waiting list.',
      after:
        'A donated organ can be held long enough to reach a matched patient, and the nonuse that is caused by the clock falls. Whole-body revival is a later claim and is not this result.',
      horizon: 'not estimated',
      confidence: 'low',
      asOf: AS_OF,
    },
    neglectedness: {
      score: 8,
      rationale:
        'The opened company evidence is one vitrified pig kidney rewarmed on a bench system. No page opened for this row reports a banked human organ transplanted into a person. That is a thin field next to diseases that already have approved drugs.',
      source: 'Until, Rewarming, 12 May 2026; Until roadmap',
      sourceUrl: UNTIL_REWARM,
      confidence: 'low',
      asOf: AS_OF,
    },
    tractability: {
      score: 4,
      rationale:
        'A human-scale pig kidney has been vitrified and rewarmed by the company building the device. The same roadmap still lists a first-in-human organ study and whole-body revival as future steps, not results. No human trial registration was opened in this pass.',
      source: 'Until, Rewarming, 12 May 2026; Until roadmap',
      sourceUrl: UNTIL_ROADMAP,
      confidence: 'low',
      asOf: AS_OF,
    },
    organizations: [
      { name: 'Until', url: UNTIL_ROADMAP, kind: 'company, organ cryopreservation' },
      { name: 'HRSA Organ Donation Statistics', url: HRSA_WAITLIST, kind: 'US waiting-list statistics' },
      { name: 'OPTN/SRTR', url: SRTR_DONATION, kind: 'US transplant data report' },
    ],
    waysToHelp: [
      { mode: 'build', text: 'Until is building rewarming hardware for vitrified organs. Its 12 May 2026 note reports a vitrified pig kidney rewarmed on the Mark 1.', url: UNTIL_REWARM },
      { mode: 'research', text: 'The open measurement is whether a rewarmed organ works in a living recipient for longer than a perfusion test. No human result was opened.', url: UNTIL_ROADMAP },
      { mode: 'fund', text: 'No grant or prize for organ cryopreservation was opened in this pass.' },
    ],
    lastUpdated: AS_OF,
    scores: { welfareBCR: null, xriskITN: null, utilityDelta: null },
    sources: [
      { title: 'HRSA, Organ Donation Statistics, reviewed August 2026', url: HRSA_WAITLIST },
      { title: 'OPTN/SRTR 2024 Annual Data Report: Deceased Organ Donation', url: SRTR_DONATION },
      { title: 'Until, Rewarming, 12 May 2026', url: UNTIL_REWARM },
      { title: 'Until roadmap', url: UNTIL_ROADMAP },
    ],
    asOf: AS_OF,
    sciFiOrigin: "Cold sleep in Robert Heinlein's Methuselah's Children (1941) and The Door into Summer (1956).",
    imagined: {
      work: "The Senator's Daughter",
      author: 'Edward Page Mitchell',
      year: 1879,
      note: 'an early story about freezing a living person to store them',
      ...NOT_BORING,
    },
    relatedProblemSlugs: ['organ-shortage'],
  },
  {
    slug: 'organ-shortage',
    name: 'The organ shortage',
    tier: 'welfare',
    domain: 'health',
    sectors: ['physical-health-and-disease'],
    tagline:
      '109,817 people are on the US transplant waiting list, and HRSA says 12 people die each day waiting. eGenesis reports five pig-kidney recipients.',
    description:
      'The shortage is the gap between people who need a transplant and organs from human donors. Pig kidneys, and organs grown rather than donated, are two ways to add supply that donation alone has not produced. eGenesis said on 3 September 2026 that five patients had received its genetically engineered pig kidney, EGEN-2784, under expanded access since March 2024, and that the FDA has cleared a Phase 1/2/3 trial in 33 waitlisted patients aged 50 to 70, expected to start in the first quarter of 2027. The company says three of the five had kidney function without dialysis for more than eight months, and two later received a human kidney. A global waiting-list total was not on the WHO observatory report that was opened. That report does say 173,727 solid organ transplants were reported for 2024 by 91 countries. The US waiting list is the same 109,817 people counted on organ banking. The rows are not added, and kidney-disease deaths stay on hypertension and diabetes.',
    humansAffected: {
      value: 109_817,
      unit: 'people on the US national transplant waiting list. The same list is on organ banking and is not added to it. Not a global waiting list.',
      countKind: 'population',
      observationYear: 2026,
      source: 'HRSA organdonor.gov, Organ Donation Statistics, date last reviewed August 2026. The page states 109,817 people on the national transplant waiting list.',
      sourceUrl: HRSA_WAITLIST,
      confidence: 'high',
      asOf: AS_OF,
    },
    severityNote:
      'No death rate is scored. HRSA says 12 people die each day waiting and does not publish an annual death total on that page. Those deaths are not copied onto the kidney-disease, hypertension, or longevity rows. The 173,727 transplants are procedures reported for 2024, not people waiting, and are not a death rate.',
    scale: {
      value: 173_727,
      unit: 'solid organ transplants reported worldwide for 2024, by 91 countries. Activity, not a waiting list.',
      trend: 'improving',
      source:
        'WHO Global Observatory on Donation and Transplantation, 2024 report (Transplantation, March 2026): 173,727 solid organ transplants, a 2 percent increase from 2023 among countries reporting both years. The report says the organ shortage continues.',
      sourceUrl: GODT,
      confidence: 'high',
      asOf: AS_OF,
    },
    transformation: {
      before:
        '109,817 people are waiting in the United States, and 12 die each day while waiting. Human donation supplied 173,727 transplants worldwide in 2024, on the countries that reported.',
      after:
        'A patient who needs a kidney can receive one without waiting for a human donor to die, and a later human transplant is still possible if the graft fails.',
      horizon: 'not estimated',
      confidence: 'low',
      asOf: AS_OF,
    },
    neglectedness: {
      score: 5,
      rationale:
        'A company has put a genetically engineered pig kidney into five people and has FDA clearance for a 33-patient trial that it expects to start in 2027. That is past an empty field. It is not a crowded class of approved products. Organs grown from a patient\'s own cells had no clinical count on the pages opened here.',
      source: 'eGenesis clinical update, 3 September 2026',
      sourceUrl: EGENESIS,
      confidence: 'low',
      asOf: AS_OF,
    },
    tractability: {
      score: 6,
      rationale:
        'eGenesis reports dialysis-free kidney function for more than eight months in three of five expanded-access recipients, and a later human kidney in two of them. The pivotal-sized trial is cleared and not started. This score follows that pig-kidney evidence. It does not score grown organs, which had no clinical count on the pages opened here.',
      source: 'eGenesis clinical update, 3 September 2026',
      sourceUrl: EGENESIS,
      confidence: 'med',
      asOf: AS_OF,
    },
    organizations: [
      { name: 'eGenesis', url: EGENESIS, kind: 'company, engineered pig kidney' },
      { name: 'HRSA Organ Donation Statistics', url: HRSA_WAITLIST, kind: 'US waiting-list statistics' },
      { name: 'WHO Global Observatory on Donation and Transplantation', url: GODT, kind: 'global transplant activity' },
    ],
    people: [
      { name: 'Mike Curtis', role: 'president and CEO, eGenesis, on the 3 September 2026 update', url: EGENESIS },
      { name: 'Leonardo V. Riella', role: 'medical director for kidney transplantation, Massachusetts General Hospital', url: EGENESIS },
    ],
    waysToHelp: [
      { mode: 'build', text: 'eGenesis is developing EGEN-2784, a genetically engineered pig kidney. Five expanded-access recipients are the clinical record it published on 3 September 2026.', url: EGENESIS },
      { mode: 'research', text: 'The cleared study is RESTORE, 33 patients aged 50 to 70 who are already waitlisted. The company expects it to start in the first quarter of 2027.', url: EGENESIS },
      { mode: 'fund', text: 'No grant or prize for xenotransplantation or grown organs was opened in this pass.' },
    ],
    lastUpdated: AS_OF,
    scores: { welfareBCR: null, xriskITN: null, utilityDelta: null },
    sources: [
      { title: 'HRSA, Organ Donation Statistics, reviewed August 2026', url: HRSA_WAITLIST },
      { title: 'eGenesis clinical update, 3 September 2026', url: EGENESIS },
      { title: 'WHO GODT 2024 report, Transplantation, March 2026', url: GODT },
    ],
    asOf: AS_OF,
    sciFiOrigin: "A body taken apart for transplant in Larry Niven's The Jigsaw Man (1967).",
    imagined: {
      work: 'The Velvet Glove',
      author: 'Harry Harrison',
      year: 1956,
      note: 'small clusters of cells that regrow human limbs',
      ...NOT_BORING,
    },
    relatedProblemSlugs: ['organ-banking'],
  },
  {
    slug: 'brain-computer-interface',
    name: 'Brain-computer interfaces',
    tier: 'welfare',
    domain: 'health',
    sectors: ['physical-health-and-disease'],
    tagline:
      'About 30,000 people in the United States are living with ALS. Seven people in a UK study have a Neuralink implant.',
    description:
      'A brain-computer interface records intent from the cortex and turns it into a click, a message, or a device command for someone who cannot move. It does not reverse the stroke, the spinal injury, or the motor neuron disease. UCLH said on 29 January 2026 that seven people had received a Neuralink implant at the National Hospital for Neurology and Neurosurgery between October and December 2025, in the GB-PRIME early feasibility study. One participant, a medical student paralyzed after a diving accident, described using a computer and a phone by thought. The page does not report a measured return of walking or speech. ClinicalTrials.gov lists Synchron\'s Australian Stentrode study NCT07533903 as active, not recruiting, with an estimated enrollment of 10. A 19 November 2026 Citeline report says Synchron paused enrollment in its INTENT trial of a second-generation Stentrode because of a lead performance issue. That report, as opened, does not say the pause was unrelated to safety, so this row does not say it. The count on this page is US ALS only. The WHO spinal cord injury fact sheet points at a 2021 global estimate and a disability total. Those figures are not shown. A stroke-paralysis prevalence was not opened from a source other than the Global Burden of Disease, so it is not shown. Stroke deaths stay on hypertension and longevity.',
    humansAffected: {
      value: 30_000,
      unit: 'people estimated to be living with ALS in the United States. CDC says about 30,000. Not a global count, and not spinal cord injury or stroke.',
      countKind: 'prevalence',
      observationYear: 2024,
      source: 'CDC National ALS Registry fact sheet, ALS: A Closer Look, last reviewed June 2024. The sheet says it is estimated that about 30,000 people are living with ALS.',
      sourceUrl: CDC_ALS,
      confidence: 'med',
      asOf: AS_OF,
    },
    severityNote:
      'No death rate is scored. Paralysis is a disability, and the CDC sheet does not pair a death count with the about 30,000 prevalence. It says a person can expect to live about 2 to 5 years after diagnosis, and that about 5,000 to 6,000 people are diagnosed each year. Those are not used as a rate. The WHO spinal cord injury fact sheet is a pointer to a 2021 global estimate. That estimate is not shown. Stroke deaths are not assigned here.',
    transformation: {
      before:
        'Someone with severe paralysis or ALS cannot operate a computer or a phone. The verified implants are in a handful of trial participants, not in routine care.',
      after:
        'A person who cannot move their hands can still operate the digital tools they use to communicate, from an implant whose risks and limits are known from more than a feasibility study.',
      horizon: 'not estimated',
      confidence: 'low',
      asOf: AS_OF,
    },
    neglectedness: {
      score: 5,
      rationale:
        'Two clinical programs are on the pages opened here: seven Neuralink participants in a UK early feasibility study, and a Synchron study listed as active and not recruiting. The work is public. The number of people implanted is still a handful, against about 30,000 people living with ALS in the United States alone.',
      source: 'UCLH, 29 January 2026; ClinicalTrials.gov NCT07533903',
      sourceUrl: UCLH,
      confidence: 'low',
      asOf: AS_OF,
    },
    tractability: {
      score: 5,
      rationale:
        'One GB-PRIME participant described controlling a computer and a phone by thought. UCLH calls the study an early look at safety and functionality. It does not report restored walking or speech. Synchron\'s listed Australian study is active and not recruiting. A news report says enrollment in a second-generation trial was paused for a lead performance issue.',
      source: 'UCLH, 29 January 2026; ClinicalTrials.gov NCT07533903; Citeline, 19 November 2026',
      sourceUrl: UCLH,
      confidence: 'low',
      asOf: AS_OF,
    },
    organizations: [
      { name: 'Neuralink, via the UCLH GB-PRIME report', url: UCLH, kind: 'company, intracortical implant' },
      { name: 'UCLH National Hospital for Neurology and Neurosurgery', url: UCLH, kind: 'study site' },
      { name: 'Synchron', url: SYNCHRON_TRIAL, kind: 'company, endovascular Stentrode' },
    ],
    people: [
      { name: 'Harith Akram', role: 'chief investigator, GB-PRIME, UCLH neurosurgeon', url: UCLH },
      { name: 'William Muirhead', role: 'principal investigator at UCLH, consultant neurosurgeon', url: UCLH },
    ],
    waysToHelp: [
      { mode: 'build', text: 'The opened clinical work is an implant that turns intended movement into control of a computer, phone, or other digital device.', url: UCLH },
      { mode: 'research', text: 'GB-PRIME is an early feasibility study of safety and functionality in seven people. A result for walking or speech was not on the page.', url: UCLH },
      { mode: 'fund', text: 'No grant or prize for brain-computer interfaces was opened in this pass.' },
    ],
    lastUpdated: AS_OF,
    scores: { welfareBCR: null, xriskITN: null, utilityDelta: null },
    sources: [
      { title: 'CDC National ALS Registry fact sheet, last reviewed June 2024', url: CDC_ALS },
      { title: 'UCLH, seven GB-PRIME patients, 29 January 2026', url: UCLH },
      { title: 'ClinicalTrials.gov NCT07533903, Synchron FOCUS-AUS', url: SYNCHRON_TRIAL },
      { title: 'Citeline, Synchron pauses second-generation enrollment, 19 November 2026', url: SYNCHRON_PAUSE },
      { title: 'WHO spinal cord injury fact sheet (pointer only, figures not displayed)', url: WHO_SCI },
    ],
    asOf: AS_OF,
    sciFiOrigin: "A neural lace in Iain M. Banks's Surface Detail (2010).",
    imagined: {
      work: "Masson's Secret",
      author: 'Raymond Z. Gallun',
      year: 1939,
      note: 'a brain implant that sends sight and sound and lets the body be controlled',
      ...NOT_BORING,
    },
  },
  {
    slug: 'ai-clinical-care',
    name: 'AI clinical care',
    tier: 'welfare',
    domain: 'health',
    sectors: ['physical-health-and-disease'],
    tagline:
      'WHO: about 4.6 billion people were not fully covered by essential health services in 2023.',
    description:
      'The claim is an autonomous system that can handle routine diagnosis and care for a person who cannot reach a clinician. What has been opened is narrower. Utah\'s Office of Artificial Intelligence Policy approved a pilot with Doctronic that can process 30, 60, or 90 day renewals of medicines a licensed provider already prescribed. The Office says the pilot is still in phase 1, so a physician must authorize each renewal. The AI does not issue a new prescription, change a dose, or handle a controlled substance. No serious safety incident had been reported to the Office when the status page was opened. An NEJM perspective published on 18 April 2026 describes the same Utah program and the clinical and legal questions it raises. The perspective page that was opened does not name Doctronic. The 4.6 billion figure is people not fully covered by essential services. It is not a count of people this pilot has treated, and it is not a death toll. Deaths already assigned to other problems on this index stay there.',
    humansAffected: {
      value: 4_600_000_000,
      unit: 'people not fully covered by essential health services in 2023. WHO says about 4.6 billion. Not a count of patients in the Utah pilot.',
      countKind: 'population',
      observationYear: 2023,
      publicationYear: 2025,
      source: 'WHO universal health coverage fact sheet, 5 December 2025: in 2023, about 4.6 billion people were not fully covered by essential health services.',
      sourceUrl: WHO_UHC,
      confidence: 'high',
      asOf: AS_OF,
    },
    severityNote:
      'No death rate is scored. The 4.6 billion figure is incomplete service coverage, not deaths, and not the number of people an autonomous system has diagnosed. Disease deaths already on this index are not assigned to this row. Utah\'s pilot, in the phase described on the Office page, renews existing prescriptions after a physician authorizes them.',
    transformation: {
      before:
        'About 4.6 billion people were not fully covered by essential health services in 2023. The opened autonomous system renews an existing prescription and, in phase 1, still waits for a physician.',
      after:
        'A routine renewal, and later a routine diagnosis, can be done to a stated standard without a clinic visit, with a public record of disagreements and harms.',
      horizon: 'not estimated',
      confidence: 'low',
      asOf: AS_OF,
    },
    neglectedness: {
      score: 6,
      rationale:
        'Software that drafts a clinical note is common. An autonomous clinical act, on the pages opened here, is one state pilot, and phase 1 still requires a physician to authorize every renewal. That is early, not an empty topic and not a solved service.',
      source: 'Utah Office of Artificial Intelligence Policy, Doctronic regulatory mitigation agreement',
      sourceUrl: UTAH_DOCTRONIC,
      confidence: 'low',
      asOf: AS_OF,
    },
    tractability: {
      score: 4,
      rationale:
        'The system can propose a renewal of a medicine a clinician already prescribed, inside rules the state wrote down. Utah says it does not yet have robust evidence on benefits, and the opened NEJM piece is a legal and clinical commentary, not an efficacy trial. Diagnosis was not part of the pilot as described.',
      source: 'Utah Office of Artificial Intelligence Policy; NEJM perspective, 18 April 2026',
      sourceUrl: UTAH_DOCTRONIC,
      confidence: 'low',
      asOf: AS_OF,
    },
    organizations: [
      { name: 'Doctronic', url: UTAH_DOCTRONIC, kind: 'company, Utah prescription-renewal pilot' },
      { name: 'Utah Office of Artificial Intelligence Policy', url: UTAH_DOCTRONIC, kind: 'state regulator' },
      { name: 'WHO, universal health coverage', url: WHO_UHC, kind: 'coverage statistics' },
    ],
    waysToHelp: [
      { mode: 'build', text: 'The opened product renews an existing prescription inside a state agreement. Phase 1 still requires a physician to authorize the renewal.', url: UTAH_DOCTRONIC },
      { mode: 'policy', text: 'Utah publishes the guardrails: no new prescriptions, no dose changes, no controlled substances, and physician oversight in the current phase.', url: UTAH_DOCTRONIC },
      { mode: 'research', text: 'The Office says outcome measures for benefit are scheduled for later phases. An efficacy result was not on the page.', url: UTAH_DOCTRONIC },
      { mode: 'fund', text: 'No grant or prize for autonomous clinical care was opened in this pass.' },
    ],
    lastUpdated: AS_OF,
    scores: { welfareBCR: null, xriskITN: null, utilityDelta: null },
    sources: [
      { title: 'WHO universal health coverage fact sheet, 5 December 2025', url: WHO_UHC },
      { title: 'Utah Office of Artificial Intelligence Policy, Doctronic agreement', url: UTAH_DOCTRONIC },
      { title: 'NEJM perspective on Utah\'s prescription-renewal pilot, 18 April 2026', url: NEJM_UTAH },
    ],
    asOf: AS_OF,
    sciFiOrigin: "A robot doctor in Heller's Flamingo (1930).",
    imagined: {
      work: 'Flamingo: A Drama of A.D. 1950',
      author: 'Clarence Edward Heller',
      year: 1930,
      note: 'a mechanical physician',
      ...NOT_BORING,
    },
  },
  {
    slug: 'artificial-womb',
    name: 'Artificial womb',
    tier: 'welfare',
    domain: 'health',
    sectors: ['physical-health-and-disease'],
    tagline:
      'WHO: about 900,000 children died of preterm-birth complications in 2019. Those deaths stay on newborn survival.',
    description:
      'An artificial womb is a fluid-filled system meant to continue development for a baby born so early that air breathing damages the lungs. Vitara Biomedical describes EXTEND, intended for newborns delivered as early as 22 weeks, for up to 28 days. The company page does not report a human birth, and a first-in-human registration was not opened in this pass, so none is claimed. WHO\'s preterm fact sheet, 10 May 2023, says an estimated 13.4 million babies were born preterm in 2020, before 37 completed weeks, and about 900,000 children died of preterm complications in 2019. Extremely preterm means less than 28 weeks. The fact sheet does not give a separate count for that group. The 900,000 deaths sit inside the broader newborn-survival problem and are not added to the burden roll-up. WHO\'s listed care for preterm babies is antenatal steroids, warmth, feeding, breathing support, and keeping mother and baby together. That is a different intervention from a fluid-filled womb, and it is already the subject of newborn survival.',
    humansAffected: {
      value: 900_000,
      unit: 'deaths of children from preterm-birth complications in 2019. An annual flow, not a census of extremely preterm babies. Counted inside newborn survival and not added again in the burden roll-up.',
      countKind: 'annual-deaths',
      observationYear: 2019,
      publicationYear: 2023,
      source: 'WHO preterm birth fact sheet, 10 May 2023: preterm birth complications caused approximately 900,000 deaths in 2019.',
      sourceUrl: WHO_PRETERM,
      confidence: 'high',
      asOf: AS_OF,
    },
    severityNote:
      'No death rate is scored. The fact sheet states about 900,000 deaths in 2019 and 13.4 million preterm births in 2020, which are different years, and the births are all preterm babies, not a person-year stock of extremely preterm infants. Extremely preterm is defined as less than 28 weeks and is not given its own count. These deaths are not mapped in the burden file. Newborn survival keeps the neonatal toll. See that problem.',
    transformation: {
      before:
        'A baby born before the lungs can breathe air has the care a neonatal unit can give. WHO does not publish a separate death count for births before 28 weeks on the fact sheet opened here.',
      after:
        'A baby born around 22 weeks can stay in fluid long enough for the lungs to develop, with a published human result and a known rate of harm. That result is not on the pages opened here.',
      horizon: 'not estimated',
      confidence: 'low',
      asOf: AS_OF,
    },
    neglectedness: {
      score: 7,
      rationale:
        'One company describes a device for extremely premature newborns. No trial registry entry and no human outcome were opened in this pass. Preterm care as a whole is not this neglected: newborn survival is already on the index for oxygen, warmth, and sepsis care.',
      source: 'Vitara Biomedical; WHO preterm birth fact sheet, 10 May 2023',
      sourceUrl: VITARA,
      confidence: 'low',
      asOf: AS_OF,
    },
    tractability: {
      score: 3,
      rationale:
        'The opened company page describes a fluid-filled system and names a 28 day bridge. It does not report a baby kept alive in it. WHO\'s fact sheet treats survival at the edge of prematurity as a problem of basic care that already exists, which is real and is not evidence that an artificial womb works.',
      source: 'Vitara Biomedical; WHO preterm birth fact sheet, 10 May 2023',
      sourceUrl: WHO_PRETERM,
      confidence: 'low',
      asOf: AS_OF,
    },
    organizations: [
      { name: 'Vitara Biomedical', url: VITARA, kind: 'company, EXTEND neonatal support' },
      { name: 'WHO preterm birth fact sheet', url: WHO_PRETERM, kind: 'global preterm statistics' },
    ],
    people: [
      { name: 'Alan Flake', role: 'co-inventor and medical advisor, named on the Vitara page', url: VITARA },
    ],
    waysToHelp: [
      { mode: 'build', text: 'Vitara describes a fluid-filled system for newborns delivered as early as 22 weeks. A human result was not on the page.', url: VITARA },
      { mode: 'research', text: 'The missing public fact is a registered first-in-human study and an extremely preterm death count separated from all preterm deaths.', url: WHO_PRETERM },
      { mode: 'fund', text: 'No grant or prize for an artificial womb was opened in this pass.' },
    ],
    lastUpdated: AS_OF,
    scores: { welfareBCR: null, xriskITN: null, utilityDelta: null },
    sources: [
      { title: 'WHO preterm birth fact sheet, 10 May 2023', url: WHO_PRETERM },
      { title: 'Vitara Biomedical', url: VITARA },
      { title: 'Newborn survival on this index', url: 'https://optimism.fun/p/newborn-survival' },
    ],
    asOf: AS_OF,
    sciFiOrigin:
      "Gestation outside a body in Aldous Huxley's Brave New World (1932) and Lois McMaster Bujold's uterine replicator (1986).",
    imagined: {
      work: 'Brave New World',
      author: 'Aldous Huxley',
      year: 1932,
      note: 'embryos grown to term in a room outside the body',
      ...NOT_BORING,
    },
    relatedProblemSlugs: ['newborn-survival'],
  },
]
