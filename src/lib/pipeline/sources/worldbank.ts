import { RawArticle } from '../types'

// World Bank blogs / news about development challenges
export async function fetchWorldBank(): Promise<RawArticle[]> {
  const articles: RawArticle[] = []

  try {
    // World Bank featured topics API
    const indicators = [
      { code: 'SI.POV.DDAY', name: 'Extreme Poverty' },
      { code: 'SH.DYN.MORT', name: 'Child Mortality' },
      { code: 'SE.ADT.LITR.ZS', name: 'Adult Literacy' },
    ]

    for (const indicator of indicators) {
      const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator.code}?format=json&date=2020:2024&per_page=10&mrnev=1`
      const res = await fetch(url)
      if (!res.ok) continue

      const data = await res.json()
      if (!data[1]) continue

      // Find countries with worst values
      const entries = data[1]
        .filter((d: { value: number | null }) => d.value !== null)
        .sort((a: { value: number }, b: { value: number }) => {
          // For poverty/mortality, higher is worse
          if (indicator.code === 'SE.ADT.LITR.ZS') return a.value - b.value
          return b.value - a.value
        })
        .slice(0, 5)

      for (const entry of entries) {
        articles.push({
          title: `${indicator.name} challenge in ${entry.country?.value || 'Unknown'}`,
          description: `${entry.country?.value || 'Unknown'} reported ${indicator.name.toLowerCase()} indicator of ${entry.value} in ${entry.date}. This represents a significant development challenge requiring attention and resources.`,
          url: `https://data.worldbank.org/indicator/${indicator.code}?locations=${entry.countryiso3code}`,
          source_name: 'World Bank',
          source_type: 'worldbank',
          published_at: `${entry.date}-01-01`,
        })
      }
    }
  } catch (err) {
    console.error('World Bank fetch error:', err)
  }

  return articles
}
