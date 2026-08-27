# The Renew Up

A source-checked appliance decision site built around a working repair-or-replace calculator, symptom guides, recall checks, and privacy-safe product measurement.

This repository contains the validated production source for therenewup.com.

## Run locally

From this folder:

    python -m http.server 4173 --bind 127.0.0.1

Open http://127.0.0.1:4173/ and run the repeatable checks in another PowerShell window:

    .\scripts\check-site.ps1

No package installation, database, or paid local service is required.

## Motion-first Decision Lab surface

- / — interactive decision orbit and a three-screen visual repair-or-replace wizard with animated output
- /diagnose/ — searchable visual symptom paths
- /guides/washer-not-draining/
- /guides/washer-not-spinning/
- /guides/dishwasher-not-draining/
- /guides/dishwasher-not-cleaning/
- /recalls/ — official CPSC recall handoff
- /methodology/ — versioned calculator formula, boundaries, and limitations
- /privacy/ — current and planned measurement disclosure

The shared experience layer adds touch-controlled scene players, decision-signal motion, calculator feedback, reading progress, and active section guidance. It honors `prefers-reduced-motion`, pauses autoplay during interaction, requires no animation library, and keeps content usable when JavaScript is unavailable.

Product data, the content roadmap, and the analytics contract live in data/. The decision and dashboard architecture is documented in MEASUREMENT.md.

## Production map

- Registrar: GoDaddy
- DNS: Cloudflare
- Hosting: Netlify project zesty-custard-83b123
- Source: https://github.com/zehidu/website
- Search property: sc-domain:therenewup.com

Netlify, Cloudflare, and Search Console are connected to the owner-approved Google account. No credentials or API keys belong in this repository.

## Publication status

The owner approved publication on August 26, 2026. The site is live, Google Search Console accepted the canonical sitemap with 9 production URLs, and Cloudflare Web Analytics provides the cookie-free aggregate baseline. Before any third-party product-event analytics, outcome submission, data warehouse, or session replay is enabled, add a verified privacy contact, approve retention periods, configure consent behavior, and test all input masking.
