# Data license

The datasets compiled in this repository are released under the
[Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/)
(CC BY 4.0).

You can copy, share, and adapt the data, including for commercial use, if you
give credit. A usable credit is:

> optimism.fun, CC BY 4.0, https://optimism.fun. Retrieved YYYY-MM-DD.

Also cite the source named on the row. Those upstream sources keep their own
terms. A figure in this repo is only as reusable as the source it quotes.

The code is MIT. See `LICENSE`.

This notice covers the compilations in `src/data/`, including problems,
discoveries, calls to action, and the time series stored beside them. It does
not change a rank, and it does not put a number in the dataset that the source
did not state.

Live responses are not part of that compilation. They stay under the upstream
terms, and a failed request is shown as unavailable rather than filled in.

- WHO observations are read from the public xMart API that feeds
  [data.who.int](https://data.who.int). Reuse of that data is under
  [WHO's terms and conditions](https://data.who.int/about/data/terms-and-conditions).
- Our World in Data trend lines are read from the
  [Grapher chart API](https://docs.owid.io/projects/etl/api/chart-api/) and are
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The citation under
  each chart is OWID's own.
- The World Bank last-published date is read from the World Bank API
  (`meta.lastupdated`). It is not a date stored in this repository.
