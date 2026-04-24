// Snapshot from coinmarketcap.com front page. Regenerate by re-scraping.
// Top cryptocurrencies by market capitalization.

import type { Crypto } from './types'

const TODAY = '2026-04-24'
const SOURCE = 'CoinMarketCap'
const SOURCE_URL = 'https://coinmarketcap.com'

const mk = (
  rank: number,
  name: string,
  symbol: string,
  priceUSD: number,
  marketCapUSD: number,
): Crypto => ({
  rank,
  name,
  symbol,
  price: {
    value: priceUSD,
    unit: 'USD',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    confidence: 'high',
    asOf: TODAY,
  },
  marketCap: {
    value: marketCapUSD,
    unit: 'USD',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    confidence: 'high',
    asOf: TODAY,
  },
  asOf: TODAY,
})

export const crypto: Crypto[] = [
  mk(1, 'Bitcoin', 'BTC', 78_276.70, 1_570_000_000_000),
  mk(2, 'Ethereum', 'ETH', 2_328.43, 281_000_000_000),
  mk(3, 'Tether', 'USDT', 1.0, 189_710_000_000),
  mk(4, 'XRP', 'XRP', 1.43, 88_500_000_000),
  mk(5, 'BNB', 'BNB', 638.45, 86_080_000_000),
  mk(6, 'USDC', 'USDC', 0.9998, 77_910_000_000),
  mk(7, 'Solana', 'SOL', 86.53, 49_820_000_000),
  mk(8, 'TRON', 'TRX', 0.3281, 31_100_000_000),
  mk(9, 'Dogecoin', 'DOGE', 0.09829, 15_130_000_000),
  mk(10, 'Hyperliquid', 'HYPE', 40.95, 10_450_000_000),
  mk(11, 'UNUS SED LEO', 'LEO', 10.27, 9_460_000_000),
  mk(12, 'Bitcoin Cash', 'BCH', 457.69, 9_170_000_000),
  mk(13, 'Cardano', 'ADA', 0.251, 9_080_000_000),
  mk(14, 'Monero', 'XMR', 375.81, 6_930_000_000),
]

export const getCryptoBySymbol = (symbol: string) =>
  crypto.find((c) => c.symbol === symbol)
