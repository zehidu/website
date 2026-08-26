# Changelog

All material website changes are recorded here. Production status is stated explicitly so a local build is never mistaken for a live result.

## 2026-08-26 — Local growth foundation, not yet published

### Added

- A transparent website-growth experiment homepage
- A public metrics dashboard separating live, local, and target values
- A real day-zero infrastructure and quality audit
- Focused guides for website measurement and low-cost static hosting
- Privacy notice, RSS feed, sitemap, robots file, custom 404 page, canonical URLs, JSON-LD, Open Graph metadata, security headers, favicon, and social card
- Owner operations guide and machine-readable day-zero baseline

### Removed

- Public demo admin with hard-coded credentials
- Fictional clients, testimonials, savings, and business-performance claims
- Contact form that stored submissions only in the visitor's own browser
- Runtime Tailwind CSS and Google Fonts dependencies

### Verified locally

- All HTML passes `html-validate`
- Internal links and JSON-LD parse successfully
- Sitemap and RSS XML parse successfully
- Removed admin paths return 404 from the local static server
- Lighthouse 13.4.1 simulated-mobile scores: 100 performance, 100 accessibility, 100 best practices, and 100 SEO
- Netlify CLI offline dry run accepts `netlify.toml`

### Production status

The live domain remains on commit `0d32206`. This release is stored on local branch `growth-foundation` and requires owner approval plus account connection before publication.
