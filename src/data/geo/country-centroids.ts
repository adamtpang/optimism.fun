/**
 * Approximate country centroids (lat/lng) for plotting HQ locations on the
 * globe. Not survey-grade: good enough to drop a point on the right country.
 * Keyed by lowercased name; an alias table maps the short forms the dataset
 * uses (USA, UK, etc.) to the canonical key.
 */
export type LatLng = { lat: number; lng: number }

const CENTROIDS: Record<string, LatLng> = {
  'united states': { lat: 39.8, lng: -98.6 },
  china: { lat: 35.9, lng: 104.2 },
  'united kingdom': { lat: 54.0, lng: -2.9 },
  germany: { lat: 51.2, lng: 10.4 },
  france: { lat: 46.6, lng: 2.2 },
  japan: { lat: 36.2, lng: 138.3 },
  india: { lat: 22.6, lng: 79.0 },
  canada: { lat: 56.1, lng: -106.3 },
  netherlands: { lat: 52.1, lng: 5.3 },
  switzerland: { lat: 46.8, lng: 8.2 },
  sweden: { lat: 60.1, lng: 18.6 },
  'south korea': { lat: 36.5, lng: 127.8 },
  taiwan: { lat: 23.7, lng: 120.9 },
  israel: { lat: 31.0, lng: 34.9 },
  australia: { lat: -25.3, lng: 133.8 },
  singapore: { lat: 1.35, lng: 103.8 },
  brazil: { lat: -14.2, lng: -51.9 },
  italy: { lat: 41.9, lng: 12.6 },
  spain: { lat: 40.0, lng: -3.7 },
  denmark: { lat: 56.3, lng: 9.5 },
  ireland: { lat: 53.4, lng: -8.2 },
  finland: { lat: 64.9, lng: 26.1 },
  norway: { lat: 60.5, lng: 8.5 },
  russia: { lat: 61.5, lng: 105.3 },
  'saudi arabia': { lat: 23.9, lng: 45.1 },
  'united arab emirates': { lat: 23.4, lng: 53.8 },
  mexico: { lat: 23.6, lng: -102.6 },
  indonesia: { lat: -0.8, lng: 113.9 },
  belgium: { lat: 50.5, lng: 4.5 },
  austria: { lat: 47.5, lng: 14.6 },
  'hong kong': { lat: 22.3, lng: 114.2 },
  'new zealand': { lat: -40.9, lng: 174.9 },
}

const ALIASES: Record<string, string> = {
  usa: 'united states',
  us: 'united states',
  'u.s.': 'united states',
  'u.s.a.': 'united states',
  america: 'united states',
  uk: 'united kingdom',
  'u.k.': 'united kingdom',
  britain: 'united kingdom',
  england: 'united kingdom',
  uae: 'united arab emirates',
  korea: 'south korea',
  'rep. of korea': 'south korea',
}

export function centroidFor(country: string | undefined | null): LatLng | null {
  if (!country) return null
  const key = country.trim().toLowerCase()
  const norm = ALIASES[key] ?? key
  return CENTROIDS[norm] ?? null
}
