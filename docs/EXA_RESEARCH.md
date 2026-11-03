# Exa research demo

The page is `/research`. Exa calls stay on the server.

## Key

`EXA_API_KEY` is the existing server env var. This demo does not add a key and does not use `exa-js`.

The client is `exaPost` in `src/lib/sources/exa.ts`. It sends `x-api-key` to `https://api.exa.ai`, the same header as the agent cron client. When the variable is unset, `/api/research/ask` and `/api/research/similar` return `{ "configured": false }` and the page shows "Exa not configured".

Do not print the key. Errors name the path and HTTP status only.

## Endpoints

| Route | Exa | Notes |
| --- | --- | --- |
| `POST /api/research/ask` | `POST /search`, then `POST /answer` twice | Search uses `category: "research paper"`, `type: "auto"`, `numResults: 10`, and contents `text`, `highlights`, and `summary`. The first answer uses model `exa` and the numbered source list from that search. The second answer checks each sentence against the cited excerpt and drops a sentence that fails. |
| `POST /api/research/similar` | `POST /findSimilar` | Same category and contents, `numResults: 8`. The input paper and copies with the same DOI or normalized title are removed. |

Neither request sends `includeDomains`. Both send `excludeDomains` from `src/lib/research/domains.ts`.

Priority journals, indexes, preprint servers, and trial registries are a ranking hint in the search query and a stable sort after the results return. They are not an allowlist.

## Metadata

OpenAlex, Crossref, and Semantic Scholar are metadata resolvers only. They are not cited as the source of a claim.

- OpenAlex and Crossref get a `mailto` from `OPENALEX_CONTACT`, or `adamtpang@gmail.com` when that is unset. The same address is in the `User-Agent`.
- Each resolver has a 2.5 second timeout and they run in parallel. Status comes from Crossref `type` and OpenAlex `type`, not from the website host. DOI prefixes `10.1101`, `10.48550`, `10.2139`, and `10.21203` are Preprint. PubMed and Europe PMC get a status only after the DOI resolves.
- If the retraction check times out, the paper is Unverified and is not cited. Retraction is read from OpenAlex `is_retracted` and from Crossref `update-to`, `updated-by`, and relation. An expression of concern is tagged Concern.
- A DOI can be read from the URL (Nature article ids, Lancet PII, a DOI path) or from a header DOI in the excerpt. PMC and PMID use the NCBI ID converter. A title lookup against OpenAlex or Crossref is used only when the normalized titles match. No new key.
- springermedizin.de, malariaworld.org, and Medscape are mirrors. They are kept only when a DOI, PMID, or arXiv id resolves, and the link is then doi.org or PubMed, not the mirror.
- `[1]` is the first source a reader sees. Cited sources are renumbered 1..n in the order they appear in the answer.
- A sentence is dropped when it states a number, percent, or sample size that is not in the cited excerpt or abstract. The abstract comes from OpenAlex or Crossref when one is available. A pooled study is not called an RCT unless the cited text says so.
- A citation count is shown only from OpenAlex, with the lookup date, for example `cited 412 times (OpenAlex, Nov 3, 2026)`.

## What can support a sentence

A URL can support a sentence only when Exa returned its text, highlights, or summary, the retraction check completed, and the paper is not excluded, news, a mirror without an id, or retracted. Uncited sentences are dropped from the answer. Displayed excerpts replace an em dash with a hyphen.

News and press-release links can appear under Coverage. They are not evidence.

Add a predatory publisher hostname to `PREDATORY_PUBLISHER_DOMAINS` in `src/lib/research/domains.ts`. That file is the only exclude list.
