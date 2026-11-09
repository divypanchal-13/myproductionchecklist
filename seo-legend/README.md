# SEO Legend

**Mission-grade SEO for humans and autonomous agents.** Audit, implement,
verify, and sign off — with evidence, not vibes.

SEO Legend is a portable [OpenCode skill](https://opencode.ai/v2/docs/skills)
that turns an agent into a disciplined SEO operator: it reads the site, runs a
crawler, prioritises findings by severity, makes small reversible fixes, and
proves the result before claiming success.

It is free, MIT-licensed, vendor-neutral, and white-hat only.

---

## Why this exists

Most SEO advice is a list of tips. Agents need something stricter:

- a **mission brief** with measurable success criteria;
- **autonomy levels** so an agent cannot accidentally edit production;
- **severity + evidence gates** so "looks good" never becomes a pass;
- **bounded fix loops** so an agent stops instead of thrashing;
- **independent verification and red-team review**;
- **portable tooling** that runs anywhere Node 18+ runs.

SEO Legend provides all of that, plus deep reference material for technical SEO,
content, structured data, performance, international, ecommerce, local, AI
search, analytics/consent, measurement, migrations, and risk.

---

## What's inside

```text
seo-legend/
├── SKILL.md                     # the contract: workflow, gates, routing
├── README.md                    # this file
├── CHANGELOG.md                 # version history
├── LICENSE                      # MIT
├── references/                  # 14 deep-dive domains
│   ├── 01-technical.md
│   ├── 02-on-page-and-content.md
│   ├── 03-structured-data.md
│   ├── 04-performance.md
│   ├── 05-international.md
│   ├── 06-ecommerce.md
│   ├── 07-local.md
│   ├── 08-ai-search.md
│   ├── 09-analytics-consent.md
│   ├── 10-measurement.md
│   ├── 11-migrations.md
│   ├── 12-risk-ethics.md
│   ├── 13-sources.md
│   └── 14-frameworks.md
├── missions/                    # paste-ready agent missions
│   ├── 00-mission-brief.md
│   ├── 01-full-audit.md
│   ├── 02-implement.md
│   ├── 03-verify.md
│   ├── 04-red-team-review.md
│   └── 05-fix-loop.md
├── checklists/
│   ├── audit.md                 # master checklist (222 checks)
│   ├── page.md                  # single-page QA
│   ├── launch.md                # launch / release gate
│   ├── migration.md             # migration gate
│   └── agent-signoff.md         # final sign-off + waivers
├── templates/
│   ├── metadata.md              # titles, descriptions, OG, Next.js examples
│   ├── json-ld.md               # schema graphs by type
│   ├── robots.txt               # production/staging/AI crawler policies
│   ├── llms.txt                 # v2 proposal format + markdown mirrors
│   └── server-headers.md        # Apache/NGINX/Next.js headers
└── scripts/
    ├── seo-audit.mjs            # zero-dependency Node 18+ auditor
    └── validate-skill.mjs       # package consistency check
```

---

## Install

### OpenCode — project scope

```bash
# from your project root
mkdir -p .opencode/skills
cp -R /path/to/seo-legend .opencode/skills/seo-legend
```

OpenCode discovers `.opencode/skills/<id>/SKILL.md` automatically. The skill ID
is the directory name (`seo-legend`).

### OpenCode — global scope

```bash
# macOS / Linux
mkdir -p ~/.config/opencode/skills
cp -R /path/to/seo-legend ~/.config/opencode/skills/seo-legend

# Windows (PowerShell)
New-Item -ItemType Directory -Force "$env:USERPROFILE\.config\opencode\skills" | Out-Null
Copy-Item -Recurse .\seo-legend "$env:USERPROFILE\.config\opencode\skills\seo-legend"
```

### Other agents

The format is intentionally simple:

- `SKILL.md` has YAML frontmatter with `name` and `description`.
- Supporting paths are relative to the skill directory.
- The audit script is plain Node 18+ with no dependencies.

Point your agent at `SKILL.md` and tell it to read the referenced file for the
task. Do not paste all 14 references into a context window; route, then read.

### Requirements

| Capability | Needed for |
| --- | --- |
| Node.js 18+ | `scripts/seo-audit.mjs` |
| HTTP access to the target | crawling and status checks |
| File read/write | implementing fixes |
| Browser tool (optional) | rendered DOM, CWV, consent network checks |
| GSC/Bing/analytics access (optional) | field data and index status |

No API keys, accounts, or paid services are required for the core audit.

---

## Quick start

### 1. Run the auditor

```bash
node .opencode/skills/seo-legend/scripts/seo-audit.mjs \
  --url=https://www.example.com \
  --site=https://www.example.com \
  --max=100 \
  --json=seo-baseline.json
```

### 2. Read the result

```text
P0 — 0
P1 — 2
  [T-40] https://www.example.com/guides/...
        Indexable page is missing a canonical tag
  [T-37] https://www.example.com/old-page
        Page returns HTTP 404
Summary: P0=0 P1=2 P2=8 P3=12
Result: FAIL — P0/P1 findings require action.
```

Exit code is `1` when P0/P1 exist, `0` otherwise. The JSON report is the
evidence; the console is a summary.

### 3. Fill the mission brief

Copy `missions/00-mission-brief.md` into your evidence directory, fill it, and
get approval at the right autonomy level. Do not start with "quick fixes".

### 4. Run a mission

Paste the relevant prompt into your agent:

| Goal | Mission |
| --- | --- |
| Full audit | `missions/01-full-audit.md` |
| Implement approved fixes | `missions/02-implement.md` |
| Independent verification | `missions/03-verify.md` |
| Adversarial review | `missions/04-red-team-review.md` |
| Bounded fix loop | `missions/05-fix-loop.md` |

### 5. Verify and sign off

```bash
node .opencode/skills/seo-legend/scripts/seo-audit.mjs \
  --url=https://www.example.com \
  --site=https://www.example.com \
  --max=100 \
  --json=seo-after.json
```

Compare `seo-baseline.json` and `seo-after.json`, then complete
`checklists/agent-signoff.md`.

---

## The audit script

```text
node seo-audit.mjs --url=<url> [options]
```

| Option | Default | Meaning |
| --- | --- | --- |
| `--url` | required | Target to fetch |
| `--site` | `--url` | Canonical production origin used for comparisons |
| `--max` | `50` | Max pages to audit |
| `--routes` | — | Comma-separated paths instead of sitemap discovery |
| `--json` | — | Write the full JSON report |
| `--check-links` | off | Check same-origin internal link targets |
| `--link-limit` | `100` | Max links to check |
| `--sitemap-check` | `100` | Status-check non-audited sitemap URLs (0 disables) |
| `--concurrency` | `4` | Parallel requests |
| `--timeout` | `15000` | Per-request timeout in ms |
| `--user-agent` | `SEOLegendAudit/1.0` | Custom UA |
| `--strict-host` | off | Canonical host mismatch becomes P1 |
| `--check-external-canonicals` | off | Fetch canonical targets on the `--site` origin |
| `--exit-zero` | off | Report-only mode; always exit 0 |

### What it checks

- `robots.txt`: status, content type, `Disallow: /`, sitemap directive,
  path-blocking.
- Sitemaps: discovery, index recursion, XML validity, gzip, duplicates,
  off-site URLs, URL status, redirects, `X-Robots-Tag: noindex`.
- Pages: status, redirect chains/loops, content type, title, description,
  canonical, meta robots, `X-Robots-Tag`, H1 count, lang, viewport, meta refresh,
  Open Graph, Twitter card, duplicate titles/descriptions.
- Structured data: JSON syntax, `@context`, core required fields for
  Organization, WebSite, WebPage, Article, Product, LocalBusiness, BreadcrumbList,
  FAQPage, Event, VideoObject.
- Images: missing `alt` attribute, missing dimensions/aspect-ratio.
- Security headers: `X-Content-Type-Options`, `Referrer-Policy`, frame
  protection, HSTS on HTTPS.
- Canonical targets: status, redirects, `noindex` (where reachable).
- Internal links (optional): broken targets, redirect chains.
- 404 handling: a random missing URL must not return 200.

### What it does **not** do

- It does not query Google Search Console, Bing, CrUX, or PageSpeed Insights.
- It does not execute JavaScript; use a browser for rendered-DOM checks.
- It does not measure Core Web Vitals; use PSI/CrUX/DevTools/RUM.
- It does not prove rich-result eligibility; use the Rich Results Test.
- It does not validate hreflang reciprocity across a full cluster.
- It does not replace human content quality review or legal review.
- It is not a rank tracker and never scrapes Google results.

The report says `PASS` only for the automated checks it actually ran. Absence of
a finding is not proof that a page is good.

### JSON shape

```json
{
  "meta": { "tool": "seo-legend-audit", "version": "1.0.0", "target": "...", "site": "..." },
  "robots": { "status": 200, "disallowAll": false, "sitemaps": [] },
  "sitemaps": { "roots": [], "loaded": [], "urlCount": 0, "duplicates": 0 },
  "pages": [
    { "url": "...", "status": 200, "canonical": "...", "title": "...", "h1Count": 1, "jsonLdTypes": [] }
  ],
  "findings": [
    { "id": "T-40", "severity": "P1", "category": "technical", "url": "...", "message": "...", "evidence": "..." }
  ],
  "summary": { "pagesAudited": 0, "findings": { "P0": 0, "P1": 0, "P2": 0, "P3": 0 }, "exitCode": 0 }
}
```

Use the JSON as evidence in the mission report. Do not edit the JSON to make a
result look better; re-run the audit.

### Validate the skill package

```bash
node .opencode/skills/seo-legend/scripts/validate-skill.mjs
```

It checks required files, checklist ID uniqueness, automated-ID registration,
relative links and qualified paths, finding IDs mentioned in markdown, and the
auditor's syntax. Run it after editing the skill; it is the maintainer's
regression test.

---

## Autonomy model

| Level | Agent may | Human approval |
| --- | --- | --- |
| `L0` | Read, crawl, analyse, report | None |
| `L1` | Propose diffs/content/redirects | Approve plan |
| `L2` | Write to branch/staging, verify | Approve merge/deploy |
| `L3` | Change production | Per-change approval + rollback |

Default to `L1`. An agent cannot promote itself. Anything that can deindex,
delete, redirect, or expose data is `L3`.

---

## Evidence rules

1. **No evidence, no pass.** Record command, URL, JSON path, screenshot, or
   export.
2. **Baseline first.** Capture before changing anything, with the same scope and
   flags as the after run.
3. **Template bugs are one finding**, not 200 duplicate findings.
4. **No fabricated metrics.** If you did not measure it, say `UNVERIFIED`.
5. **No ranking promises.** Report impact ranges, confidence, effort.
6. **Waivers are written, time-bound, and owned.** P0 cannot be waived.

---

## Contributing

SEO Legend is meant to be shared, forked, translated, and improved.

### What we want

- Corrections backed by a primary source (Google, web.dev, W3C, IETF, schema.org,
  official platform docs).
- New checks in `scripts/seo-audit.mjs` that are deterministic and low-noise.
- New reference sections with clear procedures, not opinion dumps.
- Framework notes for real stacks (Next.js, WordPress, Shopify, Astro, Nuxt,
  Apache, NGINX, Cloudflare).
- Translations that preserve the meaning and the safety rules.
- Mission prompts and checklists that make agents more disciplined.

### What we will reject

- Black-hat or policy-violating tactics: cloaking, doorway pages, link schemes,
  fake reviews, scraped content, rank scraping, `llms.txt` ranking guarantees.
- "Case studies" with invented numbers.
- Vendor spam, affiliate link insertion, or pay-to-list recommendations.
- Advice that violates privacy, accessibility, or consumer law.
- Checks that only pass by weakening the test.

### How to add a reference

1. Pick the domain and read `references/13-sources.md`.
2. Verify every claim against a primary source; record the URL and date.
3. Use the existing structure: rules → procedures → checklists → acceptance
   criteria → sources.
4. Add the file to the routing table in `SKILL.md`.
5. Keep it actionable. An agent should be able to execute it without asking
   "what exactly do I do?".
6. Test any scripts on a real site and include the command + expected output.

### How to add a check to the auditor

- One finding = one root cause; use the existing ID scheme.
- Severity must match `SKILL.md` §4.
- Include a reproducible `evidence` string.
- Avoid false positives; if a check is ambiguous, make it a warning (`P2`/`P3`).
- Do not make network calls to third-party APIs by default.
- Run `node --check` and a live test before opening a PR.

### Style

- Plain English, short paragraphs, tables where they help.
- No emoji in normative content.
- Use `P0`–`P3`, `L0`–`L3`, and the existing IDs consistently.
- Prefer "verify with X" over "best practice".
- Link to primary sources, not blog summaries.

### Versioning

- `SKILL.md` frontmatter and `scripts/seo-audit.mjs` carry the version.
- Add a changelog entry when behaviour or defaults change.
- Breaking changes to the audit JSON shape require a major version bump.

---

## Safety and scope

SEO Legend is **not legal advice**. Privacy, consent, consumer law, and
accessibility requirements vary by jurisdiction. Obtain qualified review.

It is **not a guarantee of rankings, traffic, or rich results**. Search is
probabilistic; algorithms and policies change. The skill reports evidence and
risk, not promises.

It is **not a licence to attack a site**. Only audit systems you own or have
written permission to test. Do not run destructive tests, bypass authentication,
or ignore rate limits.

---

## License

MIT. See `LICENSE`. Use it, fork it, teach with it, ship it inside your agency.
Attribution is appreciated but not required.

**If you only remember one thing:** crawlable, indexable, canonical, useful,
fast, honest, and verified — in that order.
