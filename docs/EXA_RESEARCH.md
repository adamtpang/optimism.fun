# Exa research demo

The page is `/research`. Exa calls stay on the server.

## Key

`EXA_API_KEY` is the existing server env var. This demo does not add a key and does not use `exa-js`.

The client is `exaPost` in `src/lib/sources/exa.ts`. It sends `x-api-key` to `https://api.exa.ai`, the same header as the agent cron client. When the variable is unset, `/api/research/ask` and `/api/research/similar` return `{ "configured": false }` and the page shows "Exa not configured".

Do not print the key. Errors name the path and HTTP status only.

## Endpoints

| Route | Exa | Notes |
| --- | --- | --- |
| `POST /api/research/ask` | `POST /search`, then `POST /answer` twice | Search uses `category: "research paper"`, `type: "auto"`, `numResults: 10`, and contents `text`, `highlights`, and `summary`. Pinned DOIs that search missed are added by Crossref or OpenAlex lookup when the question matches and the lookup returns an abstract. The first answer uses model `exa` and that candidate list. The second answer checks each sentence against the cited excerpt and drops a sentence that fails. If nothing survives, the response is HTTP 200 with `status: "no-answer"` and the sentence "No answer could be backed by retrieved papers for this question." An upstream Exa failure stays HTTP 502. |
| `POST /api/research/similar` | `POST /findSimilar` | Same category and contents. The request asks for 25 candidates. The input paper and copies with the same DOI or normalized title are removed, then up to 8 clean DOI, PMID, or arXiv results are returned. |

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
- Each retrieved paper is asked for at most two claims written from that paper's abstract alone, labeled benefit, null, or mixed. The answer is assembled from those claims, with at least one of each side when both exist. A number must be printed in that abstract; a range such as 78-79% is kept only when the abstract prints the range. A claim is rewritten without an unsupported number instead of being dropped for omitting one. Abstract sentences are not copied into the answer. A headcount that is the sum of two printed arm counts is written as the total with those arms. A model sentence that says the sources contain no information becomes the no-answer fallback, with no citations.
- A paper is labeled no effect only when the text reports a null on its primary outcome. A statistically significant efficacy result stays a benefit when the effect is modest. Safety wording such as "adverse events were similar" is not a null primary.
- When retrieved papers disagree, the prompt tells the model to cite both sides, with the study, population, and outcome. The no-answer fallback is used only when no sentence survives the support check.
- A DOI taken from the page text is kept only when the Crossref title matches the page title. A reference-list DOI that fails that match is dropped, and the URL's PMID or PMC id stays the identity.
- When Crossref, OpenAlex, and Europe PMC all return an abstract, the longest one is used, so a truncated OpenAlex abstract does not hide a figure the full abstract prints. A pinned DOI is added only when a lookup returns an abstract. Europe PMC supplies Sutton 2018, which Crossref and OpenAlex do not. The citation link stays the DOI.
- Pinned DOIs live in `src/lib/research/pins.ts`. The fasting pins are Sutton 2018 `10.1016/j.cmet.2018.04.010`, Che 2021 `10.1186/s12986-021-00613-9`, and Bantle 2022 `10.1002/oby.23620`. The R21 pin is `10.1016/s0140-6736(23)02511-4`. The M72 pins are `10.1056/nejmoa1803484` and `10.1056/nejmoa1909953`. The 4-month rifapentine regimen pin is Dorman 2021 `10.1056/nejmoa2033400`, confirmed on Crossref as a New England Journal of Medicine journal article issued 2021-05-06, not retracted. CI calls `askResearch` with a search response that omits these DOIs and fails if they are absent from the candidate set.
- A citation count is shown only from OpenAlex, with the lookup date, for example `cited 412 times (OpenAlex, Nov 3, 2026)`.

## What can support a sentence

A URL can support a sentence only when Exa returned its text, highlights, or summary, the retraction check completed, and the paper is not excluded, news, a mirror without an id, or retracted. Uncited sentences are dropped from the answer. Displayed excerpts replace an em dash with a hyphen.

News and press-release links can appear under Coverage. They are not evidence.

Add a predatory publisher hostname to `PREDATORY_PUBLISHER_DOMAINS` in `src/lib/research/domains.ts`. That file is the only exclude list.
