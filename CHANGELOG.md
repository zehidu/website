# Changelog

All material website changes are recorded here. Production status is stated explicitly so a local build is never mistaken for a live result.

## 2026-08-26 — Coherent calculator story

- Rebuilt the homepage hero as one connected nine-stage worked example instead of independent signal loops
- Animated context, life used, quote ratio, reliability, offsets, safety, score, yearly value, break-even guardrail, and five-year plan in sequence
- Connected every displayed value to the production calculator engine so the walkthrough and live result share one source of truth
- Added direct stage navigation, previous/play/next controls, progress, keyboard input, offscreen pausing, and reduced-motion behavior
- Added a persistent driver ledger so each input visibly accumulates into the final replacement-pressure score
- Versioned every production asset as release `20260826-5`

## 2026-08-26 — Motion-first visual experience

- Replaced the long calculator form with a three-screen visual wizard for appliance, age, and price
- Added an interactive decision orbit, animated price balance, age dial, scoring factory, privacy gate, and symptom machines
- Converted every troubleshooting guide, recall flow, methodology explanation, and privacy explanation into touch-controlled scene players
- Moved technical depth and source notes behind native disclosures so the initial experience stays visual without removing search-readable evidence
- Added keyboard controls, no-JavaScript fallbacks, autoplay pausing, and full reduced-motion behavior
- Versioned every production asset as release `20260826-4`

## 2026-08-26 — Explanatory motion system

- Added staged scroll reveals and animated pathways across every production route
- Added live decision-map scanning, responsive inputs, score count-up, driver bars, timeline sequencing, and result-card reveals
- Added animated troubleshooting steps, recall-label scanning, methodology signals, privacy data flow, reading progress, and active section guidance
- Added complete reduced-motion behavior and kept the system dependency-free
- Versioned all visual assets so the motion release cannot mix with older cached files

## 2026-08-26 — Decision Lab v2 visual redesign

### Product experience

- Replaced the basic three-input result with a progressive decision workbench for price, age, reliability, diagnosis, warranty, efficiency, and safety
- Added replacement-pressure, cost-per-expected-year, break-even, score-driver, and five-year planning visuals
- Converted the homepage, problem finder, four symptom guides, recall flow, methodology, and privacy explanation into compact visual paths and outcome maps
- Kept typed appliance details and dollar amounts out of analytics
- Versioned production CSS and JavaScript URLs so the release cannot mix new HTML with week-cached older assets

### Calculator governance

- Versioned the model as `rr-2.0` with repair, compare, replace, and safety-pause outcomes
- Added transparent 0–100 pressure zones and a direct replacement boundary at a 75% repair-to-replacement ratio
- Expanded boundary tests for the new output model

## 2026-08-26 — Appliance decision MVP production release

### Product direction

- Replaced the generic website-growth experiment with a focused appliance repair and lifecycle product
- Added a working, transparent repair-or-replace calculator for washing machines and dishwashers
- Added a searchable symptom library and four source-reviewed starting guides
- Added an official CPSC recall handoff and a public calculator methodology

### Measurement foundation

- Added a strict analytics event allowlist, anonymous per-tab preview sessions, coarse calculator ranges, and prohibited-field contract
- Added the content roadmap, appliance assumptions, issue records, and full measurement architecture
- Enabled Cloudflare Web Analytics with a manual cookie-free beacon for aggregate traffic and real-user performance
- Kept all third-party product analytics disabled pending consent, retention, privacy-contact, and owner review

### Search and trust

- Replaced titles, descriptions, navigation, sitemap, feed, structured data, social preview, and internal links
- Added dated source reviews, safety boundaries, primary/manufacturer references, and transparent model limitations
- Removed the obsolete experiment dashboard, audit, hosting guide, analytics guide, and day-zero baseline from the site surface

### Production status

The owner approved publication on August 26, 2026. This is the production release source for the rebuilt domain. Google Search Console accepted the canonical sitemap and discovered all 9 indexable production URLs.

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
- Netlify's offline runtime applies the security headers, redirects `/index.html` to `/`, serves the custom 404 for removed admin routes, and returns the expected content types for crawl and baseline files

### Production status

The live domain remains on commit `0d32206`. This release is stored on local branch `growth-foundation` and requires owner approval plus account connection before publication.
