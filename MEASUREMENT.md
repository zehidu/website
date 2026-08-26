# The Renew Up measurement plan

Status: Cloudflare Web Analytics is active for aggregate, cookie-free traffic and performance measurement. The production product-event contract is prepared, but no third-party product-event analytics provider is enabled.

## Decision system

The measurement layer must answer four questions:

1. Which search queries and landing pages earn qualified visits?
2. Which visitor tasks are attempted and completed?
3. Which content or calculator version improves those outcomes?
4. Which templates should be improved, expanded, merged, or retired?

The north-star metric is **engaged organic task completions per indexed landing page**. A task completion is a calculator result, a symptom-guide selection, or a recall-check handoff. Traffic without a useful action is diagnostic context, not success.

## Collection layers

| Layer | Status | Purpose | Retention |
| --- | --- | --- | --- |
| Google Search Console | Active | Query, page, country, device, clicks, impressions, CTR, position, crawl and indexing | Export monthly snapshots before the 16-month UI window expires |
| Cloudflare Web Analytics | Active | Aggregate visits, referrers, browsers, countries and web performance | Provider-controlled aggregate retention; no custom visitor identity |
| GA4 | Not connected | Consent-aware acquisition and product-event stream | Proposed 14-month exploration retention |
| BigQuery export | Not connected | Durable raw events, content versions and experiment variants | Set after privacy review; proposed 25 months for raw events |
| Sampled replay | Not connected | Diagnose interface problems with all inputs masked | Proposed 30 days, consent required, sensitive routes excluded |

Retention values for tools that are not connected remain proposals until production consent and privacy configuration are reviewed.

## Event contract

The machine-readable contract is in data/event-schema.json. Code may emit only allowlisted event names and properties. Raw calculator inputs, typed searches, serial numbers, names and contact details are prohibited.

The site saves the latest 100 QA events in browser sessionStorage. They can be inspected with:

    window.renewUpAnalytics.getPreviewEvents()

This QA log is not transmitted. It exists to verify event shape before connecting a provider.

## Production data flow

    Search Console ─┐
    Cloudflare ─────┼─> weekly growth dashboard ─> content decision log
    GA4 ─> BigQuery ┘

The BigQuery event table should be partitioned by event date and clustered by event name and page path. A separate content-version table should contain:

- canonical URL
- template type
- appliance and symptom cluster
- published and modified timestamps
- source-review date
- content version
- experiment identifier and variant

No analytics table should contain form values or a persistent cross-device person identifier.

## Core dashboard views

1. Search visibility: indexed URLs, exclusions, non-branded impressions, clicks, CTR and position.
2. Landing-page quality: organic visits, task starts, task completions and completion rate.
3. Calculator funnel: start, validation error, complete, result distribution and reset.
4. Content library: symptom search terms are represented only by query length and result count in analytics; actual demand language comes from Search Console.
5. Technical health: Core Web Vitals, 404s, JavaScript errors and sitemap coverage.
6. Experiments: outcome by content version and variant, with a fixed observation window.

## Release gates

- Do not publish a new page type without a unique user task, sources and internal links.
- Do not bulk-expand a template until representative pages are indexed and earn non-branded impressions.
- Do not enable GA4 or session replay before consent behavior, input masking, retention and this privacy notice are production-ready.
- Do not apply for AdSense until navigation, original content, policy pages and stable user value are established.
