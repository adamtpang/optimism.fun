# Exa research demo

The page is `/research`. Exa calls stay on the server.

## Key

`EXA_API_KEY` is the existing server env var. This demo does not add a key and does not use `exa-js`.

The client is `exaPost` in `src/lib/sources/exa.ts`. It sends `x-api-key` to `https://api.exa.ai`, the same header as the agent cron client. When the variable is unset, `/api/research/ask` and `/api/research/similar` return `{ "configured": false }` and the page shows "Exa not configured".

Do not print the key. Errors name the path and HTTP status only.

## Endpoints

| Route | Exa | Notes |
| --- | --- | --- |
| `POST /api/research/ask` | `POST /search`, then `POST /answer` | Search uses `category: "research paper"`, `type: "auto"`, `numResults: 10`, and contents `text`, `highlights`, and `summary`. Answer uses model `exa` (not `exa-research`) with `text: true` and a JSON schema of cited sentences. |
| `POST /api/research/similar` | `POST /findSimilar` | Same category and contents, `numResults: 8`. The current Exa spec marks `/findSimilar` deprecated. This route still calls it because the demo asked for findSimilar. |

Neither request sends `includeDomains`. Both send `excludeDomains` from `src/lib/research/domains.ts`.

Priority journals, indexes, preprint servers, and trial registries are a ranking hint in the search query and a stable sort after the results return. They are not an allowlist.

## Metadata

OpenAlex, Crossref, and Semantic Scholar are metadata resolvers only. They are not cited as the source of a claim.

- OpenAlex and Crossref get a `mailto` from `OPENALEX_CONTACT`, or `adamtpang@gmail.com` when that is unset. The same address is in the `User-Agent`.
- Each resolver has a 2.5 second timeout and they run in parallel. A miss or timeout leaves the status as Preprint or Peer-reviewed only when the host is in those lists. Otherwise the tag is "Status unknown".
- Retraction comes from OpenAlex `is_retracted` or Crossref `update-to` / relation. Correction comes from Crossref `update-to`. A retracted paper is not used as support.
- A citation count is shown only from OpenAlex, with the lookup date, for example `cited 412 times (OpenAlex, Nov 3, 2026)`.

## What can support a sentence

A URL can support a sentence only when Exa returned its text, highlights, or summary, the host is not excluded, it is not a news or press-release page, and it is not retracted. Anything else is dropped. A sentence left with no source is labeled uncited and is not shown as a finding.

News and press-release links can appear under Coverage. They are not evidence.

Add a predatory publisher hostname to `PREDATORY_PUBLISHER_DOMAINS` in `src/lib/research/domains.ts`. That file is the only exclude list.
