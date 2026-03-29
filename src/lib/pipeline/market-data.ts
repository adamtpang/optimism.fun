import { getDb } from '@/lib/db'
import { fetchCryptoMarketData } from './sources/coingecko'

export async function updateMarketData() {
  const sql = getDb()

  // 1. Get all crypto companies with coingecko IDs
  const cryptoCompanies = await sql`
    SELECT id, coingecko_id FROM companies
    WHERE company_type = 'crypto' AND coingecko_id IS NOT NULL
  `

  const coingeckoIds = cryptoCompanies
    .map((c) => c.coingecko_id as string)
    .filter(Boolean)

  // 2. Fetch live crypto market data
  const cryptoData = await fetchCryptoMarketData(coingeckoIds)

  // 3. Update crypto companies with live data
  for (const coin of cryptoData) {
    await sql`
      UPDATE companies SET
        market_cap_usd = ${coin.market_cap_usd},
        market_cap_change_24h = ${coin.market_cap_change_24h},
        price_usd = ${coin.price_usd},
        logo_url = ${coin.logo_url},
        last_updated_at = NOW()
      WHERE coingecko_id = ${coin.coingecko_id}
    `
  }

  // 4. Recalculate category capital totals
  await sql`
    INSERT INTO category_capital (category_id, total_market_cap_usd, company_count, top_company_name, top_company_market_cap)
    SELECT
      c.category_id,
      SUM(c.market_cap_usd) as total_market_cap_usd,
      COUNT(*) as company_count,
      (SELECT name FROM companies WHERE category_id = c.category_id ORDER BY market_cap_usd DESC NULLS LAST LIMIT 1),
      MAX(c.market_cap_usd)
    FROM companies c
    WHERE c.market_cap_usd IS NOT NULL AND c.category_id IS NOT NULL
    GROUP BY c.category_id
    ON CONFLICT (category_id) DO UPDATE SET
      total_market_cap_usd = EXCLUDED.total_market_cap_usd,
      company_count = EXCLUDED.company_count,
      top_company_name = EXCLUDED.top_company_name,
      top_company_market_cap = EXCLUDED.top_company_market_cap,
      last_updated_at = NOW()
  `

  return {
    crypto_updated: cryptoData.length,
    total_companies: cryptoCompanies.length,
  }
}
