---
name: SEO Legend
description: Mission-grade SEO for any website — audit, implement, verify. Use for technical SEO, crawl/index issues, on-page and content, metadata, structured data, Core Web Vitals, international/hreflang, ecommerce, local SEO, AI search and llms.txt, migrations, analytics/consent, and evidence-based agent review loops. Produces prioritized findings, safe patches, and pass/fail sign-off.
license: MIT
compatibility: Any agent with file read/write and shell access. Audit script needs Node.js 18+. Browser tools recommended for rendered-DOM and CWV checks.
---

# SEO Legend

A complete, evidence-driven SEO operating system for humans **and** autonomous
agents. It is deliberately mission-shaped: every engagement has an objective,
scope, constraints, evidence, gates, and a sign-off — not a pile of tips.

> **Prime directive:** improve outcomes for real people and real search engines.
> Never manipulate, deceive, fabricate, or claim a result you did not verify.

---

## 1. When to use this skill

Load this skill when the task involves any of:

- SEO audit, technical SEO, crawl/index diagnosis, Search Console issues
- Titles, meta descriptions, headings, internal links, content briefs
- Schema.org / JSON-LD / rich results
- Core Web Vitals, page speed, mobile experience
- International SEO, hreflang, multi-region/multi-language sites
- Ecommerce SEO: products, variants, facets, pagination, out-of-stock
- Local SEO: Google Business Profile, NAP, LocalBusiness schema
- AI search readiness: `llms.txt`, markdown mirrors, crawler policy
- Site migrations, replatforming, URL changes, redirect maps
- SEO measurement, reporting, analytics/consent, ranking claims
- An agent mission that must audit → implement → verify → sign off

Do **not** use it for paid-media strategy, pure UX redesign, or link buying.
Those are out of scope and, in the last case, against policy.

---

## 2. Non-negotiables

1. **White hat only.** No cloaking, doorway pages, hidden text/links, keyword
   stuffing, link schemes, PBNs, fake reviews, scraped/thin content, sneaky
   redirects, expired-domain abuse, site-reputation abuse, or automated queries
   against Google Search. See `references/12-risk-ethics.md`.
2. **No fabricated evidence.** Do not invent rankings, traffic, scores, crawl
   data, or competitor metrics. If you did not measure it, say so.
3. **No ranking promises.** SEO is probabilistic. Report `expected impact`,
   `confidence`, and `effort` — never guarantees.
4. **Production is radioactive.** Any change that can deindex, redirect, delete,
   or expose data requires explicit human approval (`L3`). Default to `L1`/`L2`.
5. **One source of truth.** Canonical host, URL shape, metadata, and structured
   data must agree with each other and with what users see.
6. **Rendered reality beats raw HTML.** For JS-heavy sites, verify the DOM the
   crawler actually sees, not only the server response.
7. **Accessibility and SEO are allies.** Don't trade one for the other.

---

## 3. Mission protocol (agent-ready)

Every mission starts by filling `missions/00-mission-brief.md`. A mission without
these fields is invalid:

| Field | Meaning |
| --- | --- |
| Objective | One measurable outcome, e.g. "restore indexation of /guides/*" |
| Scope | Hosts, paths, locales, templates, CMS, environments |
| Constraints | Stack, design system, copy ownership, freeze windows, budget |
| Access | Repo, CMS, GSC/Bing, analytics, server, browser |
| Success criteria | Binary checks that can be re-run |
| Non-goals | What will **not** be touched |
| Risk tier | `L0`–`L3` autonomy (below) |
| Evidence | Where outputs/screenshots/logs will be stored |
| Stop conditions | When the agent must stop and ask |

### 3.1 Autonomy levels

| Level | Allowed | Human approval |
| --- | --- | --- |
| `L0` | Read-only audit, analysis, report | None |
| `L1` | Propose diffs, content, redirects — no writes | Approve plan |
| `L2` | Write to branch/staging, run full verification | Approve merge/deploy |
| `L3` | Production write/deploy | Explicit, per-change approval + rollback plan |

