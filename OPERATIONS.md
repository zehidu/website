# The Renew Up operations

## Authoritative services

| Layer | Purpose | Access |
| --- | --- | --- |
| GitHub | Source history and releases | https://github.com/zehidu/website |
| Netlify | Production deploys and domain status | https://app.netlify.com/projects/zesty-custard-83b123 |
| Cloudflare | DNS, edge traffic and Web Analytics | https://dash.cloudflare.com/ |
| Google Search Console | Search demand, indexing and sitemap status | https://search.google.com/search-console |
| Live site | Production verification | https://therenewup.com/ |

The required owner-approved account connections are established. Publication was explicitly approved on August 26, 2026.

## Local release workflow

1. Run the static preview on http://127.0.0.1:4173/.
2. Test the calculator with repair, compare, replace, empty, and boundary inputs.
3. Search and filter the symptom library.
4. Run .\scripts\check-site.ps1.
5. Review sources, safety boundaries, metadata, sitemap entries, keyboard flow, and mobile layout.
6. Commit the exact approved source state.
7. Push and deploy only after explicit owner approval.
8. Verify the live canonical URL, sitemap, redirects, security headers, analytics consent, and Search Console indexing.

## Measurement activation order

1. Keep Cloudflare Web Analytics active as the cookie-free aggregate baseline.
2. Submit and monitor the canonical sitemap in Search Console.
3. Add a verified privacy contact and approve the retention schedule before product-event analytics.
4. Create or confirm the GA4 property and web stream only after that review.
5. Implement regional consent behavior and verify denied-state requests.
6. Send only the allowlisted events in data/event-schema.json.
7. Link GA4 to Search Console and enable the daily BigQuery export if the data policy is approved.
8. Add sampled session replay only after input masking and route exclusions pass.
9. Build the weekly dashboard specified in MEASUREMENT.md.

## Content expansion rule

Every new search page needs a distinct user task, primary or manufacturer sources, a clear safety boundary, unique copy, a canonical URL, internal links, and a dated source review. Do not generate hundreds of pages until representative pages index and earn non-branded impressions.

## Release checklist

- [ ] Calculator logic and version match methodology
- [ ] No raw cost, age, serial number, typed query, or contact value enters analytics
- [ ] No unsupported savings, ranking, customer, or product-lifespan claims
- [ ] Every sitemap URL returns 200 and has a matching canonical
- [ ] Structured data parses and visible page content supports it
- [ ] Custom 404 and removed admin paths behave correctly
- [ ] Social preview, favicon, keyboard focus, contrast and small-screen layout reviewed
- [x] Privacy notice discloses the active aggregate Cloudflare Web Analytics baseline
- [ ] Privacy contact, retention and consent configuration approved before product-event analytics activation
- [ ] Production Search Console sitemap resubmitted after deployment

## Weekly growth review

1. Check indexing failures and crawl errors first.
2. Compare non-branded impressions, clicks, CTR and landing pages with the prior comparable period.
3. Review task starts and completions by organic landing page and content version.
4. Select one technical problem or one page with clear demand.
5. Record the change, hypothesis and observation window.
6. Expand a template only after its representative pages show useful search and product behavior.
