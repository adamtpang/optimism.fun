// Constraint tree for optimism.fun: why do newborns still die of preventable causes?
// Researched 2026-11-11. Every number below comes from a page opened this session.
// Inference is labeled as inference. Unknown stays unknown.

import type { ConstraintTree } from '../constraints'

const WHO_NEWBORN = {
  label: 'WHO newborn mortality fact sheet (opened 2026-11-11)',
  url: 'https://www.who.int/news-room/fact-sheets/detail/newborn-mortality',
}
const OXYGEN = {
  label: 'PMNCH: Lancet Global Health Oxygen Commission statement on newborns, 16 Aug 2025',
  url: 'https://pmnch.who.int/news-and-events/news/item/16-08-2025-the-lancet-global-health-oxygen-commission-calls-for-universal-access-to-pulse-oximetry-and-medical-oxygen-in-all-health-facilities-delivering-and-caring-for-babies',
}
const NEOTEST = {
  label: 'Center for Global Development: NeoTest, accelerating neonatal sepsis diagnostics',
  url: 'https://www.cgdev.org/publication/neotest-accelerating-neonatal-sepsis-diagnostics',
}
const NEST360 = { label: 'NEST360 (opened 2026-11-11)', url: 'https://www.nest360.org' }

export const newbornSurvivalTree: ConstraintTree = {
  problemSlug: 'newborn-survival',
  outcome:
    'Every country at or below 12 newborn deaths per 1,000 live births, the SDG target for 2030. About 2.3 million newborns die each year, and WHO says 64 countries will miss the target without urgent action.',
  whyUnsolved:
    'Most births now happen in a health facility, but the facility often cannot care for a small or sick baby. The leading causes are premature birth, birth complications and infection. The fixes are known devices and skills: oxygen, a pulse oximeter, breathing support, trained staff. They are not reliably in the ward where the baby is.',
  bindingId: 'facility-care',
  updated: '2026-11-11',
  root: [
    {
      id: 'facility-care',
      claim: 'Hospitals where babies are born cannot reliably care for small and sick newborns.',
      kind: 'delivery',
      whyUnsolved:
        'An estimated 78 percent of newborn deaths are from conditions where timely oxygen can help, and 5.4 million newborns have acute hypoxemia each year. In low- and middle-income countries, pulse oximetry is used in 6 percent of neonatal wards, against 91 percent of operating theatres. Nearly 1 in 6 newborns with an acute need for oxygen do not get it. Calling this the binding constraint is our inference.',
      falsifier:
        'Most newborn deaths happen to babies who never reach a facility. Then getting to care, not care inside the facility, would be the limit.',
      tested:
        'Looked for it. WHO puts facility births at almost 80 percent globally, yet about 1 million newborns die in their first 24 hours and 75 percent of newborn deaths are in the first week. That fits a gap in care inside facilities. Weak point: the share of deaths that occur inside facilities was not found, and facility birth rates are lower in the highest-mortality regions.',
      suppliers: ['NEST360', 'Global Oxygen Alliance', 'UNICEF', 'WHO'],
      supplyState: 'thin',
      additionality: {
        level: 'high',
        why: 'Inference: 6 percent pulse oximetry use in neonatal wards means most wards are untouched. NEST360 lists work in five countries.',
      },
      entryPoints: [
        { who: 'capital', action: 'Fund pulse oximeters, oxygen and staff training for the newborn unit of one district hospital, with maintenance included.' },
        { who: 'operator', action: 'If you run a hospital, record oxygen saturation for every sick newborn and report how many needed oxygen and got it.' },
        { who: 'talent', action: 'Train as or support biomedical technicians who keep oxygen and breathing devices working.' },
      ],
      sources: [OXYGEN, WHO_NEWBORN, NEST360],
      children: [
        {
          id: 'oxygen-policy',
          claim: 'Oxygen and pulse oximetry are missing from the lists that drive purchasing.',
          kind: 'policy',
          whyUnsolved:
            'The Oxygen Commission asks that pulse oximetry and oxygen be added to the UN list of 13 priority maternal and newborn commodities, to national essential device lists and to universal health coverage schemes. It also says newborn survival targets leave them out.',
          falsifier: 'Countries that list and fund oxygen for newborns show no better coverage than those that do not.',
          suppliers: ['Lancet Global Health Commission on Medical Oxygen Security'],
          supplyState: 'unresearched',
          additionality: { level: 'unknown', why: 'Not researched which countries have already changed their lists.' },
          entryPoints: [
            { who: 'talent', action: 'Check whether one country lists pulse oximetry for newborn care in its essential device list.' },
          ],
          sources: [OXYGEN],
        },
      ],
    },
    {
      id: 'sepsis-diagnostic',
      claim: 'No fast test for newborn sepsis exists, because nobody can profit from making one.',
      kind: 'payment',
      whyUnsolved:
        'Newborn sepsis causes 400,000 to 700,000 deaths a year. Blood cultures take over 48 hours, so clinicians treat on signs like fever and poor feeding. The Center for Global Development says a rapid test is feasible, but prices in poor countries do not cover the research cost and copycats erode the first maker.',
      falsifier: 'A rapid sepsis test reaches the market without outside funding. Or a test is used widely and deaths do not fall.',
      tested:
        'Not tested. The lives-saved figure (100,000 to 280,000) and the 78 to 1 benefit-cost ratio are modeled by the proposal authors, not observed. No rapid test in routine use was found.',
      suppliers: ['CARB-X (early-stage research funding)', 'Center for Global Development (proposal)'],
      supplyState: 'thin',
      additionality: {
        level: 'high',
        why: 'The proposal asks for US$60 million in total, including a US$30 million advance market commitment. No funder for it was found.',
      },
      entryPoints: [
        { who: 'capital', action: 'Commit to part of the US$30 million advance market commitment described in the NeoTest proposal.' },
        { who: 'talent', action: 'Build a rapid newborn sepsis test against the WHO target product profile.' },
      ],
      sources: [NEOTEST],
    },
    {
      id: 'birth-care',
      claim: 'Care around the hour of birth is not good enough to prevent early deaths.',
      kind: 'delivery',
      whyUnsolved:
        'Premature birth and birth complications are leading causes of death. Sub-Saharan Africa has 27 newborn deaths per 1,000 live births and central and southern Asia 21. Country rates range from 0.7 to 39.4. WHO reports that women with midwife-led continuity of care are 16 percent less likely to lose their baby and 24 percent less likely to give birth preterm.',
      falsifier: 'Regions that raise skilled care at birth see no fall in first-day deaths.',
      suppliers: [],
      supplyState: 'unresearched',
      additionality: { level: 'unknown', why: 'Not researched who trains and deploys midwives at scale in the highest-mortality regions.' },
      entryPoints: [
        { who: 'talent', action: 'Map midwife numbers against births for one high-mortality country and publish the gap.' },
        { who: 'capital', action: 'Unknown until suppliers are researched. Do not fund on this node yet.' },
      ],
      sources: [WHO_NEWBORN],
    },
  ],
}