Default to `L1`. An agent may self-promote to `L2` only when the mission brief
explicitly grants it and the repo is not production.

### 3.2 Stop conditions (always stop and ask)

- A change would delete or `noindex` production URLs.
- robots.txt, canonical host, redirects, or DNS must change.
- Two credible sources disagree and the wrong choice causes indexation loss.
- Required credentials/access are missing.
- The fix requires changing business claims, prices, legal text, or reviews.
- Verification still fails after the agreed retry budget (default 3 loops).
- The only way to "pass" is to fake data or game a metric.

### 3.3 Evidence ledger

Record every check in a table like this — in the report and in your working notes:

| ID | Severity | Check | Method | Evidence | Result |
| --- | --- | --- | --- | --- | --- |
| T-07 | P0 | Sitemap URLs return 200 | `seo-audit.mjs` | `report.json` | FAIL |
| C-01 | P1 | Titles unique | audit cross-page diff | `report.json` | PASS |

**Rule: no evidence, no pass.** A statement like "looks good" is not evidence.

---

## 4. Severity model

| Level | Name | Definition | SLA |
| --- | --- | --- | --- |
| `P0` | Blocker | Crawl/index broken, security/legal risk, data loss, site down | Fix/stop immediately |
| `P1` | Critical | Major loss of visibility, traffic, or rich results | Fix this cycle |
| `P2` | Improvement | Meaningful but non-blocking | Plan next cycle |
| `P3` | Polish | Nice-to-have, measurement, documentation | Backlog |

A mission cannot be signed off with an open `P0`. An open `P1` requires a
written, time-bound waiver approved by the human owner, with a compensating
control. P0 is never waivable. See `checklists/agent-signoff.md`.

---

## 5. The seven-phase workflow

### Phase 1 — Recon (read-only)

- Identify stack/framework, rendering mode (SSR/SSG/ISR/CSR), CMS, CDN, host.
- Map templates, locales, URL patterns, pagination, facets, search pages.
- Inventory existing SEO controls: metadata, sitemap, robots, canonicals,
  redirects, schema, analytics, consent.
- Establish the **baseline** before changing anything: crawl sample, key
  status codes, indexability, CWV lab data, GSC/Bing exports if available.
- Save baseline artifacts. You will need them for before/after proof.

### Phase 2 — Audit

Run the automated audit first:

```bash
node .opencode/skills/seo-legend/scripts/seo-audit.mjs \
  --url=https://example.com \
  --site=https://example.com \
  --max=100 \
  --json=seo-baseline.json
```

Then do the human/agent checks that automation cannot do:

- Search intent and content quality per template.
- Rendered DOM vs raw HTML (browser tool: disable JS, compare).
- Canonical/redirect/hreflang conflicts.
- Structured-data eligibility vs visible content.
- Internal-link architecture and orphan pages.
- Core Web Vitals field data (CrUX/Search Console) vs lab data.
- Duplicate/thin/cannibalising content.
- Trust signals: authorship, contact, policies, reviews.

Use `checklists/audit.md` as the master checklist and tag each item with a
severity and evidence.

### Phase 3 — Prioritise

Score every finding:

```text
Priority = Impact (1–5) × Confidence (1–5) ÷ Effort (1–5)
```

Then sort by severity first, score second. Produce a plan with:

- Finding → root cause → proposed fix → owner → effort → verification method.
- Explicit "do not touch" list.
- Rollback plan for `P0`/`P1` changes.

### Phase 4 — Implement

- Work in small, reversible batches; one concern per change.
- Preserve design system, copy voice, analytics, and accessibility.
- For Next.js/React: metadata via the framework API, not manual `<head>` hacks.
- For CMS: prefer template-level fixes over per-page edits.
- For redirects: one hop, absolute target, preserve query strings where needed.
- Never ship placeholder `example.com`, `TODO`, `undefined`, or lorem ipsum.
- Update tests/checks alongside the fix when possible.

