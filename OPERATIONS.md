# The Renew Up operations

This is the owner-facing map for running the website without a custom server or fake admin dashboard.

## Authoritative dashboards

| Layer | Purpose | Access |
| --- | --- | --- |
| GitHub | Source history and releases | https://github.com/zehidu/website |
| Netlify | Production deploys, domain status, and future form submissions | https://app.netlify.com/projects/zesty-custard-83b123 |
| Cloudflare | DNS, edge traffic, and Web Analytics | https://dash.cloudflare.com/ |
| Google Search Console | Impressions, clicks, queries, indexing, and sitemap status | https://search.google.com/search-console |
| Live site | Production verification | https://therenewup.com/ |

No credentials or API keys belong in this repository.

## Local workflow

1. Run `python -m http.server 4173 --bind 127.0.0.1` from the repository root.
2. Review the changed pages at `http://127.0.0.1:4173/`.
3. Validate internal links, metadata, XML files, status codes, and structured data.
4. Commit the exact source state with a meaningful message.
5. Push only after the production change is approved.
6. Verify the live domain, analytics beacon, sitemap, and a fresh Lighthouse result.

## Account connection still required

1. Confirm the saved Google account that owns the Netlify project and Cloudflare zone.
2. Sign in to Netlify and verify the Git-backed deployment settings for `main`.
3. Sign in to Cloudflare, open Web Analytics, add `therenewup.com`, and copy its site-specific beacon.
4. Update every HTML page and `privacy/index.html` before deploying the beacon.
5. Open the verified Search Console domain property and submit `https://therenewup.com/sitemap.xml`.

## Release checklist

- [ ] No unsupported customer, revenue, savings, or ranking claims
- [ ] No secrets, passwords, API tokens, or personal visitor data in source
- [ ] Page title, description, canonical URL, Open Graph fields, and heading order checked
- [ ] All sitemap URLs return `200`
- [ ] `robots.txt`, `sitemap.xml`, `feed.xml`, and the custom `404.html` respond correctly
- [ ] `/admin/login.html`, `/admin/dashboard.html`, and `/admin/app.js` return `404`
- [ ] Keyboard focus, small-screen layout, and contrast checked
- [ ] Production Lighthouse baseline recorded with date and version
- [ ] Dashboard labels distinguish live, local, and target values

## Weekly 20-minute growth review

1. Search Console: compare non-branded impressions, clicks, CTR, queries, and pages with the prior period.
2. Cloudflare: review top entry pages, referrers, visits, and real-user performance.
3. Choose one page with early demand or one serious technical regression.
4. Make one focused improvement and record its release date.
5. Recheck after enough data has accumulated; do not interpret day-to-day noise as a trend.
