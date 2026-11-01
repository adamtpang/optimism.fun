/**
 * Verbatim credits from public/media/CREDITS.md.
 * The filename key is omitted; the remaining sentence is the file's own text.
 */
export type MediaCredit = {
  id: string
  text: string
  href: string
}

export const MEDIA_CREDITS: MediaCredit[] = [
  {
    id: 'earthset',
    text: '"A Breathtaking Earthset from Orion", Artemis II, 2026-04-06, NASA (art002e021278). Public domain.',
    href: 'https://images.nasa.gov/details/art002e021278',
  },
  {
    id: 'bluemarble',
    text: 'AS17-148-22727, Apollo 17, 1972-12-07, NASA. Public domain.',
    href: 'https://images.nasa.gov/details/as17-148-22727',
  },
  {
    id: 'blackmarble',
    text: 'Black Marble, City Lights 2012, NASA Earth Observatory/NASA GSFC. Public domain.',
    href: 'https://commons.wikimedia.org/wiki/File:Black_Marble_-_City_Lights_2012_(8246892319).jpg',
  },
  {
    id: 'iss_sunrise',
    text: 'iss071e001425, orbital sunrise, 2024-04-07, NASA. Public domain.',
    href: 'https://images.nasa.gov/details/iss071e001425',
  },
  {
    id: 'iss_night',
    text: 'ISS073 night time-lapse 2025-09-29, NASA JSC. Public domain.',
    href: 'https://commons.wikimedia.org/wiki/File:ISS073-E-1220776-1221975-20250929-Night_-_2025-09-29_ISS073_1200_Night.webm',
  },
  {
    id: 'cdc_lab',
    text: 'CDC scientist transfers H7N9, James Gathany / CDC (PHIL 15704). Public domain.',
    href: 'https://commons.wikimedia.org/wiki/File:CDC_scientist_transfers_H7N9.png',
  },
  {
    id: 'mead_solar',
    text: 'Mead, Nebraska solar farm aerial 2026, AllTheUsernamesAreInUse. CC0.',
    href: 'https://commons.wikimedia.org/wiki/File:Mead,_Nebraska_solar_farm_aerial_2026.jpg',
  },
]

export function mediaCredit(id: string): MediaCredit {
  const credit = MEDIA_CREDITS.find((item) => item.id === id)
  if (!credit) throw new Error(`Unknown media credit: ${id}`)
  return credit
}
