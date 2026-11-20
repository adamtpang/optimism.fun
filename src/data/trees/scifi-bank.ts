// Why these five problems are not solved yet.
// Every claim uses a page opened on 2026-11-20. Unknown stays unknown.
// No em dashes.

import type { ConstraintTree } from '../constraints'

const AS_OF = '2026-11-20'

const HRSA = {
  label: 'HRSA organ donation statistics, reviewed August 2026',
  url: 'https://www.organdonor.gov/learn/organ-donation-statistics',
}
const SRTR = {
  label: 'OPTN/SRTR 2024 Annual Data Report, deceased organ donation',
  url: 'https://srtr.hrsa.gov/adr/2024/DOD/',
}
const UNTIL = {
  label: 'Until, Rewarming, 12 May 2026',
  url: 'https://www.untillabs.com/blog/rewarming',
}
const EGENESIS = {
  label: 'eGenesis clinical update, 3 September 2026',
  url: 'https://egenesisbio.com/news-media/press-releases/egenesis-announces-clinical-update-in-ongoing-expanded-access-study-of-egen-2784-in-patients-with-kidney-failure',
}
const UCLH = {
  label: 'UCLH, seven GB-PRIME patients, 29 January 2026',
  url: 'https://www.uclh.nhs.uk/news/seven-gb-prime-patients-now-participating-neuralink-trial',
}
const SYNCHRON = {
  label: 'ClinicalTrials.gov NCT07533903',
  url: 'https://clinicaltrials.gov/study/NCT07533903',
}
const CDC = {
  label: 'CDC National ALS Registry fact sheet, last reviewed June 2024',
  url: 'https://wwwn.cdc.gov/ALS/Download/Incidence_Prevalence%20Fact%20Sheet.pdf',
}
const UTAH = {
  label: 'Utah Office of Artificial Intelligence Policy, Doctronic agreement',
  url: 'https://commerce.utah.gov/ai/regulatory-relief-4/authorized-pilots/doctronic/',
}
const WHO_UHC = {
  label: 'WHO universal health coverage fact sheet, 5 December 2025',
  url: 'https://www.who.int/news-room/fact-sheets/detail/universal-health-coverage-(uhc)',
}
const VITARA = { label: 'Vitara Biomedical', url: 'https://www.vitara.com/' }
const WHO_PRETERM = {
  label: 'WHO preterm birth fact sheet, 10 May 2023',
  url: 'https://www.who.int/news-room/fact-sheets/detail/preterm-birth',
}

