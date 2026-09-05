# Handoff: learn from public-apis/public-apis

Written 2026-09-03 by the Aether root session, using the github-star-match skill. This
repo was on Adam's GitHub stars; it was reviewed against optimism.fun, this file was
written, and the star was removed. Popularity is not evidence of fit; the verdict
below is about a concrete local seam or the lack of one.

- **Verdict:** `borrow selectively`. A curated list of free APIs; optimism.fun already wraps OWID, World Bank, WHO, and OpenFDA and needs more signal sources.
- **Local owner repository:** `optimism.fun`
- **Local evidence paths:**
  - optimism.fun/src/lib/sources
  - optimism.fun/src/data/data-sources.ts
  - optimism.fun/src/data/demand-signals.ts
- **Upstream:** https://github.com/public-apis/public-apis
- **Reviewed commit:** `9d04268` on `master` (2026-09-02)
- **Upstream layout at that commit:** .github,scripts
- **License conclusion:** MIT. MIT list; each chosen API carries its own terms. Record the API's terms in data-sources.ts before use.
- **Smallest experiment, or deferred trigger:** Wire exactly one new API from the list as a source adapter in src/lib/sources, matching the OWID adapter's shape, and surface it on one quest.
- **Validation before adoption:** run the local project's own tests after any change, keep the reviewed commit pinned above, and preserve upstream license notices if any file is copied.

Boundary, per the skill: this analysis authorizes no installation or code change.
Implement only when Adam asks in that project's own session. Do not add the upstream
repo as `kin` in repos.yaml; it is a reference, not a Repo Rep.
