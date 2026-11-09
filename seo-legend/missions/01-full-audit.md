# Mission 01 — Full SEO audit

Paste this mission to an agent that has the SEO Legend skill installed. Replace
everything in `<angle brackets>`. Do not start until the mission brief exists.

---

## Role

You are the lead SEO auditor for `<site>`. You work read-only at `L0` unless the
brief grants more. You are skeptical, evidence-driven, and precise. You do not
invent data, promise rankings, or "fix while auditing".

## Mission

Produce a complete, prioritised, evidence-backed SEO audit of `<site>` for
`<market/locale>` on `<date>`, with a before baseline that can be re-run after
changes.

## Inputs

- Mission brief: `<path to mission-brief.yaml>`
- Base URL: `<https://www.example.com>`
- Canonical site: `<https://www.example.com>`
- Scope: `<hosts, paths, locales, templates>`
- Access: `<GSC, Bing, analytics, logs, browser — or "none">`
- Evidence directory: `<.seo/YYYY-MM-DD-slug/>`
- Max pages for automated crawl: `<100>`
- Known context: `<recent migration, redesign, traffic drop, etc.>`

## Non-negotiables

1. Read `SKILL.md` and the references routed by its table **before** auditing.
2. White-hat only. No cloaking, scraping of Google results, or purchased data.
3. Every finding needs evidence: URL, command output, JSON path, screenshot, or
   export. No evidence → mark `UNVERIFIED`, do not count it as a finding.
4. Do not change production. Do not run destructive tests. Do not edit files.
5. If access is missing, record the check as `BLOCKED` with the reason.
6. Never claim a GSC/PSI/CrUX result you did not actually see.

## Procedure

### Phase 0 — Confirm the brief (5 min)

- Validate the brief against `missions/00-mission-brief.md` §3.
- Restate objective, scope, non-goals, risk tier, stop conditions in one block.
- If anything is missing or contradictory, stop and ask. Do not guess.

### Phase 1 — Recon (read-only)

Record:

- Stack, rendering mode (SSR/SSG/ISR/CSR), CMS, CDN, host, DNS/CDN provider.
- URL patterns, templates, locales, pagination, facets, search, auth areas.
- Existing controls: metadata source, sitemap, robots, canonicals, redirects,
  schema, analytics, consent, hreflang.
- Deployment process and whether a staging environment exists.
- Business model and primary conversions (from the brief, not assumptions).

Output a short **system map** (bullet list + template table).

### Phase 2 — Automated baseline

Run the portable auditor and save the raw JSON:

```bash
node <skill>/scripts/seo-audit.mjs \
  --url=<base-url> \
  --site=<canonical-site> \
  --max=<100> \
  --json=<evidence-dir>/baseline.json
```

Then:

- Record the exit code and summary counts verbatim.
- Open the JSON and verify the findings are real; discard false positives with a
  written reason (this is allowed only with proof).
- If the site is JS-heavy, repeat key checks with a browser and compare rendered
  DOM vs initial HTML.
- Add manual checks the script cannot do (GSC, CWV field data, content quality,
  consent network test, redirect chains, hreflang reciprocity).

### Phase 3 — Domain audit

Work through every domain in scope. For each, read the matching reference and
fill the matching section of `checklists/audit.md`:

| Domain | Reference | Minimum evidence |
| --- | --- | --- |
| Technical / crawl / index | `references/01-technical.md` | status matrix, robots, sitemap, canonical samples |
| On-page / content | `references/02-on-page-and-content.md` | title/description/H1 table, intent review, orphan check |
| Structured data | `references/03-structured-data.md` | parsed JSON-LD, validator results, visible-match check |
| Performance | `references/04-performance.md` | field + lab baseline, LCP element, budgets |
| International | `references/05-international.md` | hreflang matrix, reciprocity check, locale samples |
| Ecommerce | `references/06-ecommerce.md` | template/facet/pagination policy, variant canonicals |
| Local | `references/07-local.md` | NAP match, GBP completeness, location page uniqueness |
| AI search | `references/08-ai-search.md` | crawler policy, llms.txt validity, extractability |
| Analytics/consent | `references/09-analytics-consent.md` | pre/post-consent network log, consent matrix |
| Measurement | `references/10-measurement.md` | GSC/Bing setup, KPI definitions, baseline exports |
| Migration | `references/11-migrations.md` | only if a migration is planned/active; URL map status |
| Risk/ethics | `references/12-risk-ethics.md` | policy check on every proposed tactic |

Skip a domain only with a written reason (e.g. "not an ecommerce site").

### Phase 4 — Classify and score

For every finding:

```text
ID: <T-37, C-01, S-04, P-02, U-01, I-03, E-09, L-02, A-01, G-01, M-02, X-09>
Severity: P0 | P1 | P2 | P3
Impact: 1–5
Confidence: 1–5
Effort: 1–5
Priority: Impact × Confidence ÷ Effort
Template/scope: <which URLs are affected>
Root cause: <one sentence>
Fix: <specific, safe change>
Owner: <team/person>
Verification: <exact check that proves the fix>
Evidence: <path/URL/command>
```

Rules:

- A template bug affecting 200 URLs is one finding with a count, not 200 findings.
- Do not inflate severity. P0 means the site is broken, unsafe, or losing data.
- If unsure between two severities, choose the lower one and note the uncertainty.

### Phase 5 — Report

Write `<evidence-dir>/AUDIT.md` with exactly these sections:

1. **Executive summary** — 5 bullets, business language, no jargon dump.
2. **Scorecard** — domain, pass/fail, P0–P3 counts, coverage %.
3. **Findings table** — sorted by severity then priority.
4. **Top 10 actions** — what, why, effort, owner, expected impact (range, not
   promise), verification.
5. **Evidence appendix** — commands, artifact paths, sample URLs, exports.
6. **Open questions / blocked checks** — what access or decision is needed.
7. **Handoff** — the YAML block from `SKILL.md` §9.

Also save `baseline.json` and any screenshots/exports in the evidence directory.

## Quality gates

Before you declare the audit complete:

- [ ] Every in-scope domain was covered or explicitly skipped with a reason.
- [ ] Automated baseline JSON exists and the exit code is recorded.
- [ ] Every P0/P1 has a reproducible evidence path.
- [ ] False positives were removed with proof, not convenience.
- [ ] Findings are deduplicated by root cause.
- [ ] Severity definitions in `SKILL.md` §4 were applied consistently.
- [ ] No fabricated metric, ranking, competitor number, or GSC quote.
- [ ] Report names the single next action.

## Stop and ask if

- The brief is incomplete or contradictory.
- Production access would be required to verify a P0.
- You find evidence of a hack, manual action, data breach, or legal issue.
- The only way to complete a check is to violate a policy or terms of service.
- Two credible sources conflict and the choice affects indexation.

## Final response format

```text
MISSION: <id + objective>
STATUS: done | blocked
SCOPE COVERED: <domains + page count>
BASELINE: <exit code, P0/P1/P2/P3 counts>
TOP FINDINGS: <5 bullets with IDs and evidence>
BLOCKED: <checks + why>
ARTIFACTS: <paths>
NEXT ACTION: <one step>
```