### Phase 5 — Verify

Re-run the same checks as the baseline, plus targeted checks for the change:

```bash
node .opencode/skills/seo-legend/scripts/seo-audit.mjs \
  --url=https://example.com --site=https://example.com \
  --max=100 --json=seo-after.json
```

Then compare `seo-baseline.json` and `seo-after.json` and record:

- Fixed, unchanged, regressed.
- New warnings introduced.
- Any URL that disappeared from the sitemap or became non-200.
- Rendered metadata/schema equality with intent.

### Phase 6 — Red-team review

Run `missions/04-red-team-review.md`. A second pass must actively try to falsify
the result: find false passes, stale sitemap entries, canonical loops, schema
that doesn't match visible content, consent leaks, and regressions.

### Phase 7 — Sign off

Use `checklists/agent-signoff.md`. Sign-off requires:

- No open `P0`; all `P1` closed or covered by a human-approved waiver.
- Evidence ledger complete.
- Before/after comparison recorded.
- No unresolved regressions.
- Human approval recorded for `L3`.
- Rollback instructions written.

---

## 6. Reference routing table

Read only what the mission needs, then go deep.

| Symptom / task | Read |
| --- | --- |
| Crawling, indexing, canonicals, redirects, robots, sitemaps, JS rendering | `references/01-technical.md` |
| Titles, descriptions, headings, content quality, internal links, E-E-A-T | `references/02-on-page-and-content.md` |
| Schema.org, JSON-LD, rich results, validation | `references/03-structured-data.md` |
| Core Web Vitals, images, fonts, JS, caching, measurement | `references/04-performance.md` |
| hreflang, multi-language, multi-region, geotargeting | `references/05-international.md` |
| Products, variants, categories, facets, pagination, stock | `references/06-ecommerce.md` |
| Google Business Profile, NAP, local landing pages, reviews | `references/07-local.md` |
| `llms.txt`, AI crawlers, agent-readable content, AI citations | `references/08-ai-search.md` |
| GA4, consent mode, privacy, cookie banners, tracking QA | `references/09-analytics-consent.md` |
| GSC/Bing, KPIs, reporting, forecasting, rank tracking | `references/10-measurement.md` |
| Replatform, domain change, URL migration, redirect maps | `references/11-migrations.md` |
| Spam policies, ethics, risk, safety | `references/12-risk-ethics.md` |
| Official sources and freshness | `references/13-sources.md` |

Framework-specific notes: `references/14-frameworks.md` (Next.js, WordPress,
Shopify, Apache/Nginx, static hosts).

---

## 7. Deliverables

Every audit must produce:

1. **Executive summary** — 5 bullets max, business language, no jargon dump.
2. **Scorecard** — categories, pass/fail, severity counts.
3. **Findings table** — ID, severity, evidence, root cause, fix, effort.
4. **Prioritised plan** — what to do now/next/later, with owners.
5. **Evidence appendix** — commands, JSON, screenshots, GSC exports.
6. **Verification report** — before/after, regressions, residual risk.

Templates and formats live in `templates/`.

---

## 8. Tooling

### 8.1 Portable audit script

`scripts/seo-audit.mjs` — zero-dependency Node 18+ crawler/auditor.

```bash
# Audit a live site via its sitemap
node scripts/seo-audit.mjs --url=https://example.com --site=https://example.com

# Audit a local build without a public sitemap
node scripts/seo-audit.mjs --url=http://127.0.0.1:3000 \
  --routes=/,/about,/contact --site=https://example.com

# Deep link check + JSON report
node scripts/seo-audit.mjs --url=https://example.com --check-links --json=report.json
```

It checks: status codes, redirects, titles, descriptions, canonicals, robots
meta, `X-Robots-Tag`, H1s, lang, viewport, Open Graph, Twitter cards, JSON-LD
syntax and core fields, image alt attributes, sitemap/robots health, duplicate
metadata, sitemap indexability, and (optionally) same-origin link targets.

