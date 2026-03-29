// CoinGecko API - free tier, no API key required
// 30 calls/min, 10K calls/month
// Fetches market data for crypto assets mapped to our problems

interface CoinGeckoMarketData {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  market_cap_change_percentage_24h: number
  image: string
}

export interface CryptoMarketUpdate {
  coingecko_id: string
  name: string
  price_usd: number
  market_cap_usd: number
  market_cap_change_24h: number
  logo_url: string
}

export async function fetchCryptoMarketData(
  coingeckoIds: string[]
): Promise<CryptoMarketUpdate[]> {
  if (coingeckoIds.length === 0) return []

  try {
    const ids = coingeckoIds.join(',')
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) {
      console.error(`CoinGecko API error: ${res.status}`)
      return []
    }

    const data: CoinGeckoMarketData[] = await res.json()

    return data.map((coin) => ({
      coingecko_id: coin.id,
      name: coin.name,
      price_usd: coin.current_price,
      market_cap_usd: coin.market_cap,
      market_cap_change_24h: coin.market_cap_change_percentage_24h,
      logo_url: coin.image,
    }))
  } catch (err) {
    console.error('CoinGecko fetch error:', err)
    return []
  }
}
