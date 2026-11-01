# Contributing

optimism.fun is open. Changes land as pull requests. A human reviews them before they merge. An AI research bot uses the same path.

## Data

Do not invent a number, a date, a paper, or a URL. Copy figures from the source you link. If you cannot find it, leave the field empty.

Do not change a problem's rank, score, or stored figure unless the pull request shows the source for the new figure and says what the old figure was. Rank is computed. Editing a stored input changes the order, so call that out.

No em dashes or en dashes in new copy.

### A discovery

Follow [research/DISCOVERIES.md](research/DISCOVERIES.md). Append to `src/data/discoveries.ts`. The file throws on a bad slug, a bad date, or a status with no notice.

### A call to action

Follow [research/CTAS.md](research/CTAS.md). Append to `src/data/ctas.ts`. Kinds are `build`, `fund`, `buy`, and `learn`. An amount is allowed only with the `sourceUrl` of the page that states it. The file throws on a bad slug, a non-https URL, a missing name, or an amount with no source.

### A time series

Add points only when each year and value is in a citable public source, and record that source on the problem. Do not interpolate years to make a smoother line.

## Checks

```bash
npm test
npx tsc --noEmit
```

`npm test` includes the discovery and call-to-action validators.

## Code

Match the existing pages: short sentences, Fraunces for titles, mono for labels, the sky accent for links. Keep a page usable at 390px wide and at 1440px. Prefer a server component. Do not add an account or send the matcher's answers anywhere.
