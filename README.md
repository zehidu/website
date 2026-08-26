# The Renew Up

A dependency-free static website documenting its own growth from an untracked one-page template into a measurable, useful, search-visible resource.

## Run locally

From this folder:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

No package install, database, or paid local service is required.

In a second PowerShell window, validate the files and local routes:

```powershell
.\scripts\check-site.ps1
```

Run `.\scripts\check-site.ps1 -SkipHttp` when the local server is not running.

## Production map

- Registrar: GoDaddy
- DNS: Cloudflare
- Hosting: Netlify project `zesty-custard-83b123`
- Source: `https://github.com/zehidu/website`, branch `main`
- Search ownership clue: Google site-verification TXT record exists in DNS

See [OPERATIONS.md](OPERATIONS.md) for dashboards, release checks, and the weekly growth routine.
The dated machine-readable baseline is in [data/baseline-2026-08-26.json](data/baseline-2026-08-26.json), and material changes are recorded in [CHANGELOG.md](CHANGELOG.md).

## Site structure

- `/` — experiment homepage
- `/metrics/` — public growth dashboard
- `/case-study/day-zero/` — evidence-backed first audit
- `/guides/free-website-analytics/` — measurement stack guide
- `/guides/local-vs-static-hosting/` — low-cost hosting guide
- `/privacy/` — current measurement and privacy status

## Release rule

Do not publish claims as live results until they have been checked on the production domain. Local improvements and future targets must remain labeled.
