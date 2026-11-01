# optimism.fun

An open tool for humanity's hardest problems. The site ranks the problems, shows the sourced numbers, and lists where to build, fund, buy, or learn. People, teams, and capital can find the same page.

The code is [MIT](LICENSE). The data compilation is [CC BY 4.0](DATA_LICENSE.md), in the spirit of Our World in Data. Cite optimism.fun and the source on the row.

## Maintained by an AI, reviewed by a human

An AI research bot updates the data by pull request. It can run every day. It opens a pull request only when it has a sourced change: a new discovery, a call to action, or a corrected figure. A human reviews the diff before it merges.

The bot does not change a rank on its own. If a source does not state a number, the number stays out. Empty days stay empty.

How to add a row: [CONTRIBUTING.md](CONTRIBUTING.md), [research/DISCOVERIES.md](research/DISCOVERIES.md), [research/CTAS.md](research/CTAS.md).

## Data you can download

Every public dataset is JSON and CSV, with the citation on the row.

| Dataset | JSON | CSV |
| --- | --- | --- |
| Problems | `/api/problems` | `/api/problems/csv` |
| One problem | `/api/problems/<slug>` | `/api/problems/<slug>/csv` |
| Time series | `/api/series` | `/api/series/csv` |
| Discoveries | `/api/discoveries` | `/api/discoveries/csv` |
| Calls to action | `/api/ctas` | `/api/ctas/csv` |

A problem page links the same files. A chart uses only the series already stored for that problem. If there is no series, the page says so and does not draw a trend.

## Stack

Next.js 16, React 19, Tailwind, TypeScript. Neon for the coordination board. Vercel for hosting.

```bash
npm install
npm run dev
npm test
npx tsc --noEmit
npm run build
```

## What the pages are

- `/` the ranking, and a poster of it
- `/poster` the same poster, with a share image
- `/p/<slug>` the numbers, the chart, and what to do
- `/where` a private matcher. It stays in the browser
- `/data` the downloads and the license
- `/discoveries` findings, newest first
- `/s-tier` existential risks
