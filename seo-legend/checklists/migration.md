# Migration checklist

Use for domain changes, URL structure changes, replatforming, protocol changes,
locale expansion, or any release that retires URLs. Copy into the mission
directory and fill every row.

Migration: `<name>`
Old → new: `<old host/path> → <new host/path>`
Window: `<start/end + timezone>`
Risk tier: `<L3>`
Rollback owner: `<name>`

---

## 1. Discovery (T-6 to T-2 weeks)

- [ ] Freeze non-essential URL/content changes.
- [ ] Crawl the entire old site; export URL, status, canonical, title,
      description, H1, lang, robots, sitemap membership.
- [ ] Export GSC Performance (16 months), Pages, Sitemaps, CWV, Enhancements.
- [ ] Export Bing Webmaster data.
- [ ] Export analytics landing pages, organic sessions, conversions (12 months).
- [ ] Inventory backlinks and top-linked URLs.
- [ ] Identify all URL patterns: pages, posts, products, categories, tags,
      authors, dates, pagination, facets, search, feeds, assets, PDFs.
- [ ] Identify locales and hreflang clusters.
- [ ] List every external system referencing old URLs (ads, emails, social,
      partner sites, QR codes, app deep links).
- [ ] Confirm what must be preserved vs intentionally retired.

## 2. URL map (T-2 weeks)

Complete **before** build work. One row per old URL or pattern.

| Old URL/pattern | New URL | Type | Query handling | Reason | Owner | Tested |
| --- | --- | --- | --- | --- | --- | --- |
| `/old-page` | `/new-page` | 301 | preserve | renamed | | ☐ |
| `/p/:id` | `/products/:slug` | 301 | drop tracking | structure | | ☐ |
| `/category?sort=` | `/category` | 301 | drop sort | duplicate | | ☐ |
| `/retired` | `/closest` | 301 | preserve | retired | | ☐ |
| `/no-equivalent` | `410` | 410 | n/a | removed | | ☐ |

Rules:

- Closest equivalent, never the homepage by default.
- One hop only. No redirect to a redirect.
- No redirect to a 404, `noindex`, or another domain unless intentional.
- Preserve query strings where they change content; drop tracking params.
- Case/trailing-slash variants map to the canonical winner.
- Every high-value backlink URL is mapped.
- Remove redirected URLs from the new sitemap.
- Document intentional 410s and their reason.

## 3. Build and staging (T-2 weeks to T-1 day)

- [ ] Staging is password-protected **and** `noindex` (meta + header + robots).
- [ ] Staging canonical does not point to production unless deliberate.
- [ ] Analytics/consent disabled or sandboxed on staging.
- [ ] Redirects implemented at server/CDN level, not only CMS.
- [ ] Redirects tested with production `Host` header.
- [ ] New sitemap generated from canonical URLs only.
- [ ] robots.txt is production-ready (no staging leftovers).
- [ ] Metadata templates recreated for every template.
- [ ] Canonical host/protocol/trailing-slash policy enforced.
- [ ] Structured data recreated and validated.
- [ ] Internal links generate new URLs.
- [ ] Pagination/facets/search rules implemented.
- [ ] Images/CDN paths resolve; no mixed content.
- [ ] 404 returns 404; 410 returns 410.
- [ ] hreflang clusters recreated, reciprocal, self-referential.
- [ ] Analytics/consent retested.
- [ ] Full crawl of staging passes (0 unexpected 4xx/5xx).
- [ ] URL map coverage: 100% of old URLs accounted for.
- [ ] Rollback tested.

### Staging crawl command

```bash
node <skill>/scripts/seo-audit.mjs \
  --url=<staging-url> \
  --site=<production-canonical> \
  --max=500 \
  --check-links \
  --json=<evidence-dir>/staging.json
```

## 4. Launch day

- [ ] Deploy approved artifact.
- [ ] Verify DNS/TLS/CDN.
- [ ] `robots.txt` production-safe.
- [ ] Sitemap live and correct.
- [ ] Spot-check top 20 URLs + one per template.
- [ ] Test 50 random old URLs: single hop → 200.
- [ ] Test 404/410 behaviour.
- [ ] Verify canonical tags on 10 URLs.
- [ ] Verify structured data on 5 URLs.
- [ ] Verify analytics/consent.
- [ ] Submit new sitemap in GSC/Bing.
- [ ] Request indexing for top URLs.
- [ ] Domain change only: Change of Address in GSC.
- [ ] Monitor 5xx/404/redirect rate continuously for 24h.
- [ ] Announce internally; freeze unrelated changes.

## 5. Post-launch — day 1–3

- [ ] Crawl new site; compare against URL map.
- [ ] GSC coverage/indexing errors reviewed.
- [ ] Top 404s in logs; add missing redirects.
- [ ] Sitemap discovery confirmed.
- [ ] Key rankings/traffic did not collapse (context: normal fluctuation).
- [ ] Internal links to old URLs fixed.
- [ ] Analytics/consent working.
- [ ] CDN/cache behaving.

## 6. Post-launch — week 1–2

- [ ] GSC "Not found (404)" and "Redirect error" trends.
- [ ] Redirect chains/loops fixed.
- [ ] Indexed count trending toward baseline.
- [ ] CWV and Enhancements reviewed.
- [ ] Top 50 backlink targets resolve.
- [ ] External profiles/ads updated.
- [ ] Old domain redirects monitored (domain change).
- [ ] Staging remains inaccessible.

## 7. Post-launch — week 3–6

- [ ] Full audit re-run; baseline vs after compared.
- [ ] Traffic/conversions vs baseline with seasonality context.
- [ ] Remaining low-value URLs consolidated/redirected.
- [ ] Temporary redirects removed.
- [ ] Old sitemap removed from GSC (after new one verified).
- [ ] Documentation/runbook updated.
- [ ] Lessons learned recorded.
- [ ] Final sign-off.

---

## Domain-change addendum

- [ ] Verify new domain in GSC/Bing **before** launch.
- [ ] 301 every old URL to its equivalent on the new domain.
- [ ] Keep the old domain registered and redirected for ≥1 year.
- [ ] Update canonical host, sitemap, robots, OG, schema, hreflang.
- [ ] Update `sameAs`, email, ads, social, directories, invoices.
- [ ] Use Change of Address (old property).
- [ ] Monitor old domain 404s and traffic.
- [ ] Do not reuse a domain with a spammy history without due diligence.
- [ ] Keep both properties accessible during the transition.

## Common failure modes

| Failure | Result | Prevention |
| --- | --- | --- |
| Everything → homepage | Soft 404/doorway signals | 1:1 map |
| Chains/loops | Crawl waste, lost equity | Automated hop test |
| Old sitemap live | Wrong URLs indexed | Regenerate + submit |
| `noindex` on production | Deindexing | Launch checklist |
| Staging indexed | Duplicate/hacked results | Auth + noindex |
| Canonical to old domain | New URLs not indexed | Template audit |
| robots blocks assets | Rendering failures | GSC test |
| Metadata templates lost | CTR/traffic loss | Parity checks |
| Analytics/consent broken | Blind measurement | QA matrix |
| No rollback | Extended outage | Tested rollback |

## Sign-off

```text
URL map coverage: <old URLs mapped / total>
Redirects verified: <n>/<n> single-hop, targets 200
Sitemap URLs: <n>, non-200: <n>, noindex: <n>
GSC critical errors: <n>
Traffic vs baseline (28d): <value + context>
Verdict: PASS | CONDITIONAL | FAIL
Evidence: <path>
Approved by: <name/date>
```