export const sciFiBankTrees: ConstraintTree[] = [
  {
    problemSlug: 'organ-banking',
    outcome:
      'A recovered human organ can be held and then transplanted, and the share of recovered organs that are not transplanted falls for a reason the registry attributes to preservation time.',
    whyUnsolved:
      'Organs are still used or discarded inside the cold-storage window. A company has rewarmed a vitrified pig kidney. No page opened here reports that a banked human organ was transplanted.',
    bindingId: 'no-human-bank',
    updated: AS_OF,
    root: [
      {
        id: 'no-human-bank',
        claim: 'No banked human organ has been transplanted, on the pages opened for this row.',
        kind: 'science',
        whyUnsolved:
          'Until reports rewarming a vitrified pig kidney on a bench system. Its roadmap still lists a first-in-human organ trial as future work. OPTN/SRTR counted 11,244 recovered organs not transplanted in 2024 and does not say the cause was the clock.',
        falsifier:
          'A registry report of a human transplant using an organ that was vitrified and rewarmed, with survival past the hospital stay.',
        tested:
          'Looked at the Until rewarming note and roadmap, and at the SRTR nonuse chapter. The human transplant was not there. The pig-kidney result is the company\'s own note.',
        suppliers: ['Until'],
        supplyState: 'thin',
        additionality: {
          level: 'high',
          why: 'One named company has published a pig-kidney rewarm. A second independent human-organ result was not opened.',
        },
        entryPoints: [
          { who: 'talent', action: 'Reproduce organ-scale rewarming in a lab that is not Until, and publish function after transplant into an animal for longer than a perfusion test.' },
          { who: 'operator', action: 'If you run an organ procurement organization, publish how many recovered organs were not transplanted because of time, separate from organ quality. SRTR does not make that split.' },
        ],
        sources: [UNTIL, SRTR, HRSA],
      },
    ],
  },
  {
    problemSlug: 'organ-shortage',
    outcome:
      'A waitlisted patient can receive a kidney that did not come from a human donor, in a trial large enough to measure survival against dialysis.',
    whyUnsolved:
      'Human donation does not cover the US waiting list. HRSA counts 109,817 people waiting and 12 deaths a day. The pig-kidney evidence is five expanded-access patients. The cleared 33-patient trial has not started.',
    bindingId: 'trial-not-started',
    updated: AS_OF,
    root: [
      {
        id: 'trial-not-started',
        claim: 'The cleared pig-kidney trial has not started, and grown organs have no clinical count on the pages opened here.',
        kind: 'regulatory',
        whyUnsolved:
          'eGenesis says the FDA cleared RESTORE, 33 patients aged 50 to 70 who are already waitlisted, and expects to start in the first quarter of 2027. Five people have received the kidney under expanded access since March 2024. Three had dialysis-free function for more than eight months. Two later received a human kidney.',
        falsifier:
          'RESTORE enrolls and publishes death and dialysis rates against a stated comparator. Or a grown human organ is transplanted and the result is published.',
        tested:
          'The 3 September 2026 company update is the clinical record opened here. It is a company statement about five patients, not a completed trial. A grown-organ clinical count was not found on that page.',
        suppliers: ['eGenesis', 'Mass General Brigham (named as the clinical partner)'],
        supplyState: 'thin',
        additionality: {
          level: 'medium',
          why: 'One company has human recipients. Other groups may be in the field. They were not opened in this pass, so they are not listed.',
        },
        entryPoints: [
          { who: 'talent', action: 'Read the expanded-access results as a trial record, including the two patients who later received a human kidney, before treating five cases as a product.' },
          { who: 'capital', action: 'Fund the measurement: survival and dialysis independence in the cleared 33-patient study, not a larger claim than the protocol.' },
        ],
        sources: [EGENESIS, HRSA],
      },
    ],
  },
  {
    problemSlug: 'brain-computer-interface',
    outcome:
      'A person who cannot move their hands can operate a computer or a phone with an implanted interface, with a published rate of serious harm beyond a feasibility study.',
    whyUnsolved:
      'The opened studies are early and small. Seven people have a Neuralink implant in the UK study. Synchron\'s Australian study is listed as active and not recruiting, with an estimated enrollment of 10. About 30,000 people in the United States are living with ALS, which is only one of the conditions this problem names.',
    bindingId: 'feasibility-only',
    updated: AS_OF,
    root: [
      {
        id: 'feasibility-only',
        claim: 'The opened evidence is early feasibility, not a measured restoration of movement or speech.',
        kind: 'science',
        whyUnsolved:
          'UCLH describes one participant using a computer and a phone by thought. The page calls GB-PRIME an early feasibility study of safety and functionality. It does not report walking or speech. A news report says Synchron paused enrollment in a second-generation study because of a lead performance issue. The ClinicalTrials.gov page for NCT07533903 does not say that, and it does not say the pause was unrelated to safety.',
        falsifier:
          'A study reports, for a stated number of people, the share who can use a computer and the share with a device-related serious injury, against a follow-up of at least a year.',
        tested:
          'Opened the UCLH note, NCT07533903, and the Citeline report. The outcome study described above was not there. CDC\'s ALS sheet is the prevalence used on the page. Global spinal cord injury and stroke paralysis were not given a displayed count.',
        suppliers: ['Neuralink', 'Synchron', 'UCLH'],
        supplyState: 'thin',
        additionality: {
          level: 'medium',
          why: 'Two companies have public clinical listings. A third program was not opened, so it is not counted.',
        },
        entryPoints: [
          { who: 'talent', action: 'Publish a decoder result with the harm rate next to it. A demo of one person using a phone is not that result.' },
          { who: 'operator', action: 'If you run a trial, separate a performance pause from a safety pause in the public record. The pages opened here do not make that split for Synchron.' },
        ],
        sources: [UCLH, SYNCHRON, CDC],
      },
    ],
  },
  {
    problemSlug: 'ai-clinical-care',
    outcome:
      'A routine clinical decision is made by a system, to a published standard, for people who are not fully covered by essential services today.',
    whyUnsolved:
      'WHO says about 4.6 billion people were not fully covered by essential health services in 2023. The autonomous system that was opened renews an existing prescription in one US state, and a physician still authorizes it.',
    bindingId: 'physician-still-required',
    updated: AS_OF,
    root: [
      {
        id: 'physician-still-required',
        claim: 'The opened pilot does not diagnose, and phase 1 does not let the model authorize a renewal alone.',
        kind: 'regulatory',
        whyUnsolved:
          'Utah says Doctronic may process 30, 60, or 90 day renewals of medicines a licensed provider already prescribed. It may not start a medicine, change a dose, or handle a controlled substance. In phase 1 a physician authorizes each renewal. The Office says it does not yet have robust evidence on benefits. No serious safety incident had been reported to the Office.',
        falsifier:
          'A later phase authorizes renewals without a physician, or a diagnostic decision, and publishes disagreements and harms for a stated number of people.',
        tested:
          'Opened the Utah agreement page and the NEJM perspective of 18 April 2026. The perspective describes the pilot and does not, on the page that was opened, name the company or give an efficacy result.',
        suppliers: ['Doctronic', 'Utah Office of Artificial Intelligence Policy'],
        supplyState: 'thin',
        additionality: {
          level: 'high',
          why: 'One state pilot was opened. A second autonomous diagnostic service was not, so it is not listed.',
        },
        entryPoints: [
          { who: 'talent', action: 'Audit a sample of renewals the model and the physician disagreed on. Utah says that disagreement exists and that benefit measures come later.' },
          { who: 'operator', action: 'If you run a clinic, do not treat a renewal tool as a diagnosis tool. The agreement forbids new prescriptions and dose changes.' },
        ],
        sources: [UTAH, WHO_UHC],
      },
    ],
  },
  {
    problemSlug: 'artificial-womb',
    outcome:
      'A baby born before about 24 weeks can be kept in fluid until the lungs can take air, with a published human survival rate. The deaths already counted under newborn survival are not counted again.',
    whyUnsolved:
      'Vitara describes the device and does not report a baby kept alive in it. WHO\'s fact sheet does not separate extremely preterm deaths from all preterm deaths, and the care it recommends is warmth, feeding, and breathing support.',
    bindingId: 'no-human-use',
    updated: AS_OF,
    root: [
      {
        id: 'no-human-use',
        claim: 'No human use of an artificial womb was on the pages opened for this row.',
        kind: 'science',
        whyUnsolved:
          'Vitara says EXTEND is a fluid-filled system for newborns delivered as early as 22 weeks, for up to 28 days. A trial registration was not opened. WHO says about 900,000 children died of preterm complications in 2019 and 13.4 million babies were born preterm in 2020. Extremely preterm means under 28 weeks. The fact sheet does not count that group on its own. Those deaths stay on the newborn-survival problem.',
        falsifier:
          'A registered first-in-human study reports how many babies were treated and how many survived to a stated age, against babies born at the same gestation who were not treated.',
        tested:
          'Opened vitara.com and the WHO preterm fact sheet of 10 May 2023. The human study was not there. The company page\'s other figures, including a dollar total, were not copied into the ranking.',
        suppliers: ['Vitara Biomedical'],
        supplyState: 'thin',
        additionality: {
          level: 'high',
          why: 'One company page was opened. A second clinical program was not found in this pass.',
        },
        entryPoints: [
          { who: 'talent', action: 'Separate extremely preterm births and deaths from all preterm births. WHO\'s fact sheet defines the group and does not count it.' },
          { who: 'capital', action: 'Do not fund this as a substitute for oxygen and warmth in newborn units. Those are the newborn-survival problem, and they already have evidence.' },
        ],
        sources: [VITARA, WHO_PRETERM],
      },
    ],
  },
]
