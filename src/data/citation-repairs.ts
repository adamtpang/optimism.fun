/**
 * The 16 HTTP 404 destinations from the 2026-11-06 link audit.
 * A 403 or a challenge page is not listed as dead.
 * againstmalaria.com returned HTTP 200 and is unchanged.
 */
export type CitationRepair = {
  oldUrl: string
  status: 'replaced' | 'unchanged-false-404' | 'unresolved'
  newUrl: string | null
  reason: string
}

export const citationRepairs: CitationRepair[] = [
  {
    oldUrl: 'https://copenhagenconsensus.com/halftime-sdg/welfare',
    status: 'replaced',
    newUrl: 'https://copenhagenconsensus.com/halftime-sustainable-development-goals-2016-2030/research',
    reason: 'Old path 404. The halftime research page states the malaria $48-per-dollar case this score uses.',
  },
  {
    oldUrl: 'https://engineering.uci.edu/how-broadcom-s-henry-samueli-giving-away-billions',
    status: 'replaced',
    newUrl: 'https://spectrum.ieee.org/how-broadcoms-henry-samueli-is-giving-away-billions',
    reason: 'UCI path 404. IEEE Spectrum hosts the article of the same title. The $500 million cumulative figure was not on the IEEE page and is no longer stated.',
  },
  {
    oldUrl: 'https://fastgrants.org',
    status: 'replaced',
    newUrl: 'https://future.com/what-we-learned-doing-fast-grants/',
    reason: 'fastgrants.org 404. Future published the operators’ own account, bylined Patrick Collison, Tyler Cowen, and Patrick Hsu.',
  },
  {
    oldUrl: 'https://home.cern/science/computing/birth-web/short-history-web',
    status: 'replaced',
    newUrl: 'https://www.w3.org/blog/2016/25-years-ago-the-world-changed-forever/',
    reason: 'CERN path 404. The W3C post states Berners-Lee released the Web from CERN on 6 August 1991.',
  },
  {
    oldUrl: 'https://newsroom.asu.edu/press-releases/115-million-gift-will-establish-rob-walton-school-conservation-futures',
    status: 'replaced',
    newUrl: 'https://news.asu.edu/20250922-environment-and-sustainability-115M-gift-largest-ever-asu-establishes-walton-school-conservation-futures',
    reason: 'Old press-release slug 404. The ASU News story is the same $115 million Rob Walton School gift.',
  },
  {
    oldUrl: 'https://ourworldindata.org/grapher/gdp-per-capita-worldbank-maddison',
    status: 'unresolved',
    newUrl: null,
    reason: 'Grapher 404. The live Maddison chart is 2011 international dollars, not the stored 2017 PPP points, so those points are marked unverified rather than relinked.',
  },
  {
    oldUrl: 'https://ourworldindata.org/history-of-agriculture',
    status: 'replaced',
    newUrl: 'https://www.worldhistory.org/article/9/agriculture-in-the-fertile-crescent--mesopotamia/',
    reason: 'OWID page 404. World History Encyclopedia states Levant domestication by about 9000 BCE and independent origins elsewhere. The timeline date was changed to that source.',
  },
  {
    oldUrl: 'https://www.againstmalaria.com',
    status: 'unchanged-false-404',
    newUrl: 'https://www.againstmalaria.com',
    reason: 'Returned HTTP 200 with the Against Malaria title on 2026-11-06. Treated as a false 404.',
  },
  {
    oldUrl: 'https://www.energy.gov/management/articles/manhattan-project-trinity-test-1945',
    status: 'replaced',
    newUrl: 'https://www.osti.gov/opennet/manhattan-project-history/Events/1945/trinity.htm',
    reason: 'DOE path 404. The DOE OpenNet history page is the Trinity test, 16 July 1945.',
  },
  {
    oldUrl: 'https://www.healthdata.org/research-analysis/health-by-topic/financing-global-health',
    status: 'unresolved',
    newUrl: 'https://www.healthdata.org/data-tools-practices/interactive-visuals/financing-global-health',
    reason: 'Old topic URL 404. The current page is the Financing Global Health visual, but the stored $25 billion infectious-disease slice was not re-read from it, so the dollar claim stays labeled unverified.',
  },
  {
    oldUrl: 'https://www.katc.com/news/covering-louisiana/raising-canes-celebrates-25-years-with-25m-donation-to-communities-nationwide',
    status: 'replaced',
    newUrl: 'https://www.theadvocate.com/baton_rouge/news/business/raising-canes-hits-25-year-milestone-with-25-million-in-donations-plans-to-open-100/article_93562aba-05c0-11ec-8343-675e70db65fc.html',
    reason: 'KATC URL 404. The Advocate story title is the same $25 million 25th-anniversary donations.',
  },
  {
    oldUrl: 'https://www.linkedin.com/pulse/dilip-shanghvi-illuminating-path-healthcare-innovation',
    status: 'unresolved',
    newUrl: null,
    reason: 'Resolved to LinkedIn’s generic article-not-found page. The rural-healthcare description is withdrawn as unverified. The dead URL is not replaced with the LinkedIn homepage.',
  },
  {
    oldUrl: 'https://www.loc.gov/collections/edison-company-motion-pictures-and-sound-recordings/articles-and-essays/biography/edison-invents/electric-light-and-power/',
    status: 'replaced',
    newUrl: 'https://www.loc.gov/collections/edison-company-motion-pictures-and-sound-recordings/articles-and-essays/biography/life-of-thomas-alva-edison',
    reason: 'The electric-light essay path 404’d in the audit. The same Library of Congress biography says the lab was devising an incandescent bulb and a lighting system into 1879. This environment gets HTTP 403 from loc.gov, which is an access block, not evidence the biography is gone.',
  },
  {
    oldUrl: 'https://www.meriton.com.au/aoc-thanks-harry-triguboff-for-generous-donation-to-tokyo-2020-medal-winners/',
    status: 'replaced',
    newUrl: 'https://www.olympics.com.au/news/aoc-thanks-harry-triguboff-for-generous-donation-to-tokyo-2020-medal-winners/',
    reason: 'Meriton path 404. The Australian Olympic Committee page is the same thanks for the Tokyo 2020 medal donation.',
  },
  {
    oldUrl: 'https://www.nasa.gov/history/sputnik-and-the-dawn-of-the-space-age/',
    status: 'replaced',
    newUrl: 'https://www.nasa.gov/history/65-years-ago-sputnik-ushers-in-the-space-age/',
    reason: 'Old NASA history path 404. The current NASA history article states 4 October 1957, 184 pounds, and the beep.',
  },
  {
    oldUrl: 'https://www.who.int/data/stories/global-excess-deaths-associated-with-covid-19-january-2020-to-december-2021',
    status: 'replaced',
    newUrl: 'https://www.who.int/news/item/05-05-2022-14.9-million-excess-deaths-were-associated-with-the-covid-19-pandemic-in-2020-and-2021',
    reason: 'Data-story URL 404. The WHO news page states 14.9 million excess deaths for 2020–2021. The previous ~20 million figure is not on that page and was removed.',
  },
]