Exit code: `1` when a `P0`/`P1` finding exists, `0` otherwise. Treat the JSON as
the evidence, not the console text.

### 8.2 Browser checks (when a browser tool is available)

- Disable JavaScript and confirm primary content/links still exist.
- Compare `view-source:` HTML with the rendered DOM.
- Capture LCP element, CLS sources, INP interactions in DevTools.
- Verify consent: no vendor requests before opt-in; no cookies pre-consent.
- Test 404, 410, redirect chains, and mobile viewport.

### 8.3 External verification (human-provided access)

- Google Search Console: Pages, Sitemaps, Core Web Vitals, Enhancements.
- Bing Webmaster Tools.
- PageSpeed Insights / CrUX for field data.
- Rich Results Test and Schema Markup Validator.
- `curl -I`, `curl -sL`, and log-file analysis.

Never claim GSC/PSI results you have not seen.

### 8.4 Package validation

When maintaining this skill, run:

```bash
node scripts/validate-skill.mjs
```

It checks required files, checklist ID uniqueness, automated-ID registration,
relative links and qualified paths, and the auditor's syntax. A change to the
auditor or checklists is not complete until this passes.

---

## 9. Agent handoff contract

When another agent (or a future you) picks up the mission, the handoff must
contain:

```yaml
mission: <one-line objective>
status: recon | audit | implementing | verifying | blocked | done
scope: <hosts/paths/locales>
risk_tier: L0 | L1 | L2 | L3
changed:
  - <file/URL + what changed>
evidence:
  - <path to report/screenshot/log>
open:
  - <ID + severity + why open>
next:
  - <single next action>
rollback: <exact command/steps>
```

Mission prompts you can paste into any agent:

- `missions/01-full-audit.md`
- `missions/02-implement.md`
- `missions/03-verify.md`
- `missions/04-red-team-review.md`
- `missions/05-fix-loop.md`

---

## 10. Definition of Done

A mission is done only when **all** are true:

- [ ] Mission brief filled and scope respected.
- [ ] Automated audit run before and after; JSON artifacts saved.
- [ ] No open `P0`; all `P1` fixed or covered by a human-approved, time-bound
      waiver with a compensating control.
- [ ] `P2` items either fixed or scheduled with owner/date.
- [ ] Every finding has evidence (command, URL, screenshot, export).
- [ ] Titles/descriptions/canonicals/H1s are unique and intentional.
- [ ] Sitemap URLs are 200, indexable, canonical, and self-consistent.
- [ ] robots.txt and headers do not block intended content.
- [ ] Structured data parses, matches visible content, and has no required-field
      errors for the chosen type.
- [ ] Mobile rendering and Core Web Vitals baselines recorded; no regression.
- [ ] No accessibility regressions introduced.
- [ ] Consent gate still blocks analytics/marketing before opt-in.
- [ ] Redirects are single-hop and no redirect chains/loops were introduced.
- [ ] No placeholder or fabricated content shipped.
- [ ] Before/after diff and rollback notes written.
- [ ] Human sign-off recorded for `L2`/`L3`.

---

## 11. Quick start (copy/paste)

```bash
# 1. Baseline
node scripts/seo-audit.mjs --url=https://example.com --site=https://example.com \
  --max=100 --json=seo-baseline.json

# 2. Read the findings, then open the matching references/checklists.

# 3. Implement in small batches (L1 → L2).

# 4. Re-run
node scripts/seo-audit.mjs --url=https://example.com --site=https://example.com \
  --max=100 --json=seo-after.json

# 5. Diff + sign off
node -e "const a=require('./seo-baseline.json'),b=require('./seo-after.json');console.log('before',a.summary,'after',b.summary)"
```

If you only remember one thing: **crawlable, indexable, canonical, useful,
fast, honest, and verified — in that order.**
