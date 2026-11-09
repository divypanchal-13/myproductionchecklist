# Changelog

All notable changes to SEO Legend are recorded here. The skill follows
[Semantic Versioning](https://semver.org/): the version lives in
`scripts/seo-audit.mjs` and the package version in this file.

## 1.0.0 — 2026-11-07

Initial public release.

- Mission protocol with measurable briefs, autonomy levels (`L0`–`L3`), stop
  conditions, evidence ledger, and Definition of Done.
- Seven-phase workflow: recon, audit, prioritise, implement, verify, red-team,
  sign off.
- Fourteen references covering technical SEO, on-page/content, structured data,
  performance, international, ecommerce, local, AI search, analytics/consent,
  measurement, migrations, risk/ethics, sources, and frameworks.
- Six paste-ready mission prompts: mission brief, full audit, implement,
  independent verify, red-team review, and bounded fix loop.
- Five checklists: master audit (222 rows), single-page QA, launch, migration,
  and agent sign-off with a waiver register.
- Five templates: metadata, JSON-LD, `robots.txt`, `llms.txt` v2, and server
  headers.
- Zero-dependency `scripts/seo-audit.mjs` for Node.js 18+: robots/sitemap
  discovery, crawl/route audits, status and redirect chains, metadata,
  canonicals, robots directives, JSON-LD, images, security headers, optional
  link checking, soft-404 test, JSON evidence, and CI-friendly exit codes.
- Zero-dependency `scripts/validate-skill.mjs` to keep the checklist registry,
  finding IDs, links, and script syntax consistent.
- Shared finding-ID registry between the automated auditor and the master
  checklist.
- MIT license and community contribution guide.
